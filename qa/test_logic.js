const fs = require('fs');
const vm = require('vm');
const path = require('path');
const assert = require('assert');

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(String(key), String(value)); }
  removeItem(key) { this.data.delete(String(key)); }
  key(index) { return [...this.data.keys()][index] ?? null; }
  get length() { return this.data.size; }
}

const localStorage = new MemoryStorage();
const profile = {
  onboarded: true,
  firstName: 'Grace',
  lastName: 'Walker',
  email: 'grace@example.com',
  location: 'Denver, Colorado',
  tradition: 'Broad Christian',
  tone: 'Warm & practical',
  language: 'English',
  goals: ['scripture', 'prayer', 'community'],
  localDiscovery: true,
  privateByDefault: true,
  weeklyDigest: true,
  prayerAlerts: true,
  communityReplies: true,
  ministryUpdates: false,
  donationTotal: 145,
  serviceHours: 8,
};
localStorage.setItem('trumpet.v1.profile', JSON.stringify(profile));

const roots = {
  app: { innerHTML: '' },
  'toast-layer': { innerHTML: '' },
};
const documentListeners = {};
const windowListeners = {};

const documentStub = {
  body: {
    style: {},
    appendChild() {},
  },
  documentElement: { scrollWidth: 1440, clientWidth: 1440 },
  getElementById(id) { return roots[id] || null; },
  querySelector() { return null; },
  addEventListener(type, handler) { documentListeners[type] = handler; },
  createElement(tag) {
    return {
      tagName: String(tag).toUpperCase(),
      style: {},
      value: '',
      innerHTML: '',
      textContent: '',
      appendChild() {},
      remove() {},
      select() {},
      click() {},
      setAttribute() {},
    };
  },
  execCommand() { return true; },
};

const locationStub = {
  hash: '#home',
  protocol: 'file:',
  reload() {},
};
const historyStub = {
  pushState(_state, _title, url) {
    if (typeof url === 'string' && url.includes('#')) locationStub.hash = url.slice(url.indexOf('#'));
  },
  replaceState(_state, _title, url) {
    if (typeof url === 'string' && url.includes('#')) locationStub.hash = url.slice(url.indexOf('#'));
  },
};

Object.assign(globalThis, {
  window: globalThis,
  document: documentStub,
  localStorage,
  location: locationStub,
  history: historyStub,
  requestAnimationFrame: (callback) => callback(),
  cancelAnimationFrame: () => {},
  HTMLInputElement: class {},
  HTMLTextAreaElement: class {},
  HTMLSelectElement: class {},
});
Object.defineProperty(globalThis, 'navigator', { value: {}, configurable: true });

// Node's real FormData cannot be constructed from our stub elements, so the
// harness supplies one that reads values off the fake form.
globalThis.FormData = class {
  constructor(form) { this._values = (form && form.__values) || {}; }
  get(key) { return key in this._values ? this._values[key] : null; }
};
window.addEventListener = (type, handler) => { windowListeners[type] = handler; };
window.scrollTo = () => {};

const code = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
vm.runInThisContext(code, { filename: 'app.js' });

assert(window.TrumpetDemo, 'Trumpet demo API should be exposed');

const submitForm = (id, values) => {
  documentListeners.submit({ target: { id, __values: values }, preventDefault() {} });
};
assert(roots.app.innerHTML.includes('What would be helpful today?'), 'Home view should render');
assert(roots.app.innerHTML.includes('Prayer watch'), 'Home view should include prayer watch');
assert(roots.app.innerHTML.includes('href="#ask"'), 'Primary navigation should use real links');
assert.strictEqual(document.title, 'Today — Trumpet Nation', 'Document title should match the current view');

window.TrumpetDemo.navigate('ask');
assert.strictEqual(window.TrumpetDemo.state.route, 'ask');
assert(roots.app.innerHTML.includes('Bring the real question.'), 'Ask welcome should render');
assert.strictEqual(document.title, 'Ask Trumpet — Trumpet Nation', 'Ask view should update the document title');
assert(roots.app.innerHTML.includes('Ctrl/⌘+Enter to send'), 'Chat should expose its keyboard shortcut');

const anxiety = window.TrumpetDemo.__test.buildTrumpetResponse('I feel anxious and overwhelmed');
assert(anxiety.includes('Philippians 4:6–7'), 'Anxiety response should include relevant scripture');
assert(anxiety.includes('In nothing be anxious'), 'Scripture blocks should carry the verse text, not only a reference');
const decision = window.TrumpetDemo.__test.buildTrumpetResponse('Help me make a career decision');
assert(decision.includes('data-topic="decision"'), 'Decision response should route to the discernment topic');

// Every answer must keep its epistemic layers visually separable: Scripture,
// interpretation, practical advice, and contested ground are labelled blocks.
for (const [label, response] of [['anxiety', anxiety], ['decision', decision]]) {
  assert(response.includes('is-scripture'), `${label}: Scripture should be its own labelled block`);
  assert(response.includes('is-reading'), `${label}: interpretation should be marked as interpretation`);
  assert(response.includes('is-practice'), `${label}: practical advice should be its own block`);
  assert(response.includes('Where Christians differ'), `${label}: contested ground should be named`);
}

// Translation preference drives the rendered verse text, and licensed
// translations must fall back to a public-domain text rather than showing none.
window.TrumpetDemo.state.profile.translation = 'KJV';
const kjv = window.TrumpetDemo.__test.buildTrumpetResponse('I feel anxious');
assert(kjv.includes('Be careful for nothing'), 'KJV preference should render KJV text');
window.TrumpetDemo.state.profile.translation = 'NIV';
const licensed = window.TrumpetDemo.__test.buildTrumpetResponse('I feel anxious');
assert(licensed.includes('needs a publisher licence'), 'Licensed translations should disclose the licensing gap');
assert(licensed.includes('In nothing be anxious'), 'Licensed translations should fall back to public-domain text');
window.TrumpetDemo.state.profile.translation = 'WEB';

// The faith lens must change the answer, not merely label it.
window.TrumpetDemo.state.profile.tradition = 'Catholic';
const catholic = window.TrumpetDemo.__test.buildTrumpetResponse('I am carrying so much shame');
window.TrumpetDemo.state.profile.tradition = 'Baptist';
const baptist = window.TrumpetDemo.__test.buildTrumpetResponse('I am carrying so much shame');
assert(catholic.includes('Sacramental confession'), 'Catholic lens should surface a tradition-specific path');
assert(catholic !== baptist, 'Faith lens should change the answer, not only its label');
window.TrumpetDemo.state.profile.tradition = 'Broad Christian';

// Crisis routing takes precedence over every other branch, and the escalation
// must not be buried beneath devotional content.
const crisisCases = [
  ['I want to kill myself', 'self-harm', '988'],
  ['my husband hits me and I am afraid', 'abuse', '1-800-799-7233'],
  ['someone is hurting my child', 'child-safety', '1-800-422-4453'],
  ['I am having chest pain and cannot breathe', 'medical', '911'],
];
for (const [prompt, id, resource] of crisisCases) {
  const response = window.TrumpetDemo.__test.buildTrumpetResponse(prompt);
  assert(response.includes(`data-crisis="${id}"`), `Crisis prompt should route to ${id}: ${prompt}`);
  assert(response.includes(resource), `Crisis response for ${id} should name a real resource`);
  assert(!response.includes('is-practice'), `Crisis response for ${id} must not append routine advice`);
  assert(response.indexOf('crisis-resources') < response.indexOf('crisis-comfort'), `Crisis response for ${id} should lead with help, not Scripture`);
}

// A crisis phrase wins even when it arrives wrapped in an ordinary question.
const mixed = window.TrumpetDemo.__test.buildTrumpetResponse('I have been anxious about work and lately I want to die');
assert(mixed.includes('data-crisis="self-harm"'), 'Crisis detection should outrank topic matching');

// A full re-render replaces the tree, which drops focus to <body>. A keyboard
// or screen-reader user who activates a control must land back on that control
// rather than at the top of the page.
{
  const originalQuerySelector = documentStub.querySelector;
  const originalActive = documentStub.activeElement;
  let requestedSelector = null;
  let focusedWithPreventScroll = null;

  documentStub.activeElement = { id: '', dataset: { action: 'pray-request', id: 'prayer-elena' } };
  documentStub.querySelector = (selector) => {
    requestedSelector = selector;
    return { focus(options) { focusedWithPreventScroll = options; } };
  };

  window.TrumpetDemo.__test.render();

  assert.strictEqual(
    requestedSelector,
    '[data-action="pray-request"][data-id="prayer-elena"]',
    'Render should look up the control that had focus',
  );
  assert(focusedWithPreventScroll?.preventScroll, 'Focus should be restored without yanking the scroll position');

  // A control with no data-action gives us nothing to find again; that must be
  // a quiet no-op rather than a bad selector.
  requestedSelector = null;
  documentStub.activeElement = { id: '', dataset: {} };
  window.TrumpetDemo.__test.render();
  assert.strictEqual(requestedSelector, null, 'An unidentifiable control should not be queried for');

  documentStub.querySelector = originalQuerySelector;
  documentStub.activeElement = originalActive;
}

// Every prompt the interface offers must reach a real topic. A suggested
// prompt that falls through to the generic answer is the fastest way to lose
// a live demo, and it regresses silently.
{
  const source = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
  const prompts = new Set();
  for (const match of source.matchAll(/prompt:\s*"([^"]+)"/g)) prompts.add(match[1]);
  for (const match of source.matchAll(/data-prompt="([A-Z][^"$]+)"/g)) prompts.add(match[1].replace(/&#39;/g, "'"));
  assert(prompts.size >= 6, 'Expected to find the interface prompt set');
  for (const prompt of prompts) {
    const response = window.TrumpetDemo.__test.buildTrumpetResponse(prompt);
    assert(/data-topic="/.test(response), `Suggested prompt falls through to the generic answer: ${prompt}`);
  }
}

// A prayer request that trips crisis detection is held at the composer and
// shown resources before it posts — but the person keeps the final say.
const prayerCountBefore = window.TrumpetDemo.state.prayers.length;
submitForm('prayer-form', { text: 'I want to kill myself', scope: 'Community', anonymous: 'on' });
assert.strictEqual(window.TrumpetDemo.state.modal?.type, 'care', 'Crisis text should open the care dialog');
assert.strictEqual(window.TrumpetDemo.state.prayers.length, prayerCountBefore, 'Nothing should post while the care dialog is open');
assert(roots.app.innerHTML.includes('988'), 'Care dialog should name real resources');
assert(roots.app.innerHTML.includes('would not want attached to your name'), 'Public scope should warn about identifying detail');

window.TrumpetDemo.__test.handleAction('close-modal', { dataset: {} });
assert.strictEqual(window.TrumpetDemo.state.modal?.type, 'prayer', 'Going back should return to the composer');
assert(roots.app.innerHTML.includes('I want to kill myself'), 'Going back should preserve the text already written');

window.TrumpetDemo.__test.handleAction('confirm-share', { dataset: {} });
assert.strictEqual(window.TrumpetDemo.state.prayers.length, prayerCountBefore + 1, 'Confirming should still post — interception informs, it does not block');
assert.strictEqual(window.TrumpetDemo.state.pendingShare, null, 'Pending share should clear after posting');
assert.strictEqual(window.TrumpetDemo.state.modal, null, 'Care dialog should close after posting');

// The same check guards the community composer.
const postCountBefore = window.TrumpetDemo.state.posts.length;
submitForm('post-form', { content: 'my husband hits me and I am afraid' });
assert.strictEqual(window.TrumpetDemo.state.modal?.type, 'care', 'Community posts should be checked too');
assert.strictEqual(window.TrumpetDemo.state.posts.length, postCountBefore, 'Nothing should post while the care dialog is open');
assert(roots.app.innerHTML.includes('1-800-799-7233'), 'Care dialog should route to the matching resource');
window.TrumpetDemo.__test.handleAction('confirm-share', { dataset: {} });
assert.strictEqual(window.TrumpetDemo.state.posts.length, postCountBefore + 1, 'Confirming should post the community message');

// An ordinary request is never intercepted.
submitForm('prayer-form', { text: 'please pray for my job interview', scope: 'Community' });
assert.strictEqual(window.TrumpetDemo.state.modal, null, 'Ordinary requests should post without interception');

// Ask → Serve → Give is the product's central claim, so the thread that
// carries a question into action is worth guarding.
{
  window.TrumpetDemo.navigate('ask');
  // Seed the question directly rather than through sendChat, which schedules a
  // reply on a timer that would land in the middle of a later assertion.
  window.TrumpetDemo.state.chatMessages = [
    { id: 'seed-question', role: 'user', content: 'How can our family serve together in our neighborhood?', createdAt: 0 },
  ];

  window.TrumpetDemo.__test.handleAction('follow-suggestion', {
    dataset: { route: 'serve', filter: 'families' },
    textContent: 'Compare opportunities near you',
    closest: () => ({ dataset: { topic: 'serve' } }),
  });

  const journey = window.TrumpetDemo.state.journey;
  assert(journey, 'Following a suggestion should open a thread');
  assert.strictEqual(journey.question, 'How can our family serve together in our neighborhood?', 'The thread should remember the question');
  assert.strictEqual(window.TrumpetDemo.state.serveFocus, 'families', 'The suggestion should carry its focus into Serve');
  assert.strictEqual(window.TrumpetDemo.state.route, 'serve', 'Following a suggestion should navigate');
  assert(roots.app.innerHTML.includes('Closest to what you asked'), 'Serve should lead with what the question was about');
  assert(roots.app.innerHTML.includes('You asked'), 'Serve should say why the person is here');

  window.TrumpetDemo.__test.handleAction('toggle-opportunity', { dataset: { id: 'serve-meals' } });
  assert.strictEqual(journey.steps.at(-1).kind, 'committed', 'Committing should extend the thread');

  // Re-clicking the same suggestion should not stutter the thread.
  const lengthBefore = journey.steps.length;
  window.TrumpetDemo.__test.handleAction('toggle-opportunity', { dataset: { id: 'serve-meals' } });
  window.TrumpetDemo.__test.handleAction('toggle-opportunity', { dataset: { id: 'serve-meals' } });
  assert.strictEqual(journey.steps.length, lengthBefore, 'Re-committing the same opportunity should not duplicate a step');

  assert.deepStrictEqual(
    journey.steps.map((step) => step.kind),
    ['asked', 'explored', 'committed'],
    'The thread should read asked → explored → committed',
  );

  window.TrumpetDemo.__test.handleAction('clear-journey', { dataset: {} });
  assert.strictEqual(window.TrumpetDemo.state.journey, null, 'Clearing should end the thread');

  // Hand the rest of the suite the state it expects.
  if (window.TrumpetDemo.state.committedOpportunities.has('serve-meals')) {
    window.TrumpetDemo.__test.handleAction('toggle-opportunity', { dataset: { id: 'serve-meals' } });
  }
  window.TrumpetDemo.state.serveFocus = '';
  window.TrumpetDemo.state.chatMessages = [];
}

// Onboarding priorities must actually reorder Today, since the view claims they do.
{
  window.TrumpetDemo.navigate('home');
  window.TrumpetDemo.state.profile.goals = ['giving', 'service'];
  window.TrumpetDemo.__test.render();
  // Match the rail headings specifically — "Prayer watch" also appears as a
  // sidebar shortcut, which always renders earlier in the document.
  const givingFirst = roots.app.innerHTML.indexOf('<h3>Where your giving went</h3>');
  const prayerWatch = roots.app.innerHTML.indexOf('<h3>Prayer watch</h3>');
  assert(givingFirst > -1 && prayerWatch > -1, 'Both rail cards should render');
  assert(givingFirst < prayerWatch, 'A giving priority should lift the giving card above the rest');

  window.TrumpetDemo.state.profile.goals = ['prayer'];
  window.TrumpetDemo.__test.render();
  assert(
    roots.app.innerHTML.indexOf('<h3>Prayer watch</h3>') < roots.app.innerHTML.indexOf('<h3>Where your giving went</h3>'),
    'A prayer priority should lift the prayer card instead',
  );
  window.TrumpetDemo.state.profile.goals = ['scripture', 'prayer', 'community'];
}

window.TrumpetDemo.__test.handleAction('toggle-opportunity', { dataset: { id: 'serve-meals' } });
assert(window.TrumpetDemo.state.committedOpportunities.has('serve-meals'), 'Service opportunity should save');

window.TrumpetDemo.__test.handleAction('open-donation', { dataset: { id: 'cause-water' } });
assert.strictEqual(window.TrumpetDemo.state.modal.type, 'donation');
assert(roots.app.innerHTML.includes('Prototype only: no payment information is requested'), 'Donation safety notice should render');
window.TrumpetDemo.__test.handleAction('select-amount', { dataset: { value: '50' } });
assert.strictEqual(window.TrumpetDemo.state.donationAmount, 50);

window.TrumpetDemo.__test.handleAction('open-prayer-modal', { dataset: {} });
assert.strictEqual(window.TrumpetDemo.state.modal.type, 'prayer');
assert(roots.app.innerHTML.includes('Start private. You control who can see it.'), 'Prayer privacy modal should render');

window.TrumpetDemo.navigate('community');
assert(roots.app.innerHTML.includes('Community built for encouragement.'), 'Community view should render');
window.TrumpetDemo.__test.handleAction('encourage-post', { dataset: { id: 'post-maya' } });
assert(window.TrumpetDemo.state.encouragedPosts.has('post-maya'), 'Community reaction should persist in state');

window.TrumpetDemo.navigate('safety');
assert(roots.app.innerHTML.includes('Dignity before virality'), 'Safety covenant should render');
assert(roots.app.innerHTML.includes('Trust must be designed, not declared.'), 'Safety page thesis should render');

window.TrumpetDemo.navigate('discover');
assert(roots.app.innerHTML.includes('Intentional relationships'), 'Discover should include the safety-first connections preview');

window.TrumpetDemo.state.profile.onboarded = false;
window.TrumpetDemo.state.onboardingStep = 1;
window.TrumpetDemo.__test.render();
assert(roots.app.innerHTML.includes('Meet you where you are.'), 'First-run onboarding should render');
assert.strictEqual(document.title, 'Welcome — Trumpet Nation', 'Onboarding should set a clear document title');
window.TrumpetDemo.__test.handleAction('onboarding-next', { dataset: {} });
assert.strictEqual(window.TrumpetDemo.state.onboardingStep, 2, 'Onboarding should advance to priorities');
window.TrumpetDemo.__test.handleAction('onboarding-next', { dataset: {} });
assert.strictEqual(window.TrumpetDemo.state.onboardingStep, 3, 'Onboarding should advance to the faith lens');
window.TrumpetDemo.state.onboardingDraft.language = 'Spanish';
window.TrumpetDemo.__test.handleAction('finish-onboarding', { dataset: {} });
assert.strictEqual(window.TrumpetDemo.state.profile.onboarded, true, 'Onboarding should persist completion');
assert.strictEqual(window.TrumpetDemo.state.profile.language, 'Spanish', 'Onboarding should preserve preferred language');

(async () => {
  window.TrumpetDemo.navigate('ask');
  window.TrumpetDemo.__test.sendChat('Help me make a wise decision without rushing.');
  assert.strictEqual(window.TrumpetDemo.state.chatTyping, true, 'Chat should enter typing state');
  await new Promise((resolve) => setTimeout(resolve, 850));
  assert.strictEqual(window.TrumpetDemo.state.chatTyping, false, 'Chat should finish response');
  assert.strictEqual(window.TrumpetDemo.state.chatMessages.length, 2, 'Chat should contain user and assistant messages');
  assert(window.TrumpetDemo.state.chatMessages[1].content.includes('data-topic="decision"'), 'Assistant should return a discernment response');
  assert(roots.app.innerHTML.includes('Where Christians differ'), 'Rendered chat should include the answer');
  console.log('Trumpet logic journey passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
