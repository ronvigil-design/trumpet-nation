(() => {
  "use strict";

  const STORAGE_PREFIX = "trumpet.v1.";

  const storage = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(STORAGE_PREFIX + key);
        return value === null ? fallback : JSON.parse(value);
      } catch (error) {
        console.warn("Trumpet Nation storage read failed", error);
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      } catch (error) {
        console.warn("Trumpet Nation storage write failed", error);
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(STORAGE_PREFIX + key);
      } catch (error) {
        console.warn("Trumpet Nation storage removal failed", error);
      }
    },
    clear() {
      try {
        Object.keys(localStorage)
          .filter((key) => key.startsWith(STORAGE_PREFIX))
          .forEach((key) => localStorage.removeItem(key));
      } catch (error) {
        console.warn("Trumpet Nation storage reset failed", error);
      }
    },
  };

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const icon = (name, className = "") =>
    `<svg class="icon ${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

  const initials = (first = "G", last = "W") =>
    `${String(first).trim().charAt(0)}${String(last).trim().charAt(0)}`.toUpperCase();

  const uid = (prefix = "item") => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const LOCALES = {
    English: "en-US",
    Spanish: "es",
    Portuguese: "pt-BR",
    French: "fr",
    Tagalog: "fil-PH",
  };

  const currentLocale = () => LOCALES[state.profile.language] || "en-US";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat(currentLocale(), { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date = new Date()) =>
    new Intl.DateTimeFormat(currentLocale(), {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date);

  const formatShortDate = (date = new Date()) =>
    new Intl.DateTimeFormat(currentLocale(), { month: "short", day: "numeric" }).format(date);

  const greetingForNow = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const TRADITIONS = [
    { value: "Broad Christian", label: "Broad Christian", note: "Shared essentials across traditions" },
    { value: "Catholic", label: "Catholic", note: "Scripture, tradition, and sacramental life" },
    { value: "Baptist", label: "Baptist", note: "Scripture-led and congregational" },
    { value: "Pentecostal", label: "Pentecostal", note: "Spirit-led and prayer-forward" },
    { value: "Methodist", label: "Methodist", note: "Grace, formation, and service" },
    { value: "Lutheran", label: "Lutheran", note: "Grace-centered and confessional" },
    { value: "Orthodox", label: "Orthodox", note: "Ancient faith and liturgical wisdom" },
    { value: "Anglican", label: "Anglican", note: "Scripture, tradition, and reason" },
    { value: "Presbyterian", label: "Presbyterian", note: "Reformed and community-governed" },
    { value: "Exploring", label: "Exploring", note: "Curious, questioning, and welcome" },
  ];

  const GOALS = [
    { value: "scripture", label: "Understand Scripture", note: "Study with context and reflection", icon: "book" },
    { value: "prayer", label: "Build a prayer rhythm", note: "Daily prompts and shared prayer", icon: "hands" },
    { value: "community", label: "Find real community", note: "Groups, churches, and trusted people", icon: "users" },
    { value: "decisions", label: "Make wise decisions", note: "Faith-aligned discernment tools", icon: "compass" },
    { value: "service", label: "Serve where I live", note: "Local needs and volunteer opportunities", icon: "heart" },
    { value: "giving", label: "Give with confidence", note: "Verified causes and transparent impact", icon: "gift" },
  ];

  const TONES = [
    { value: "Warm & practical", label: "Warm & practical", note: "Plain language and next steps" },
    { value: "Scripture-forward", label: "Scripture-forward", note: "More biblical references and context" },
    { value: "Reflective", label: "Reflective", note: "Gentle questions and spiritual formation" },
    { value: "Scholarly", label: "Scholarly", note: "Historical and theological depth" },
  ];

  const LANGUAGES = ["English", "Spanish", "Portuguese", "French", "Tagalog"];

  const NAV_ITEMS = [
    { route: "home", label: "Today", icon: "home", group: "Your day" },
    { route: "ask", label: "Ask Trumpet", icon: "spark", badge: "AI", group: "Your day" },
    { route: "community", label: "Community", icon: "users", group: "Your day" },
    { route: "prayer", label: "Prayer", icon: "hands", group: "Your day" },
    { route: "serve", label: "Serve", icon: "heart", group: "Faith in action" },
    { route: "give", label: "Give", icon: "gift", group: "Faith in action" },
    { route: "discover", label: "Discover", icon: "compass", group: "Faith in action" },
    { route: "safety", label: "Trust & safety", icon: "shield", group: "Trumpet Nation" },
  ];

  const VALID_ROUTES = new Set([...NAV_ITEMS.map((item) => item.route), "profile"]);
  const VIEW_TITLES = {
    home: "Today",
    ask: "Ask Trumpet",
    community: "Community",
    prayer: "Prayer",
    serve: "Serve",
    give: "Give",
    discover: "Discover",
    safety: "Trust & safety",
    profile: "Settings",
  };

  const DEFAULT_PROFILE = {
    onboarded: false,
    firstName: "Grace",
    lastName: "Walker",
    email: "grace@example.com",
    location: "Denver, Colorado",
    tradition: "Broad Christian",
    tone: "Warm & practical",
    language: "English",
    translation: "WEB",
    goals: ["scripture", "prayer", "community"],
    localDiscovery: true,
    privateByDefault: true,
    weeklyDigest: true,
    prayerAlerts: true,
    communityReplies: true,
    ministryUpdates: false,
    donationTotal: 145,
    serviceHours: 8,
  };

  const DEFAULT_POSTS = [
    {
      id: "post-hope-city",
      author: "Hope City Church",
      initials: "HC",
      avatar: "avatar-gold",
      verified: true,
      time: "34 min",
      audience: "Denver community",
      content:
        "Our winter shelter team still needs six volunteers for Saturday evening. Training is provided, and families are welcome to serve together.",
      type: "event",
      event: { month: "AUG", day: "15", title: "Family shelter dinner", meta: "Saturday · 4:30–8:00 PM · 2.8 miles" },
      encouraged: 48,
      comments: 12,
      prayers: 19,
    },
    {
      id: "post-maya",
      author: "Maya R.",
      initials: "MR",
      avatar: "avatar-teal",
      verified: false,
      time: "1 hr",
      audience: "Young professionals circle",
      content:
        "I have been learning that faithfulness is often quieter than certainty. Sharing this for anyone making a hard decision this week.",
      type: "quote",
      quote: "You do not need the whole road to take the next faithful step.",
      encouraged: 126,
      comments: 28,
      prayers: 41,
    },
    {
      id: "post-bridge",
      author: "Bridge of Mercy",
      initials: "BM",
      avatar: "avatar-coral",
      verified: true,
      time: "3 hr",
      audience: "Public",
      content:
        "Because of this community, 320 hygiene kits are ready for distribution. Thank you for giving, packing, praying, and showing up.",
      type: "text",
      encouraged: 207,
      comments: 31,
      prayers: 73,
    },
  ];

  const DEFAULT_PRAYERS = [
    {
      id: "prayer-elena",
      author: "Elena M.",
      initials: "EM",
      avatar: "avatar-coral",
      time: "12 min",
      scope: "Community",
      text: "Please pray for peace and wisdom as my family makes a difficult care decision for my father this week.",
      count: 43,
      status: "active",
    },
    {
      id: "prayer-anonymous",
      author: "Anonymous",
      initials: "A",
      avatar: "avatar-sage",
      time: "48 min",
      scope: "Private circle",
      text: "I have a job interview tomorrow after several hard months. Pray that I can walk in with courage, honesty, and trust.",
      count: 27,
      status: "private",
    },
    {
      id: "prayer-daniel",
      author: "Daniel K.",
      initials: "DK",
      avatar: "avatar-blue",
      time: "2 hr",
      scope: "Community",
      text: "Thank you for praying for my sister. Her procedure went well, and she is resting at home. We are deeply grateful.",
      count: 88,
      status: "answered",
    },
    {
      id: "prayer-neighborhood",
      author: "Northside Prayer Circle",
      initials: "NP",
      avatar: "avatar-gold",
      time: "4 hr",
      scope: "Group",
      text: "We are praying for teachers and students preparing for a new school year. Add a name or school below if you would like us to include them.",
      count: 114,
      status: "active",
    },
  ];

  const OPPORTUNITIES = [
    {
      id: "serve-meals",
      focus: "families",
      title: "Prepare family meals",
      org: "Hope City Shelter",
      description: "Cook and serve a warm dinner alongside an experienced volunteer team.",
      distance: "2.8 miles",
      time: "Sat · 4:30 PM",
      commitment: "3.5 hours",
      tag: "Families welcome",
      icon: "heart",
      art: "#d9ebe6",
    },
    {
      id: "serve-mentor",
      focus: "youth",
      title: "Mentor a middle-school student",
      org: "Open Door Youth",
      description: "Meet weekly with one student for homework help, encouragement, and steady presence.",
      distance: "4.1 miles",
      time: "Weekdays",
      commitment: "1 hour / week",
      tag: "Background check",
      icon: "book",
      art: "#f5e6be",
    },
    {
      id: "serve-garden",
      focus: "food",
      title: "Harvest the community garden",
      org: "Table & Vine Cooperative",
      description: "Help gather fresh produce for neighborhood food boxes and senior deliveries.",
      distance: "5.6 miles",
      time: "Sun · 8:00 AM",
      commitment: "2 hours",
      tag: "Outdoor",
      icon: "globe",
      art: "#dfe8d8",
    },
    {
      id: "serve-calls",
      focus: "care",
      title: "Make encouragement calls",
      org: "CareLine Network",
      description: "Call isolated adults from home using a guided, privacy-safe conversation plan.",
      distance: "Remote",
      time: "Flexible",
      commitment: "45 minutes",
      tag: "Remote",
      icon: "message",
      art: "#dce8f1",
    },
    {
      id: "serve-refugee",
      focus: "families",
      title: "Welcome a newly arrived family",
      org: "Neighbor Nations",
      description: "Join a trained welcome team for practical help, transportation, and friendship.",
      distance: "7.2 miles",
      time: "Flexible",
      commitment: "Monthly",
      tag: "Team-based",
      icon: "users",
      art: "#f0dfd8",
    },
    {
      id: "serve-prayer",
      focus: "care",
      title: "Join the hospital prayer team",
      org: "St. Anne Care Ministry",
      description: "Offer quiet, respectful prayer support to patients and families who request it.",
      distance: "3.3 miles",
      time: "Thu · 6:00 PM",
      commitment: "2 hours",
      tag: "Training included",
      icon: "hands",
      art: "#e4dff0",
    },
  ];

  const CAUSES = [
    {
      id: "cause-water",
      org: "Living Water Partners",
      title: "Clean water for 12 villages",
      description: "Fund locally maintained wells, water committees, and long-term repair training.",
      raised: 184200,
      goal: 250000,
      donors: 1843,
      icon: "globe",
      bg: "#cfe7e7",
    },
    {
      id: "cause-families",
      org: "Safe Harbor Homes",
      title: "Emergency housing for families",
      description: "Provide 30 nights of safe housing plus case management for families in crisis.",
      raised: 72800,
      goal: 100000,
      donors: 926,
      icon: "home",
      bg: "#f4dfc3",
    },
    {
      id: "cause-students",
      org: "Open Door Youth",
      title: "After-school mentors and meals",
      description: "Expand a neighborhood program pairing students with mentors and daily meals.",
      raised: 46800,
      goal: 80000,
      donors: 614,
      icon: "book",
      bg: "#dce8d5",
    },
  ];

  const DISCOVERY_ITEMS = [
    {
      id: "discover-reading-plan",
      category: "Study",
      type: "Reading plan",
      title: "The faithful next step",
      description: "A 14-day guided practice for decisions, courage, and discernment.",
      meta: "14 days",
      price: "Free",
      icon: "book",
      bg: "#d9ebe6",
    },
    {
      id: "discover-retreat",
      category: "Events",
      type: "Local gathering",
      title: "Quiet morning retreat",
      description: "Prayer, silence, and guided reflection in the foothills west of Denver.",
      meta: "Aug 22",
      price: "$18",
      icon: "calendar",
      bg: "#f3e3c6",
    },
    {
      id: "discover-circle",
      category: "Groups",
      type: "Small group",
      title: "Faith & work circle",
      description: "A weekly conversation for professionals seeking integrity in daily work.",
      meta: "42 members",
      price: "Join",
      icon: "users",
      bg: "#dce4f1",
    },
    {
      id: "discover-journal",
      category: "Marketplace",
      type: "Creator shop",
      title: "Common prayer journal",
      description: "A ninety-day undated journal made by a small Christian studio.",
      meta: "Ships in 2 days",
      price: "$24",
      icon: "book",
      bg: "#eadfd7",
    },
    {
      id: "discover-music",
      category: "Music",
      type: "Listening room",
      title: "Songs for the waiting",
      description: "A contemplative collection from independent worship artists.",
      meta: "11 tracks",
      price: "Listen",
      icon: "play",
      bg: "#e6dff0",
    },
    {
      id: "discover-church",
      category: "Churches",
      type: "Church community",
      title: "Northside Fellowship",
      description: "Intergenerational community with neighborhood service and small groups.",
      meta: "3.2 miles",
      price: "Visit",
      icon: "home",
      bg: "#dce9df",
    },
    {
      id: "discover-course",
      category: "Study",
      type: "Guided course",
      title: "Read the Gospels slowly",
      description: "Four weeks of context, observation, prayer, and discussion prompts.",
      meta: "4 weeks",
      price: "$12",
      icon: "book",
      bg: "#f0e4c8",
    },
    {
      id: "discover-connections",
      category: "Connections",
      type: "Safety-first preview",
      title: "Intentional relationships",
      description: "A future friendship and dating experience designed around identity checks, consent, and trusted-community safeguards.",
      meta: "Adults 18+",
      price: "Join waitlist",
      icon: "heart",
      bg: "#efdeda",
    },
    {
      id: "discover-volunteer",
      category: "Events",
      type: "Service day",
      title: "Citywide serve day",
      description: "Choose from 28 projects across schools, shelters, parks, and food banks.",
      meta: "Sep 12",
      price: "Register",
      icon: "heart",
      bg: "#d8ebe8",
    },
  ];

  const COMMAND_ITEMS = [
    { route: "ask", label: "Ask Trumpet", note: "Start a faith-aligned conversation", icon: "spark" },
    { route: "prayer", label: "Share a prayer request", note: "Choose private, circle, or community", icon: "hands", action: "open-prayer-modal" },
    { route: "serve", label: "Find a place to serve", note: "Nearby and remote opportunities", icon: "heart" },
    { route: "give", label: "Give to a verified cause", note: "Transparent impact and trusted partners", icon: "gift" },
    { route: "community", label: "Open community", note: "Encouragement, groups, and local updates", icon: "users" },
    { route: "safety", label: "Read the Trumpet Nation covenant", note: "How the product earns trust", icon: "shield" },
    { route: "profile", label: "Personalize my faith lens", note: "Tradition, tone, privacy, and notifications", icon: "settings" },
  ];

  const savedProfile = storage.get("profile", DEFAULT_PROFILE);
  const profile = { ...DEFAULT_PROFILE, ...savedProfile };

  const state = {
    profile,
    onboardingStep: 1,
    onboardingDraft: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      location: profile.location,
      tradition: profile.tradition,
      tone: profile.tone,
      language: profile.language,
      translation: profile.translation,
      goals: [...profile.goals],
      localDiscovery: profile.localDiscovery,
      privateByDefault: profile.privateByDefault,
    },
    route: VALID_ROUTES.has(location.hash.replace("#", "")) ? location.hash.replace("#", "") : "home",
    sidebarOpen: false,
    modal: null,
    commandQuery: "",
    communityFilter: "For you",
    prayerFilter: "All",
    discoverCategory: "All",
    discoverQuery: "",
    settingsSection: "profile",
    pendingShare: null,
    journey: storage.get("journey", null),
    serveFocus: "",
    composerOpen: false,
    posts: storage.get("posts", DEFAULT_POSTS),
    prayers: storage.get("prayers", DEFAULT_PRAYERS),
    encouragedPosts: new Set(storage.get("encouragedPosts", [])),
    prayedPosts: new Set(storage.get("prayedPosts", [])),
    prayedRequests: new Set(storage.get("prayedRequests", [])),
    joinedGroups: new Set(storage.get("joinedGroups", ["group-faith-work"])),
    committedOpportunities: new Set(storage.get("committedOpportunities", [])),
    savedDiscoveries: new Set(storage.get("savedDiscoveries", [])),
    chatMessages: storage.get("chatMessages", []),
    chatTyping: false,
    chatDraft: "",
    focusTotal: 120,
    focusRemaining: 120,
    focusRunning: false,
    donationCauseId: null,
    donationAmount: 25,
    donationRecurring: false,
    notificationOpen: false,
  };

  let focusInterval = null;
  let toastTimer = null;

  const persistProfile = () => storage.set("profile", state.profile);

  const persistSets = () => {
    storage.set("encouragedPosts", [...state.encouragedPosts]);
    storage.set("prayedPosts", [...state.prayedPosts]);
    storage.set("prayedRequests", [...state.prayedRequests]);
    storage.set("joinedGroups", [...state.joinedGroups]);
    storage.set("committedOpportunities", [...state.committedOpportunities]);
    storage.set("savedDiscoveries", [...state.savedDiscoveries]);
  };

  const brandMarkup = () => `
    <a href="#home" class="brand" data-route="home" aria-label="Trumpet Nation home" translate="no">
      <span class="brand-mark" aria-hidden="true">
        <img src="assets/logo-384.png" alt="" width="384" height="384" decoding="async" />
      </span>
      <span class="brand-beta">Beta</span>
    </a>`;

  const avatarMarkup = (person = state.profile, className = "") => {
    const first = person.firstName || person.author?.split(" ")[0] || "G";
    const last = person.lastName || person.author?.split(" ")[1] || "W";
    const label = person.initials || initials(first, last);
    const color = person.avatar || "avatar-teal";
    return `<span class="avatar ${color} ${className}" aria-hidden="true">${escapeHtml(label)}</span>`;
  };

  const navButtonMarkup = (item) => `
    <a href="#${item.route}" class="nav-button ${state.route === item.route ? "active" : ""}" data-route="${item.route}" aria-current="${state.route === item.route ? "page" : "false"}">
      ${icon(item.icon)}
      <span>${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ""}
    </a>`;

  const renderSidebar = () => {
    const groups = [...new Set(NAV_ITEMS.map((item) => item.group))];
    return `
      ${state.sidebarOpen ? `<button class="sidebar-scrim" type="button" data-action="close-sidebar" aria-label="Close navigation"></button>` : ""}
      <aside class="sidebar ${state.sidebarOpen ? "open" : ""}" aria-label="Primary navigation">
        <div class="sidebar-header">
          ${brandMarkup()}
          <button class="sidebar-close icon-btn" type="button" data-action="close-sidebar" aria-label="Close navigation">${icon("close")}</button>
        </div>
        <nav>
          ${groups
            .map(
              (group) => `
                <div class="nav-label">${group}</div>
                <ul class="nav-list">
                  ${NAV_ITEMS.filter((item) => item.group === group)
                    .map((item) => `<li>${navButtonMarkup(item)}</li>`)
                    .join("")}
                </ul>`,
            )
            .join("")}
        </nav>
        <div class="sidebar-spacer"></div>
        <div class="sidebar-callout">
          <span class="pill pill-dark">${icon("hands")} Prayer watch</span>
          <strong>23 people are praying now</strong>
          <p>Join a quiet two-minute prayer rhythm with the Trumpet Nation community.</p>
          <a class="btn btn-gold btn-small" href="#prayer" data-route="prayer">Join the watch</a>
        </div>
        <div class="sidebar-profile">
          ${avatarMarkup(state.profile)}
          <div class="sidebar-profile-text">
            <strong>${escapeHtml(state.profile.firstName)} ${escapeHtml(state.profile.lastName)}</strong>
            <small>${escapeHtml(state.profile.tradition)} lens</small>
          </div>
          <a class="icon-btn" href="#profile" data-route="profile" aria-label="Open profile settings">${icon("settings")}</a>
        </div>
      </aside>`;
  };

  const renderTopbar = () => `
    <header class="topbar">
      <div class="topbar-left">
        <button class="icon-btn mobile-menu-button" type="button" data-action="open-sidebar" aria-label="Open navigation">${icon("menu")}</button>
        <div class="topbar-context"><strong>${escapeHtml(state.profile.location)}</strong> · ${formatShortDate()}</div>
      </div>
      <div class="topbar-right">
        <button class="search-trigger" type="button" data-action="open-command" aria-label="Search Trumpet Nation">
          ${icon("search")} <span>Search Trumpet Nation</span> <kbd>⌘ K</kbd>
        </button>
        <button class="icon-btn notification-dot" type="button" data-action="open-notifications" aria-label="Open notifications">${icon("bell")}</button>
        <a href="#profile" class="avatar avatar-teal" data-route="profile" aria-label="Open profile">${escapeHtml(initials(state.profile.firstName, state.profile.lastName))}</a>
      </div>
    </header>`;

  const renderMobileNav = () => {
    const items = [
      { route: "home", label: "Today", icon: "home" },
      { route: "ask", label: "Ask", icon: "spark" },
      { route: "community", label: "Community", icon: "users" },
      { route: "prayer", label: "Prayer", icon: "hands" },
    ];
    const moreActive = ["serve", "give", "discover", "safety", "profile"].includes(state.route);
    return `
      <nav class="mobile-nav" aria-label="Mobile navigation">
        ${items
          .map(
            (item) => `
              <a href="#${item.route}" class="${state.route === item.route ? "active" : ""}" data-route="${item.route}" aria-current="${state.route === item.route ? "page" : "false"}">
                ${icon(item.icon)}<span>${item.label}</span>
              </a>`,
          )
          .join("")}
        <button class="${moreActive ? "active" : ""}" type="button" data-action="open-sidebar">
          ${icon("menu")}<span>More</span>
        </button>
      </nav>`;
  };

  const pageHeader = ({ kicker, title, description, actions = "" }) => `
    <div class="page-head">
      <div class="page-head-copy">
        ${kicker ? `<p class="kicker">${kicker}</p>` : ""}
        <h1 class="page-title">${title}</h1>
        ${description ? `<p>${description}</p>` : ""}
      </div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ""}
    </div>`;

  const sectionHeader = (title, description = "", action = "") => `
    <div class="section-head">
      <div>
        <h2 class="section-title">${title}</h2>
        ${description ? `<p>${description}</p>` : ""}
      </div>
      ${action}
    </div>`;

  const onboardingChoice = ({ value, label, note, iconName = "spark", selected, action, multi = false }) => `
    <button class="choice-card ${selected ? "selected" : ""}" type="button" data-action="${action}" data-value="${escapeHtml(value)}" aria-pressed="${selected}">
      <span class="choice-icon">${icon(iconName)}</span>
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(note)}</small>
      </span>
      <span class="choice-check">${icon("check")}</span>
      <span class="visually-hidden">${multi ? "Toggle selection" : "Select option"}</span>
    </button>`;

  const renderOnboardingStep = () => {
    const step = state.onboardingStep;
    if (step === 1) {
      return `
        <div class="onboarding-progress" aria-label="Step 1 of 3"><span class="active"></span><span></span><span></span></div>
        <p class="kicker">Begin with you</p>
        <h2>Meet you where you are.</h2>
        <p>Trumpet Nation adapts its language and recommendations without putting you in a box.</p>
        <div class="name-row">
          <label class="field-label">First name
            <input class="field" id="onboarding-first-name" name="firstName" value="${escapeHtml(state.onboardingDraft.firstName)}" autocomplete="given-name" />
          </label>
          <label class="field-label">Last name
            <input class="field" id="onboarding-last-name" name="lastName" value="${escapeHtml(state.onboardingDraft.lastName)}" autocomplete="family-name" />
          </label>
        </div>
        <label class="field-label" style="margin-bottom:20px">Home area
          <input class="field" id="onboarding-location" name="location" value="${escapeHtml(state.onboardingDraft.location)}" autocomplete="address-level2" />
        </label>
        <p class="field-label" style="margin-bottom:9px">Faith tradition or starting point</p>
        <div class="choice-grid">
          ${TRADITIONS.map((item) =>
            onboardingChoice({
              value: item.value,
              label: item.label,
              note: item.note,
              iconName: item.value === "Exploring" ? "compass" : "book",
              selected: state.onboardingDraft.tradition === item.value,
              action: "select-tradition",
            }),
          ).join("")}
        </div>
        <div class="onboarding-actions">
          <button class="btn btn-ghost" type="button" data-action="explore-demo">Explore the demo</button>
          <button class="btn btn-primary" type="button" data-action="onboarding-next">Continue ${icon("arrow")}</button>
        </div>`;
    }

    if (step === 2) {
      return `
        <div class="onboarding-progress" aria-label="Step 2 of 3"><span></span><span class="active"></span><span></span></div>
        <p class="kicker">Your priorities</p>
        <h2>What would make Trumpet Nation useful?</h2>
        <p>Choose as many as you like. Your Today view will put these needs first.</p>
        <div class="choice-grid">
          ${GOALS.map((item) =>
            onboardingChoice({
              value: item.value,
              label: item.label,
              note: item.note,
              iconName: item.icon,
              selected: state.onboardingDraft.goals.includes(item.value),
              action: "toggle-goal",
              multi: true,
            }),
          ).join("")}
        </div>
        <div class="onboarding-actions">
          <button class="btn btn-ghost" type="button" data-action="onboarding-back">Back</button>
          <button class="btn btn-primary" type="button" data-action="onboarding-next">Continue ${icon("arrow")}</button>
        </div>`;
    }

    return `
      <div class="onboarding-progress" aria-label="Step 3 of 3"><span></span><span></span><span class="active"></span></div>
      <p class="kicker">Your faith lens</p>
      <h2>Helpful, never presumptuous.</h2>
      <p>Choose how Trumpet Nation should communicate. You can change every setting later.</p>
      <div class="choice-grid">
        ${TONES.map((item) =>
          onboardingChoice({
            value: item.value,
            label: item.label,
            note: item.note,
            iconName: item.value === "Scholarly" ? "book" : "message",
            selected: state.onboardingDraft.tone === item.value,
            action: "select-tone",
          }),
        ).join("")}
      </div>
      <label class="field-label" style="margin-top:20px">Preferred language
        <select class="select" id="onboarding-language" name="language">
          ${LANGUAGES.map((language) => `<option value="${language}" ${state.onboardingDraft.language === language ? "selected" : ""}>${language}</option>`).join("")}
        </select>
        <span class="subtle" style="font-size:.68rem">The prototype interface is English; production content is designed for localization.</span>
      </label>
      <label class="field-label" style="margin-top:16px">Preferred Bible translation
        <select class="select" id="onboarding-translation" name="translation">
          ${TRANSLATIONS.map((item) => `<option value="${escapeHtml(item.value)}" ${state.onboardingDraft.translation === item.value ? "selected" : ""}>${escapeHtml(item.label)} — ${escapeHtml(item.note)}</option>`).join("")}
        </select>
        <span class="subtle" style="font-size:.68rem">Public-domain translations carry text in this prototype. Licensed translations fall back to the World English Bible until a publisher agreement is in place.</span>
      </label>
      <div style="display:grid;gap:10px;margin-top:20px">
        <div class="setting-row">
          <div class="setting-copy">
            <strong>Use my area for local discovery</strong>
            <small>Show nearby groups, churches, events, and service opportunities.</small>
          </div>
          <button class="toggle ${state.onboardingDraft.localDiscovery ? "on" : ""}" type="button" data-action="toggle-onboarding-local" aria-pressed="${state.onboardingDraft.localDiscovery}"><span class="visually-hidden">Toggle local discovery</span></button>
        </div>
        <div class="setting-row">
          <div class="setting-copy">
            <strong>Keep prayer requests private by default</strong>
            <small>You choose when a request is shared with a circle or the community.</small>
          </div>
          <button class="toggle ${state.onboardingDraft.privateByDefault ? "on" : ""}" type="button" data-action="toggle-onboarding-private" aria-pressed="${state.onboardingDraft.privateByDefault}"><span class="visually-hidden">Toggle private prayer default</span></button>
        </div>
      </div>
      <div class="onboarding-note">${icon("shield")}<span>Trumpet Nation treats your faith lens as private personalization data. It is never shown as a public label unless you choose to share it.</span></div>
      <div class="onboarding-actions">
        <button class="btn btn-ghost" type="button" data-action="onboarding-back">Back</button>
        <button class="btn btn-gold" type="button" data-action="finish-onboarding">Enter Trumpet Nation ${icon("arrow")}</button>
      </div>`;
  };

  const renderOnboarding = () => `
    <main class="onboarding">
      <section class="onboarding-story" aria-label="About Trumpet Nation">
        ${brandMarkup()}
        <div class="onboarding-copy">
          <p class="kicker" style="color:var(--gilt)">Faith for everyday life</p>
          <h1>A clearer way to <em>live what you believe.</em></h1>
          <p>One trusted place to ask hard questions, build spiritual rhythms, find your people, and turn faith into action.</p>
        </div>
        <div class="onboarding-principles">
          <div class="principle"><strong>Ask</strong><span>Faith-aligned AI that gives context, humility, and practical next steps.</span></div>
          <div class="principle"><strong>Belong</strong><span>Healthier community built around encouragement instead of outrage.</span></div>
          <div class="principle"><strong>Act</strong><span>Serve, give, and participate with verified ministries and local partners.</span></div>
        </div>
      </section>
      <section class="onboarding-panel">
        <div class="onboarding-card">
          ${renderOnboardingStep()}
        </div>
      </section>
    </main>`;

  /* The rail card each onboarding priority is responsible for. Cards whose goal
   * the person chose sort to the top, in the order the goals are listed in the
   * profile; the rest keep their default order below. The Today view used to
   * print "N goals shaping your feed" while ignoring the goals entirely. */

  const railCardForGoal = {
    prayer: "prayer-watch",
    service: "near-you",
    community: "circles",
    giving: "giving",
  };

  const orderRailCards = (cards) => {
    const priority = new Map();
    state.profile.goals.forEach((goal, index) => {
      const cardId = railCardForGoal[goal];
      if (cardId) priority.set(cardId, index);
    });
    return [...cards].sort((a, b) => {
      const rankA = priority.has(a.id) ? priority.get(a.id) : Number.MAX_SAFE_INTEGER;
      const rankB = priority.has(b.id) ? priority.get(b.id) : Number.MAX_SAFE_INTEGER;
      if (rankA !== rankB) return rankA - rankB;
      return cards.indexOf(a) - cards.indexOf(b);
    });
  };

  const goalLabel = (value) => GOALS.find((goal) => goal.value === value)?.label || value;

  const renderHome = () => {
    const firstName = escapeHtml(state.profile.firstName || "Friend");
    const todayPrayer = state.prayers.slice(0, 2);
    const nextOpportunity = OPPORTUNITIES[0];
    const shapingGoals = state.profile.goals.filter((goal) => railCardForGoal[goal]);
    const goalCount = state.profile.goals.length;
    return `
      <div class="home-grid">
        <section class="home-main">
          <div class="greeting-row">
            <h1>${greetingForNow()}, <span>${firstName}.</span></h1>
            <div class="greeting-date">${formatDate()}<br /><span class="subtle">Your day, with intention</span></div>
          </div>

          <section class="signal-hero" aria-labelledby="signal-title">
            <div class="signal-hero-content">
              <p class="kicker" style="color:var(--gilt)">Ask Trumpet</p>
              <h2 id="signal-title">What would be helpful today?</h2>
              <p>Think through a decision, explore Scripture, prepare for a conversation, or simply find words for a prayer.</p>
              <form class="hero-ask-form" id="home-ask-form">
                <label class="visually-hidden" for="home-ask-input">Ask Trumpet a question</label>
                <input id="home-ask-input" name="prompt" placeholder="Ask about faith, life, work, relationships…" autocomplete="off" enterkeyhint="send" />
                <button type="submit" aria-label="Ask Trumpet">${icon("send")}</button>
              </form>
              <div class="hero-prompts" aria-label="Suggested questions">
                <button class="prompt-chip" type="button" data-action="quick-ask" data-prompt="Help me make a wise decision without rushing.">Make a wise decision</button>
                <button class="prompt-chip" type="button" data-action="quick-ask" data-prompt="Create a simple prayer for an anxious morning.">Prayer for anxiety</button>
                <button class="prompt-chip" type="button" data-action="quick-ask" data-prompt="What should I notice in the Sermon on the Mount?">Study a Bible passage</button>
              </div>
              <div class="hero-trust">${icon("shield")} Personalized to your ${escapeHtml(state.profile.tradition)} lens · Demo responses</div>
            </div>
          </section>

          <section class="daily-word" aria-labelledby="daily-word-title">
            <p class="kicker">Daily word</p>
            <blockquote id="daily-word-title">“Let us not love with words or speech but with actions and in truth.”</blockquote>
            <div class="daily-word-meta">
              <cite>1 John 3:18</cite>
              <button class="btn btn-soft btn-small" type="button" data-action="open-reflection">Read today’s reflection ${icon("arrow")}</button>
            </div>
          </section>

          <section>
            ${sectionHeader("Your week in motion", "Small rhythms add up to a life of faithfulness.")}
            <div class="pulse-row">
              <article class="pulse-card">
                <div class="pulse-card-top"><span>Prayer rhythm</span>${icon("hands")}</div>
                <div><div class="pulse-number">5 days</div><small>Two more than last week</small></div>
              </article>
              <article class="pulse-card">
                <div class="pulse-card-top"><span>Community</span>${icon("users")}</div>
                <div><div class="pulse-number">12</div><small>People encouraged</small></div>
              </article>
              <article class="pulse-card">
                <div class="pulse-card-top"><span>Priorities</span>${icon("compass")}</div>
                <div>
                  <div class="pulse-number">${goalCount}</div>
                  <small>${
                    shapingGoals.length
                      ? `${escapeHtml(shapingGoals.map(goalLabel).join(" · "))} lead your rail`
                      : "Choose priorities to reorder your day"
                  }</small>
                </div>
              </article>
            </div>
          </section>
        </section>

        <aside class="home-rail" aria-label="Your Trumpet Nation activity">
          ${renderJourneyCard()}

          <section class="rail-card rail-card-dark">
            <div class="rail-card-header"><h3>Steady rhythm</h3><span class="pill pill-dark">This week</span></div>
            <div class="streak-ring"><div><strong>5</strong><span>day rhythm</span></div></div>
            <div class="streak-days">
              ${["M", "T", "W", "T", "F", "S", "S"].map((day, index) => `<span class="streak-day ${index < 5 ? "done" : ""}"><i>${index < 5 ? icon("check") : ""}</i>${day}</span>`).join("")}
            </div>
          </section>

          ${orderRailCards([
            {
              id: "prayer-watch",
              html: `<section class="rail-card">
                <div class="rail-card-header"><h3>Prayer watch</h3><a class="text-action" href="#prayer" data-route="prayer">Open wall</a></div>
                <div class="prayer-mini-list">
                  ${todayPrayer
                    .map(
                      (prayer) => `
                        <div class="prayer-mini">
                          ${avatarMarkup(prayer)}
                          <div class="prayer-mini-copy">
                            <strong>${escapeHtml(prayer.author)}</strong>
                            <p>${escapeHtml(prayer.text.slice(0, 78))}${prayer.text.length > 78 ? "…" : ""}</p>
                          </div>
                          <button class="mini-pray-button" type="button" data-action="pray-request" data-id="${prayer.id}">${icon("hands")} ${prayer.count + (state.prayedRequests.has(prayer.id) ? 1 : 0)}</button>
                        </div>`,
                    )
                    .join("")}
                </div>
              </section>`,
            },
            {
              id: "near-you",
              html: `<section class="rail-card">
                <div class="rail-card-header"><h3>Near you</h3><span class="pill">2.8 mi</span></div>
                <div class="opportunity-mini">
                  <span class="pill pill-gold">${nextOpportunity.tag}</span>
                  <h4>${nextOpportunity.title}</h4>
                  <p>${nextOpportunity.org}</p>
                  <div class="meta-row"><span>${icon("calendar")} ${nextOpportunity.time}</span><span>${icon("clock")} ${nextOpportunity.commitment}</span></div>
                  <a class="btn btn-primary btn-small" href="#serve" data-route="serve" style="margin-top:15px">See opportunity</a>
                </div>
              </section>`,
            },
            {
              id: "circles",
              html: `<section class="rail-card">
                <div class="rail-card-header"><h3>Your circles</h3><a class="text-action" href="#community" data-route="community">View all</a></div>
                <div class="circle-list">
                  <div class="circle-item"><span class="group-emblem">${icon("users")}</span><div class="circle-item-copy"><strong>Faith & work</strong><p>8 new reflections · meetup Tuesday</p></div></div>
                  <div class="circle-item"><span class="group-emblem" style="background:#fff0e8;color:#a1432d">${icon("heart")}</span><div class="circle-item-copy"><strong>Northside neighbors</strong><p>Meal train needs two more volunteers</p></div></div>
                </div>
              </section>`,
            },
            {
              id: "giving",
              html: `<section class="rail-card">
                <div class="rail-card-header"><h3>Where your giving went</h3><a class="text-action" href="#give" data-route="give">See causes</a></div>
                <div class="giving-mini">
                  <span class="pill pill-gold">${escapeHtml(CAUSES[0].org)}</span>
                  <h4>${escapeHtml(CAUSES[0].title)}</h4>
                  <div class="progress-line" style="--progress:${Math.min(100, Math.round((CAUSES[0].raised / CAUSES[0].goal) * 100))}%" role="img" aria-label="${Math.min(100, Math.round((CAUSES[0].raised / CAUSES[0].goal) * 100))} percent funded"><span></span></div>
                  <p class="subtle" style="margin:8px 0 0;font-size:.74rem">${formatCurrency(CAUSES[0].raised)} of ${formatCurrency(CAUSES[0].goal)} raised</p>
                </div>
              </section>`,
            },
          ])
            .map((card) => card.html)
            .join("")}
        </aside>
      </div>`;
  };

  // Shown as "Recent" in the Ask sidebar. These were inert buttons; each now
  // reopens the conversation it names rather than sitting there as decoration.
  const recentConversations = [
    { title: "A wise decision without rushing", prompt: "Help me make a wise decision without rushing." },
    { title: "Understanding the beatitudes", prompt: "What should I notice in the Sermon on the Mount?" },
    { title: "Prayer before a hard meeting", prompt: "Create a simple prayer before a hard meeting." },
    { title: "Serving as a family", prompt: "How can our family serve together in our neighborhood?" },
  ];

  const chatStarterCards = [
    { label: "Discernment", prompt: "Help me make a wise decision without rushing." },
    { label: "Prayer", prompt: "Create a simple prayer for an anxious morning." },
    { label: "Scripture", prompt: "What should I notice in the Sermon on the Mount?" },
    { label: "Relationships", prompt: "Help me prepare for a hard but loving conversation." },
  ];

  const renderMessage = (message) => {
    const isUser = message.role === "user";
    const assistantName = "Trumpet Nation";
    return `
      <article class="message-row ${isUser ? "user" : "assistant"}">
        <div class="message-avatar">${isUser ? escapeHtml(initials(state.profile.firstName, state.profile.lastName)) : icon("spark")}</div>
        <div class="message-body">
          <strong>${isUser ? "You" : assistantName}</strong>
          <div class="message-bubble">${isUser ? `<p>${escapeHtml(message.content)}</p>` : message.content}</div>
          ${
            isUser
              ? ""
              : `<div class="message-actions">
                  <button type="button" data-action="copy-answer" data-id="${message.id}">${icon("bookmark")} Save</button>
                  <button type="button" data-action="helpful-answer" data-id="${message.id}">${icon("check")} Helpful</button>
                  <button type="button" data-action="share-answer" data-id="${message.id}">${icon("share")} Share</button>
                </div>`
          }
        </div>
      </article>`;
  };

  const renderAsk = () => {
    const hasMessages = state.chatMessages.length > 0 || state.chatTyping;
    return `
      <h1 class="visually-hidden">Ask Trumpet</h1>
      <section class="ask-layout is-full" aria-label="Ask Trumpet conversation">
        <aside class="ask-sidebar">
          <button class="btn btn-primary new-chat-button" type="button" data-action="new-chat">${icon("plus")} New conversation</button>
          <div class="chat-history-label">Recent</div>
          <div class="chat-history">
            ${recentConversations
              .map(
                (item) =>
                  `<button type="button" data-action="quick-ask" data-prompt="${escapeHtml(item.prompt)}">${escapeHtml(item.title)}</button>`,
              )
              .join("")}
          </div>
          <div class="ask-sidebar-footer">
            <div class="lens-card">
              <strong>${icon("shield")} Your faith lens</strong>
              <p>${escapeHtml(state.profile.tradition)} · ${escapeHtml(state.profile.tone)} · ${escapeHtml(state.profile.language)}. Trumpet names uncertainty and never replaces trusted human counsel.</p>
            </div>
          </div>
        </aside>
        <div class="ask-main">
          <div class="ask-top">
            <div class="ask-title">
              <span class="ask-orb">${icon("spark")}</span>
              <div><strong>Trumpet guide</strong><small>Prototype mode · private conversation</small></div>
            </div>
            <div class="ask-controls">
              <label class="visually-hidden" for="ask-tradition">Faith tradition</label>
              <select class="select-compact" id="ask-tradition" name="tradition" data-action="change-tradition">
                ${TRADITIONS.map((item) => `<option value="${escapeHtml(item.value)}" ${state.profile.tradition === item.value ? "selected" : ""}>${escapeHtml(item.value)}</option>`).join("")}
              </select>
              <label class="visually-hidden" for="ask-tone">Response tone</label>
              <select class="select-compact" id="ask-tone" name="tone" data-action="change-tone">
                ${TONES.map((item) => `<option value="${escapeHtml(item.value)}" ${state.profile.tone === item.value ? "selected" : ""}>${escapeHtml(item.value)}</option>`).join("")}
              </select>
              <label class="visually-hidden" for="ask-translation">Bible translation</label>
              <select class="select-compact" id="ask-translation" name="translation" data-action="change-translation">
                ${TRANSLATIONS.map(
                  (item) =>
                    `<option value="${escapeHtml(item.value)}" ${preferredTranslation() === item.value ? "selected" : ""}>${escapeHtml(item.value)}${item.licensed ? " · licence" : ""}</option>`,
                ).join("")}
              </select>
            </div>
          </div>

          <div class="chat-scroll" id="chat-scroll">
            ${
              hasMessages
                ? `<div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions text">
                    ${state.chatMessages.map(renderMessage).join("")}
                    ${
                      state.chatTyping
                        ? `<article class="message-row assistant">
                            <div class="message-avatar">${icon("spark")}</div>
                            <div class="message-body"><strong>Trumpet</strong><div class="message-bubble"><div class="typing-dots" aria-label="Trumpet is responding"><i></i><i></i><i></i></div></div></div>
                          </article>`
                        : ""
                    }
                  </div>`
                : `<div class="chat-welcome">
                    <div class="chat-welcome-inner">
                      <div class="signal-glyph">${icon("spark")}</div>
                      <p class="kicker">A thoughtful place to begin</p>
                      <h2>Bring the real question.</h2>
                      <p>Trumpet will help you think faithfully, distinguish wisdom from certainty, and leave with a practical next step.</p>
                      <div class="starter-grid">
                        ${chatStarterCards
                          .map(
                            (item) => `<button class="starter-card" type="button" data-action="quick-ask" data-prompt="${escapeHtml(item.prompt)}"><span>${item.label}</span><strong>${item.prompt}</strong></button>`,
                          )
                          .join("")}
                      </div>
                    </div>
                  </div>`
            }
          </div>

          <div class="ask-composer-wrap">
            <form class="ask-composer" id="ask-form">
              <label class="visually-hidden" for="ask-input">Message Trumpet Nation</label>
              <textarea id="ask-input" name="prompt" rows="1" placeholder="Ask a question, describe a situation, or request a prayer…" enterkeyhint="enter">${escapeHtml(state.chatDraft)}</textarea>
              <button type="submit" aria-label="Send message" ${state.chatTyping ? "disabled" : ""}>${icon("send")}</button>
            </form>
            <p class="composer-note">Press Ctrl/⌘+Enter to send. Trumpet can make mistakes; verify important guidance with Scripture, trusted leaders, and qualified professionals.</p>
          </div>
        </div>
      </section>`;
  };

  /* ------------------------------------------------------------------ *
   * Scripture library
   * Only public-domain translations carry text. Licensed translations are
   * listed so the licensing cost is visible in the prototype rather than
   * discovered at production.
   * ------------------------------------------------------------------ */

  const TRANSLATIONS = [
    { value: "WEB", label: "World English Bible", note: "Public domain · modern English", licensed: false },
    { value: "KJV", label: "King James Version", note: "Public domain · traditional English", licensed: false },
    { value: "NIV", label: "New International Version", note: "Publisher licence required", licensed: true },
    { value: "ESV", label: "English Standard Version", note: "Publisher licence required", licensed: true },
    { value: "NRSV-CE", label: "NRSV Catholic Edition", note: "Publisher licence required", licensed: true },
  ];

  const SCRIPTURE = {
    "Philippians 4:6–7": {
      WEB: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.",
      KJV: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    },
    "Psalm 46:1": {
      WEB: "God is our refuge and strength, a very present help in trouble.",
      KJV: "God is our refuge and strength, a very present help in trouble.",
    },
    "Psalm 34:18": {
      WEB: "Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.",
      KJV: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    },
    "1 Peter 5:7": {
      WEB: "casting all your worries on him, because he cares for you.",
      KJV: "Casting all your care upon him; for he careth for you.",
    },
    "James 1:5": {
      WEB: "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.",
      KJV: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
    },
    "Proverbs 15:22": {
      WEB: "Where there is no counsel, plans fail; but in a multitude of counselors they are established.",
      KJV: "Without counsel purposes are disappointed: but in the multitude of counsellors they are established.",
    },
    "John 11:35": {
      WEB: "Jesus wept.",
      KJV: "Jesus wept.",
    },
    "Lamentations 3:22–23": {
      WEB: "It is because of Yahweh's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness.",
      KJV: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    },
    "Matthew 11:28": {
      WEB: "Come to me, all you who labor and are heavily burdened, and I will give you rest.",
      KJV: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    },
    "Colossians 3:23": {
      WEB: "And whatever you do, work heartily, as for the Lord and not for men,",
      KJV: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men;",
    },
    "1 Timothy 6:10": {
      WEB: "For the love of money is a root of all kinds of evil. Some have been led astray from the faith in their greed, and have pierced themselves through with many sorrows.",
      KJV: "For the love of money is the root of all evil: which while some coveted after, they have erred from the faith, and pierced themselves through with many sorrows.",
    },
    "2 Corinthians 9:7": {
      WEB: "Let each man give according as he has determined in his heart, not grudgingly or under compulsion, for God loves a cheerful giver.",
      KJV: "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.",
    },
    "Ephesians 4:32": {
      WEB: "And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.",
      KJV: "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.",
    },
    "James 1:19": {
      WEB: "So, then, my beloved brothers, let every man be swift to hear, slow to speak, and slow to anger;",
      KJV: "Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath:",
    },
    "Ephesians 4:26": {
      WEB: "Be angry, and don't sin. Don't let the sun go down on your wrath,",
      KJV: "Be ye angry, and sin not: let not the sun go down upon your wrath:",
    },
    "1 Corinthians 13:4–5": {
      WEB: "Love is patient and is kind. Love doesn't envy. Love doesn't brag, is not proud, doesn't behave itself inappropriately, doesn't seek its own way, is not provoked, takes no account of evil;",
      KJV: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;",
    },
    "Genesis 2:18": {
      WEB: "Yahweh God said, “It is not good for the man to be alone. I will make him a helper comparable to him.”",
      KJV: "And the LORD God said, It is not good that the man should be alone; I will make him an help meet for him.",
    },
    "Hebrews 10:24–25": {
      WEB: "Let's consider how to provoke one another to love and good works, not forsaking our own assembling together, as the custom of some is, but exhorting one another, and so much the more as you see the Day approaching.",
      KJV: "And let us consider one another to provoke unto love and to good works: Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another: and so much the more, as ye see the day approaching.",
    },
    "Mark 9:24": {
      WEB: "Immediately the father of the child cried out with tears, “I believe. Help my unbelief!”",
      KJV: "And straightway the father of the child cried out, and said with tears, Lord, I believe; help thou mine unbelief.",
    },
    "Psalm 139:23–24": {
      WEB: "Search me, God, and know my heart. Try me, and know my thoughts. See if there is any wicked way in me, and lead me in the everlasting way.",
      KJV: "Search me, O God, and know my heart: try me, and know my thoughts: And see if there be any wicked way in me, and lead me in the way everlasting.",
    },
    "Romans 8:1": {
      WEB: "There is therefore now no condemnation to those who are in Christ Jesus, who don't walk according to the flesh, but according to the Spirit.",
      KJV: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
    },
    "Romans 8:26": {
      WEB: "In the same way, the Spirit also helps our weaknesses, for we don't know how to pray as we ought. But the Spirit himself makes intercession for us with groanings which can't be uttered.",
      KJV: "Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered.",
    },
    "Exodus 20:8": {
      WEB: "Remember the Sabbath day, to keep it holy.",
      KJV: "Remember the sabbath day, to keep it holy.",
    },
    "Proverbs 22:6": {
      WEB: "Train up a child in the way he should go, and when he is old he will not depart from it.",
      KJV: "Train up a child in the way he should go: and when he is old, he will not depart from it.",
    },
    "Psalm 27:14": {
      WEB: "Wait for Yahweh. Be strong, and let your heart take courage. Yes, wait for Yahweh.",
      KJV: "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.",
    },
    "Matthew 5:3–4": {
      WEB: "Blessed are the poor in spirit, for theirs is the Kingdom of Heaven. Blessed are those who mourn, for they shall be comforted.",
      KJV: "Blessed are the poor in spirit: for theirs is the kingdom of heaven. Blessed are they that mourn: for they shall be comforted.",
    },
    "Micah 6:8": {
      WEB: "He has shown you, O man, what is good. What does Yahweh require of you, but to act justly, to love mercy, and to walk humbly with your God?",
      KJV: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
    },
    "Galatians 6:2": {
      WEB: "Bear one another's burdens, and so fulfill the law of Christ.",
      KJV: "Bear ye one another's burdens, and so fulfil the law of Christ.",
    },
    "James 5:16": {
      WEB: "Confess your offenses to one another, and pray for one another, that you may be healed. The insistent prayer of a righteous person is powerfully effective.",
      KJV: "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.",
    },
    "2 Timothy 3:16": {
      WEB: "Every Scripture is God-breathed and profitable for teaching, for reproof, for correction, and for instruction in righteousness,",
      KJV: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:",
    },
  };

  const preferredTranslation = () => state.profile.translation || "WEB";

  const lookupVerse = (ref) => {
    const entry = SCRIPTURE[ref];
    if (!entry) return null;
    const wanted = preferredTranslation();
    if (entry[wanted]) return { ref, text: entry[wanted], translation: wanted, substituted: false };
    const meta = TRANSLATIONS.find((item) => item.value === wanted);
    return {
      ref,
      text: entry.WEB,
      translation: "WEB",
      substituted: Boolean(meta && meta.licensed),
      requested: wanted,
    };
  };

  /* ------------------------------------------------------------------ *
   * Answer composition
   * Each answer is built from labelled blocks so a reader can always tell
   * Scripture from interpretation, interpretation from practical advice,
   * and advice from questions Christians answer differently.
   * ------------------------------------------------------------------ */

  const answerBlock = ({ kind, label, note = "", body }) => `
    <section class="answer-block is-${kind}">
      <header class="answer-block-head">
        <span class="answer-tag">${escapeHtml(label)}</span>
        ${note ? `<span class="answer-tag-note">${note}</span>` : ""}
      </header>
      <div class="answer-block-body">${body}</div>
    </section>`;

  const scriptureBlock = (refs = []) => {
    const verses = refs.map(lookupVerse).filter(Boolean);
    if (!verses.length) return "";
    const swapped = verses.find((verse) => verse.substituted);
    const note = swapped
      ? `Showing WEB — ${escapeHtml(swapped.requested)} needs a publisher licence`
      : `${escapeHtml(verses[0].translation)} · public domain`;
    const body = verses
      .map(
        (verse) => `
        <blockquote class="verse">
          <p>${escapeHtml(verse.text)}</p>
          <cite>${escapeHtml(verse.ref)}<span>${escapeHtml(verse.translation)}</span></cite>
        </blockquote>`,
      )
      .join("");
    return answerBlock({ kind: "scripture", label: "Scripture", note, body });
  };

  const listBody = (items = []) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

  const answerActions = (actions = []) =>
    actions.length
      ? `<div class="answer-actions">${actions
          .map(
            (action) =>
              `<button type="button" data-action="follow-suggestion" data-route="${escapeHtml(action.route)}"${
                action.filter ? ` data-filter="${escapeHtml(action.filter)}"` : ""
              }>${icon(action.icon || "arrow")} ${action.label}</button>`,
          )
          .join("")}</div>`
      : "";

  /* ------------------------------------------------------------------ *
   * Crisis routing
   * Runs before every other branch. When it matches, the answer is only
   * the escalation — devotional content never delays a real referral.
   * ------------------------------------------------------------------ */

  const CRISIS_ROUTES = [
    {
      id: "self-harm",
      test: /\b(kill myself|killing myself|suicid|end my life|ending my life|take my own life|want to die|wanna die|don'?t want to (live|be alive|wake up)|better off dead|no reason to live|hurt myself|hurting myself|self.?harm|cut myself|overdose)/i,
      lead: "Thank you for telling me. That is a heavy thing to carry, and I don't want you to carry it by yourself.",
      resources: [
        ["988", "Suicide &amp; Crisis Lifeline — call or text <strong>988</strong>, any time, free and confidential."],
        ["Crisis Text Line", "Text <strong>HOME</strong> to <strong>741741</strong> to reach a trained counselor by text."],
        ["Immediate danger", "If you might act on this soon, call <strong>911</strong> or go to your nearest emergency department."],
      ],
    },
    {
      id: "abuse",
      test: /\b(domestic (violence|abuse)|being abused|he (hits|beats|chokes) me|she (hits|beats|chokes) me|my (husband|wife|partner|boyfriend|girlfriend) (hits|hurts|beats|threatens) me|afraid of my (husband|wife|partner)|sexual(ly)? assault|raped|rape me)/i,
      lead: "I'm sorry. What you're describing is not something you have to justify, minimize, or pray your way out of alone.",
      resources: [
        ["National DV Hotline", "Call <strong>1-800-799-7233</strong>, text <strong>START</strong> to <strong>88788</strong>, or chat at thehotline.org."],
        ["Immediate danger", "If you are in danger right now, call <strong>911</strong>."],
        ["Plan privately", "Consider using a device the other person cannot access, and clearing this conversation afterward."],
      ],
    },
    {
      id: "child-safety",
      test: /\b(child (abuse|is being (hurt|abused))|someone is hurting my (child|kid|son|daughter)|hurting a child|abused as a child by)/i,
      lead: "A child's safety comes before every other consideration here, including privacy or reputation.",
      resources: [
        ["Childhelp Hotline", "Call or text <strong>1-800-422-4453</strong> to speak with a counselor about a child's safety."],
        ["Immediate danger", "If a child is in danger right now, call <strong>911</strong>."],
        ["Mandatory reporting", "Many roles — including church staff and volunteers — carry a legal duty to report. Ask the hotline what applies to you."],
      ],
    },
    {
      id: "medical",
      test: /\b(chest pain|can'?t breathe|cannot breathe|heart attack|having a stroke|bleeding (badly|heavily)|unconscious|not breathing)/i,
      lead: "That needs medical attention now, not an app.",
      resources: [
        ["Emergency services", "Call <strong>911</strong> — or your local emergency number — right away."],
        ["Poison Control", "For a suspected poisoning or overdose, call <strong>1-800-222-1222</strong>."],
      ],
    },
  ];

  const detectCrisis = (text) => CRISIS_ROUTES.find((route) => route.test.test(text)) || null;

  // One source of truth for the numbers themselves — the Ask answer and the
  // composer interception must never drift apart on what help they name.
  const crisisResourceList = (route) => `
    <ul class="crisis-resources">
      ${route.resources
        .map(
          ([label, detail]) =>
            `<li><span class="crisis-resource-label">${escapeHtml(label)}</span><span>${detail}</span></li>`,
        )
        .join("")}
    </ul>
    <p class="crisis-scope">These numbers serve the United States. Elsewhere, contact your local emergency number or a national crisis line.</p>`;

  const buildCrisisResponse = (route) => {
    const comfort = lookupVerse("Psalm 34:18");
    return `
      <div class="answer answer-crisis" data-crisis="${escapeHtml(route.id)}">
        <section class="crisis-card">
          <header class="crisis-head">
            <span class="crisis-mark">${icon("shield")}</span>
            <div>
              <strong>Please talk to a person, not only to me</strong>
              <small>Trumpet Nation paused its usual answer for this one.</small>
            </div>
          </header>
          <p class="crisis-lead">${route.lead}</p>
          ${crisisResourceList(route)}
          <p class="crisis-honesty">${icon(
            "eye",
          )} I'm an AI, and this is a prototype. I can't check on you later, and I shouldn't be the only one who knows about this.</p>
        </section>
        ${
          comfort
            ? `<section class="answer-block is-scripture crisis-comfort">
                <header class="answer-block-head">
                  <span class="answer-tag">If it helps to hear it</span>
                  <span class="answer-tag-note">${escapeHtml(comfort.translation)}</span>
                </header>
                <div class="answer-block-body">
                  <blockquote class="verse">
                    <p>${escapeHtml(comfort.text)}</p>
                    <cite>${escapeHtml(comfort.ref)}<span>${escapeHtml(comfort.translation)}</span></cite>
                  </blockquote>
                </div>
              </section>`
            : ""
        }
        ${answerActions([
          { label: "Trust &amp; safety", route: "safety", icon: "shield" },
          { label: "Share with a trusted circle", route: "prayer", icon: "hands" },
        ])}
      </div>`;
  };

  /* ------------------------------------------------------------------ *
   * Topics
   * ------------------------------------------------------------------ */

  const TOPICS = [
    {
      id: "grief",
      test: /\b(grief|grieving|mourn|died|death|passed away|funeral|loss of my|lost my (mom|dad|mother|father|wife|husband|son|daughter|friend)|miscarriage)/i,
      opening:
        "I'm sorry. Grief isn't a problem to be solved, and it doesn't move on a schedule — least of all anyone else's.",
      refs: ["John 11:35", "Lamentations 3:22–23"],
      reading:
        "The shortest verse in the Bible has Jesus weeping at a grave he is about to open. Whatever else it means, it means grief is not a failure of faith — he had the power to fix it and he cried first.",
      practice: [
        "Let the day be as small as it needs to be. One meal, one errand, one call.",
        "Say the person's name out loud to someone who knew them.",
        "Write down one thing you're angry about. Grief that can't be angry usually just goes underground.",
      ],
      differ:
        "Traditions differ on prayer for the dead, the state of the departed, and what to say at a graveside. If someone's answer lands wrong on you right now, it may be their tradition speaking rather than a verdict on your loved one.",
      lens: {
        Catholic: "Praying for the dead is a normal and encouraged part of your tradition — a Mass offered for them is a concrete thing you can do.",
        Orthodox: "Memorial prayers and the 40-day cycle give grief a shape and a calendar when you can't generate one yourself.",
        Baptist: "Your tradition tends to focus on the hope of resurrection rather than prayer for the dead; that emphasis is doing pastoral work, not dismissing your loss.",
      },
      human: "Grief that stops you eating, sleeping, or functioning for a long stretch deserves a grief counselor — that is ordinary, not weak.",
      actions: [{ label: "Ask for prayer", route: "prayer", icon: "hands" }],
    },
    {
      id: "anxiety",
      test: /\b(anx|worr|panic|fear|afraid|overwhelm|stress|dread|nervous)/i,
      opening:
        "Anxiety makes the next hour feel like the whole future. You don't have to solve everything to take the next honest step.",
      refs: ["Philippians 4:6–7", "Psalm 46:1"],
      reading:
        "Paul writes this from confinement, not from comfort — so it reads less like advice to relax and more like a practice for people already under pressure. Note the order: the peace is promised as a guard over the heart, not as the removal of the circumstance.",
      practice: [
        "<strong>Name it plainly:</strong> “God, I am afraid about ___.” No editing.",
        "<strong>Separate the two lists:</strong> what is actually yours to carry today, and what you are carrying on someone else's behalf.",
        "<strong>Choose one action</strong> small enough to finish in ten minutes — a call, water, a walk, the next necessary task.",
      ],
      differ:
        "Christians disagree about how much anxiety is a spiritual condition versus a medical one. Many traditions now hold both: prayer and treatment are not competitors.",
      lens: {
        Pentecostal: "Your tradition may emphasize prayer for deliverance and peace — that sits alongside, not instead of, clinical care.",
        Catholic: "You may find the examen or a fixed hour of prayer steadier than spontaneous prayer when anxiety is high.",
        Exploring: "You don't need settled belief to try any of this. Start with the breathing and the honesty; the rest can wait.",
      },
      human: "If anxiety is disrupting sleep, eating, or work for more than a couple of weeks, that is worth a conversation with a physician or therapist.",
      actions: [{ label: "Two minutes of quiet prayer", route: "prayer", icon: "hands" }],
    },
    {
      id: "decision",
      test: /\b(decision|decide|choose|choosing|choice|discern|which option|should i (take|move|quit|accept)|wisdom)/i,
      opening:
        "A faithful decision usually isn't the one with the least uncertainty. It's the one you can walk into honestly and own afterward.",
      refs: ["James 1:5", "Proverbs 15:22"],
      reading:
        "Wisdom here is something asked for and given, not deduced. But notice that the same letter assumes counsel from actual people — the promise isn't a substitute for advice, it's the disposition you bring to it.",
      practice: [
        "<strong>Facts vs assumptions:</strong> write both columns. Most hard decisions are hard because the columns are mixed.",
        "<strong>Fruit:</strong> which option more likely grows patience, honesty, courage, service — in a year, not a week?",
        "<strong>Counsel:</strong> ask someone who knows both your gifts and your blind spots. Not only people who will agree.",
        "<strong>Freedom:</strong> are you choosing from calling, or from fear, pride, or someone else's timeline?",
        "<strong>Smallest reversible step:</strong> what would buy you better information without violating a conviction?",
      ],
      differ:
        "Christians differ sharply on how directly God guides particular choices — from a specific individual will to be discovered, to freedom within wisdom. Both camps read the same verses.",
      lens: {
        Presbyterian: "Your tradition tends to emphasize wisdom and providence over a hidden blueprint — you're freer here than you may feel.",
        Pentecostal: "Your tradition takes prompting and confirmation seriously; test them against Scripture, counsel, and your actual circumstances.",
        Catholic: "Ignatian discernment — noticing consolation and desolation over time — is a well-worn tool inside your tradition.",
      },
      actions: [{ label: "Talk it through", route: "ask", icon: "spark" }],
    },
    {
      id: "work",
      test: /\b(job|career|work|boss|coworker|promotion|fired|laid off|quit|vocation|calling|burnout|burned out)/i,
      opening:
        "Work occupies most of your waking life, so it's worth asking what it's forming in you — not only what it pays.",
      refs: ["Colossians 3:23", "Micah 6:8"],
      reading:
        "This was written to a mixed household including people with no career mobility at all. It dignifies the work itself rather than promising advancement — which is why it consoles and why it has sometimes been misused to excuse bad conditions.",
      practice: [
        "Name what you actually owe your employer, and what you've been giving beyond it out of fear.",
        "Identify one thing in your work that genuinely serves someone. Do that part deliberately this week.",
        "If you're burned out, the fix is usually structural — hours, scope, staffing — not attitudinal.",
      ],
      differ:
        "Christians differ on whether “calling” applies to ordinary jobs or mainly to ministry, and on how far an employer's claims on your time should extend.",
      human: "If work is damaging your health or you're facing something unlawful, talk to a physician or an employment attorney — not only a pastor.",
      actions: [{ label: "Serve with your skills", route: "serve", icon: "heart", filter: "care" }],
    },
    {
      id: "money",
      test: /\b(money|debt|broke|bills|afford|financ|budget|salary|rent|paycheck|bankrupt)/i,
      opening:
        "Money questions are rarely only about money. It helps to separate the math problem from the fear underneath it.",
      refs: ["1 Timothy 6:10", "Matthew 11:28"],
      reading:
        "This verse is widely misquoted as “money is the root of all evil.” The text says the <em>love</em> of money, and calls it <em>a</em> root of <em>many kinds</em> of evil. The precision matters — it's a warning about attachment, not a condemnation of provision.",
      practice: [
        "Write the actual number you owe. Vagueness costs more than the debt does.",
        "Rank debts by interest rate, then by which one is costing you the most sleep. Sometimes those differ, and starting with the second is fine.",
        "Ask your church about a benevolence fund before a payday lender. Many have one and don't advertise it.",
      ],
      differ:
        "Christians differ on tithing — whether ten percent is a binding floor, a guideline, or fulfilled in Christ — and on whether debt is ever wise. Be careful with any teaching that promises financial return for giving.",
      human: "A non-profit credit counselor (NFCC-accredited) is free or low-cost, and better than most advice you'll get from an app.",
      actions: [{ label: "How Trumpet Nation handles giving", route: "give", icon: "gift" }],
    },
    {
      id: "giving",
      test: /\b(tithe|tithing|give|giving|generous|generosity|donate|donation|offering)/i,
      opening:
        "Giving works best when it's decided in advance and quietly — not extracted in a moment of pressure.",
      refs: ["2 Corinthians 9:7", "Micah 6:8"],
      reading:
        "Paul is organizing a relief collection for a famine-struck church, and he explicitly refuses to compel it. “Not under compulsion” is a constraint on the fundraiser as much as an encouragement to the giver.",
      practice: [
        "Decide an amount and a rhythm now, while nobody is asking.",
        "Give where you can see the outcome. Ask for the annual report; a healthy organization is glad you asked.",
        "Check administrative ratios and board independence before recurring gifts.",
      ],
      differ:
        "Whether the tithe binds Christians today is a genuine and old disagreement. Traditions also differ on giving to the local congregation first versus directly to need.",
      lens: {
        Catholic: "Your tradition frames this within almsgiving — one of the three pillars alongside prayer and fasting.",
        Baptist: "Congregational giving to the local church is typically the emphasis in your tradition.",
      },
      actions: [{ label: "See verified campaigns", route: "give", icon: "gift" }],
    },
    {
      id: "forgiveness",
      test: /\b(forgiv|resent|bitter|grudge|apolog|betray|cheated on me)/i,
      opening:
        "Forgiveness and reconciliation are not the same thing. One can happen inside you; the other requires the other person to change.",
      refs: ["Ephesians 4:32", "Psalm 139:23–24"],
      reading:
        "The pattern given is “as God forgave you” — which in the same letter involves cost and honesty about the wrong, not pretending it didn't happen. Forgiveness names the debt before it releases it.",
      practice: [
        "Write what was actually done. Forgiveness that skips the specifics tends not to hold.",
        "Decide what you're releasing: the debt, or your right to keep prosecuting it.",
        "Decide separately what access this person gets to you. Those are two different decisions.",
      ],
      differ:
        "Christians differ on whether forgiveness requires repentance from the offender, and on how quickly it should be extended. Anyone who tells you trust must be restored immediately is adding to the text.",
      human: "Forgiveness is never a reason to return to somewhere unsafe. If safety is a factor, talk to someone qualified before deciding anything.",
    },
    {
      id: "conflict",
      test: /\b(conflict|argument|fight|confront|conversation|marriage|my (spouse|husband|wife)|relationship|friend)/i,
      opening:
        "Go in aiming for truth and repair rather than victory. Narrow the scope — one conversation cannot relitigate the whole history.",
      refs: ["James 1:19", "1 Corinthians 13:4–5"],
      reading:
        "“Quick to hear, slow to speak” is written to a community in conflict, not to individuals being polite. It's a rule for group life under strain.",
      practice: [
        "<strong>Observation:</strong> “When ___ happened…” — no motives assigned.",
        "<strong>Impact:</strong> “I felt / experienced ___.”",
        "<strong>Ownership:</strong> “My part in this is ___.”",
        "<strong>Request:</strong> “Would you be willing to ___?”",
        "Repeat their concern back until they say you got it right — before you answer it.",
      ],
      differ:
        "Traditions differ on divorce, remarriage, and what obligations remain in a failing marriage. These differences are real and consequential; a general answer shouldn't pretend otherwise.",
      human: "For a marriage in trouble, a licensed couples therapist and a trusted pastor are a stronger pairing than either alone.",
    },
    {
      id: "dating",
      test: /\b(dating|date|single|singleness|girlfriend|boyfriend|courtship|marry|engaged|romance)/i,
      opening:
        "Clarity is kinder than ambiguity. Say what you're looking for early, and pay attention to character over chemistry — but don't pretend chemistry is irrelevant.",
      refs: ["Genesis 2:18", "1 Corinthians 13:4–5"],
      reading:
        "“Not good to be alone” is said before anything has gone wrong — loneliness is treated as a design feature to be answered, not a deficiency to be ashamed of. Note it's addressed by companionship broadly, which the tradition has applied to friendship and community as well as marriage.",
      practice: [
        "Decide your boundaries before the moment, not during it.",
        "Meet their friends early. People are most themselves in their existing relationships.",
        "Watch how they treat servers, family, and people who can't do anything for them.",
      ],
      differ:
        "Christians differ substantially on dating versus courtship, physical boundaries, dating outside the faith, and the place of singleness. Some traditions hold singleness as a high calling rather than a waiting room.",
      human: "Meet in public, tell someone where you're going, and treat pressure to move fast or isolate you as a serious signal.",
      actions: [{ label: "Safety in relationships", route: "safety", icon: "shield" }],
    },
    {
      id: "parenting",
      test: /\b(parent|my (kid|kids|child|children|son|daughter)|raising|toddler|teenager)/i,
      opening:
        "Most parenting questions are really questions about which battle is worth fighting this week.",
      refs: ["Proverbs 22:6", "Ephesians 4:26"],
      reading:
        "Proverbs are observations about how life generally goes, not guarantees. Read as a promise, this verse has done real harm to faithful parents of struggling adult children.",
      practice: [
        "Pick the one or two things that actually matter this season and let some others go.",
        "Repair after you lose your temper — out loud. Children learn repair by watching it.",
        "Ask what they think you're most worried about. The answer is often instructive.",
      ],
      differ:
        "Traditions differ on discipline, schooling, baptism and dedication, and how much authority parents retain over adult children.",
    },
    {
      id: "loneliness",
      test: /\b(lonely|loneliness|isolated|no friends|new (city|town|church)|find a church|belong)/i,
      opening:
        "Belonging is usually built by repetition rather than by one good conversation. Show up to the same thing three times before judging it.",
      refs: ["Hebrews 10:24–25", "Genesis 2:18"],
      reading:
        "The instruction assumes gathering was already becoming difficult for this community. It's realistic about how much easier it is to drift than to attend.",
      practice: [
        "Choose one recurring gathering and commit to six weeks before evaluating.",
        "Volunteer for a task. Serving alongside people creates connection faster than mingling does.",
        "Invite one person to something specific with a date attached.",
      ],
      differ:
        "Traditions differ on what makes a church a church, so “finding a good one” means different things to different Christians.",
      actions: [
        { label: "Find groups near you", route: "discover", icon: "compass" },
        { label: "Serve alongside people", route: "serve", icon: "heart", filter: "care" },
      ],
    },
    {
      id: "doubt",
      test: /\b(doubt|deconstruct|losing my faith|don'?t believe|is god real|why does god|unanswered|silent)/i,
      opening:
        "Doubt is not the opposite of faith; certainty is not the same as trust. Plenty of people in the text argue with God and stay.",
      refs: ["Mark 9:24", "Psalm 27:14"],
      reading:
        "“I believe; help my unbelief” is a contradiction said out loud — and the request is granted anyway. The tradition has generally taken that as permission rather than as a rebuke.",
      practice: [
        "Write the actual question, as sharply as you can. Vague doubt is unanswerable and exhausting.",
        "Separate intellectual objections from wounds. They need different responses, and mixing them stalls both.",
        "Find one person who won't panic when you say it out loud.",
      ],
      differ:
        "Traditions differ enormously on how much questioning is welcome, and on which questions are open versus settled. If your community can't hold the question, that is information about the community, not necessarily about the question.",
      human: "If doubt is tangled with church hurt or spiritual abuse, a therapist familiar with religious trauma is worth finding.",
    },
    {
      id: "anger",
      test: /\b(angry|anger|rage|furious|resentment|hate (him|her|them))/i,
      opening:
        "Anger usually reports something real — a boundary crossed, a value violated. The question is what you do in the next ten minutes.",
      refs: ["Ephesians 4:26", "James 1:19"],
      reading:
        "The text assumes anger will happen and sets a boundary around its duration rather than forbidding it outright.",
      practice: [
        "Delay the reply. Write it, don't send it, and read it in the morning.",
        "Name what was actually violated. “I'm angry” is a symptom; “they went around me” is the finding.",
        "Decide what you want to be true in a month, then act toward that.",
      ],
      differ: "Christians differ on whether anger is ever righteous, and on how directly to confront.",
    },
    {
      id: "shame",
      test: /\b(shame|guilt|ashamed|worthless|unforgivable|failed|sin i keep)/i,
      opening:
        "Guilt says you did something wrong. Shame says you are something wrong. The second one lies, and it's louder.",
      refs: ["Romans 8:1", "Psalm 139:23–24"],
      reading:
        "“No condemnation” is stated as a present verdict, not a future hope. Whatever your tradition says about how that verdict is applied, none of them make it dependent on how you feel today.",
      practice: [
        "Say the thing out loud to one safe person. Shame survives on secrecy specifically.",
        "Separate what you owe someone (repair) from what you owe yourself (contempt). Only the first is required.",
        "Notice whether the voice sounds like God or like someone who hurt you.",
      ],
      differ:
        "Traditions differ on confession — to a priest, to one another, privately — and on assurance. If your tradition offers sacramental confession, that is a concrete route, not a last resort.",
      lens: {
        Catholic: "Sacramental confession exists precisely for this. It's ordinary, not exceptional.",
        Orthodox: "Confession with a spiritual father is the normal path here in your tradition.",
        Lutheran: "Assurance is central in your tradition — the verdict rests on Christ, not on your performance of repentance.",
      },
      human: "Persistent shame, intrusive guilt, or scrupulosity can be treated. A therapist who understands religious contexts helps.",
    },
    {
      id: "prayer-how",
      test: /\b(how (do|to) (i )?pray|prayer routine|prayer life|teach me to pray|devotional|quiet time|rule of life|simple prayer|a prayer|prayer before|words for a prayer)/i,
      opening:
        "A prayer life that survives is usually short, fixed, and unimpressive. Frequency beats intensity.",
      refs: ["Romans 8:26", "Matthew 11:28"],
      reading:
        "Paul assumes not knowing how to pray is the normal condition rather than a beginner's problem — and locates the help in the Spirit rather than in technique.",
      practice: [
        "Anchor it to something you already do daily: coffee, the commute, closing the laptop.",
        "Five minutes: one thing you're grateful for, one thing you're carrying, one person who isn't you.",
        "Keep a written list. Memory makes prayer feel less answered than it was.",
      ],
      differ:
        "Traditions differ on fixed versus spontaneous prayer, praying with saints, tongues, and set hours. Try what your tradition offers before importing someone else's method.",
      lens: {
        Catholic: "The Liturgy of the Hours or a daily rosary gives you structure you don't have to generate.",
        Orthodox: "The Jesus Prayer and a morning rule are the standard entry points in your tradition.",
        Anglican: "Daily Office — Morning and Evening Prayer — is built for exactly this.",
        Pentecostal: "Your tradition trusts spontaneity; a written list still helps you notice answers later.",
      },
      actions: [{ label: "Start a quiet moment", route: "prayer", icon: "hands" }],
    },
    {
      id: "study",
      test: /\b(bible study|study a|lead a study|small group|prepare a (lesson|study)|read the bible|reading plan)/i,
      opening:
        "Preparing a study is mostly restraint: choose less text, ask better questions, and leave room for the group to do the work.",
      refs: ["2 Timothy 3:16", "Psalm 139:23–24"],
      reading:
        "Note what Scripture is said to be profitable <em>for</em> — teaching, correction, training. It's framed as formative rather than merely informational.",
      practice: [
        "Take one passage, not a theme. Ten verses is plenty for an hour.",
        "Ask three questions: What does it say? What did it mean to them? What does it ask of us?",
        "Prepare one question you don't know the answer to.",
        "Read it aloud twice, in two translations, before anyone comments.",
      ],
      differ:
        "Traditions differ on interpretive authority — magisterium, confessions, congregational reading — and on how much historical context should govern application.",
      actions: [{ label: "Find a study near you", route: "discover", icon: "book" }],
    },
    {
      id: "sermon-mount",
      test: /\b(sermon on the mount|beatitude|matthew [567])/i,
      opening:
        "Read Matthew 5–7 as Jesus forming a people, not listing private ideals. It moves from identity, to relationships, to hidden devotion, to trust and practice.",
      refs: ["Matthew 5:3–4"],
      reading:
        "Three things to notice: the inside and outside stay together; secret faithfulness is freed from performance; and the whole thing ends not with “understand my words” but “put them into practice.”",
      practice: [
        "Read Matthew 5:1–16 slowly, twice.",
        "Ask: what kind of person is being blessed here — and where am I being invited to become visible through love?",
      ],
      differ:
        "Christians differ on whether the Sermon is an attainable ethic, an impossible standard that drives us to grace, or an ethic for the age to come. That choice shapes the whole reading.",
    },
    {
      id: "sabbath",
      test: /\b(sabbath|rest|exhausted|tired all the time|overworked|slow down|sunday)/i,
      opening:
        "Rest is commanded, which suggests it doesn't happen on its own — and that the resistance you feel to it isn't unique to you.",
      refs: ["Exodus 20:8", "Matthew 11:28"],
      reading:
        "The command is given to a people just released from forced labor. It functions as a protection against being worked without limit — including by yourself.",
      practice: [
        "Choose a fixed stretch — even four hours — and defend it on the calendar.",
        "Decide in advance what you won't do: email, errands, the one app.",
        "Plan something you enjoy. Rest that's only abstinence doesn't hold.",
      ],
      differ:
        "Christians differ on whether Sabbath transfers to Sunday, binds believers today, or is fulfilled in Christ — and on what may be done during it.",
    },
    {
      id: "illness",
      test: /\b(sick|illness|cancer|diagnos|surgery|chronic|pain|hospital|healing)/i,
      opening:
        "I'm sorry you're facing this. Prayer and medicine belong together — the tradition has generally held both without embarrassment.",
      refs: ["James 5:16", "Psalm 34:18"],
      reading:
        "James pairs prayer with the elders' physical presence and anointing — the response is communal and embodied, not private and mental.",
      practice: [
        "Bring someone to the next appointment to take notes. You will not retain it alone.",
        "Write your questions before you go; ask the ones you're embarrassed to ask.",
        "Let people bring meals. Receiving is its own discipline.",
      ],
      differ:
        "Traditions differ sharply on healing prayer, anointing, and what unanswered prayer means. Be cautious with any teaching that makes recovery a function of your faith — that adds guilt to illness.",
      lens: {
        Catholic: "Anointing of the Sick is available to you and is not only for the dying — many people misunderstand this.",
        Pentecostal: "Your tradition prays boldly for healing; hold that alongside treatment, and refuse any framing that blames the sick person.",
      },
      human: "Medical decisions belong with your clinicians. Nothing here is medical advice.",
    },
    {
      id: "addiction",
      test: /\b(addict|alcohol|drinking|porn|gambl|relapse|sober|can'?t stop)/i,
      opening:
        "Willpower alone has a poor track record here. What tends to work is structure, honesty, and other people — repeatedly.",
      refs: ["Galatians 6:2", "James 5:16"],
      reading:
        "“Bear one another's burdens” assumes the burden is visible to someone. Secrecy is usually the part that keeps the cycle running.",
      practice: [
        "Tell one person the actual truth, including the frequency.",
        "Change the environment before you test your resolve — access matters more than intention.",
        "Find a group that meets weekly. Consistency beats intensity.",
      ],
      differ:
        "Christians differ on whether addiction is primarily sin, disease, or both, and on total abstinence versus moderation. The disagreement is real; the isolation is what's dangerous.",
      human: "SAMHSA's National Helpline — 1-800-662-4357 — is free, confidential, and available 24/7 for treatment referrals.",
    },
    {
      id: "waiting",
      test: /\b(waiting|unanswered prayer|nothing (is )?happening|how long|still single|still no)/i,
      opening:
        "Waiting is the part nobody writes books about. It's also where most of the actual life happens.",
      refs: ["Psalm 27:14", "Lamentations 3:22–23"],
      reading:
        "Lamentations says mercies are new every morning in the middle of a book about a destroyed city. It is not optimism — it's a decision to name one true thing while everything else is unresolved.",
      practice: [
        "Name what you're actually waiting for, and what you'd do differently if it never came.",
        "Build something in the meantime that doesn't depend on the outcome.",
        "Let someone else know the date you're dreading before it arrives.",
      ],
      differ:
        "Christians differ on why prayers go unanswered — timing, providence, mystery, our own asking. Be wary of anyone who explains your specific situation with total confidence.",
    },
    {
      id: "serve",
      test: /\b(serve|serving|volunteer|help people|neighbor|outreach|mission|give back)/i,
      opening:
        "Start with a need close enough to become a relationship. Service that lasts is usually smaller than the version you imagine at the start.",
      refs: ["Micah 6:8", "Galatians 6:2"],
      reading:
        "Micah reduces a vast religious system to three things, and two of them are about how you treat people. The third — walking humbly — is what keeps the first two from becoming a project.",
      practice: [
        "Choose one issue and one repeatable role. Six weeks minimum before you evaluate.",
        "Be led by people already doing the work. Learn names before offering strategy.",
        "Ask the organization what they actually need, rather than what you'd enjoy providing.",
      ],
      differ:
        "Christians differ on the relationship between service and evangelism, and on charity versus systemic change. Most healthy organizations have made a deliberate choice — ask what theirs is.",
      actions: [{ label: "Compare opportunities near you", route: "serve", icon: "heart", filter: "families" }],
    },
  ];

  const REFERENCE_PATTERN = /\b((?:[123]\s?)?[A-Z][a-z]+)\s+(\d{1,3}):(\d{1,3})(?:[-–—](\d{1,3}))?\b/;

  const findReferenced = (prompt) => {
    const match = prompt.match(REFERENCE_PATTERN);
    if (!match) return null;
    const book = match[1].replace(/\s+/g, " ").trim().toLowerCase();
    const chapter = match[2];
    const key = Object.keys(SCRIPTURE).find((ref) => {
      const normalized = ref.toLowerCase();
      return normalized.startsWith(`${book} ${chapter}:`);
    });
    return key ? lookupVerse(key) : null;
  };

  const buildTrumpetResponse = (prompt) => {
    const clean = String(prompt || "");
    const crisis = detectCrisis(clean);
    if (crisis) return buildCrisisResponse(crisis);

    const topic = TOPICS.find((item) => item.test.test(clean));
    const lens = escapeHtml(state.profile.tradition);
    const tone = escapeHtml(state.profile.tone);
    const header = `<p class="answer-lens">${icon("shield")} Read through your <strong>${lens}</strong> lens · ${tone}</p>`;

    if (!topic) {
      const referenced = findReferenced(clean);
      const scripture = referenced ? scriptureBlock([referenced.ref]) : "";
      return `
        <div class="answer">
          ${header}
          <p>${
            referenced
              ? "Here is the passage you asked about, with the layers kept separate so you can see where the text ends and my reading begins."
              : "Let's make this more concrete — I'd rather ask than assume. Tell me a bit more and I'll work through it with you properly."
          }</p>
          ${scripture}
          ${answerBlock({
            kind: "practice",
            label: "A place to start",
            note: "Practical, not authoritative",
            body: listBody([
              "Write the situation in one sentence, without assigning anyone's motives.",
              "Name the value or responsibility you most want to protect.",
              "Choose one action small enough to complete in the next 24 hours.",
            ]),
          })}
          ${answerBlock({
            kind: "differ",
            label: "Worth knowing",
            note: "Where Christians differ",
            body: `<p>On most questions worth asking, faithful Christians have landed in different places for a long time. If you tell me your tradition matters here, I'll say where the disagreements actually fall rather than flattening them.</p>`,
          })}
        </div>`;
    }

    const lensNote = topic.lens && topic.lens[state.profile.tradition];

    return `
      <div class="answer" data-topic="${escapeHtml(topic.id)}">
        ${header}
        <p class="answer-opening">${topic.opening}</p>
        ${scriptureBlock(topic.refs || [])}
        ${
          topic.reading
            ? answerBlock({
                kind: "reading",
                label: "How this is often read",
                note: "Interpretation, not Scripture",
                body: `<p>${topic.reading}</p>`,
              })
            : ""
        }
        ${
          topic.practice
            ? answerBlock({
                kind: "practice",
                label: "One step from here",
                note: "Practical, not authoritative",
                body: listBody(topic.practice),
              })
            : ""
        }
        ${
          topic.differ
            ? answerBlock({
                kind: "differ",
                label: "Where Christians differ",
                note: "Held in good faith on both sides",
                body: `<p>${topic.differ}</p>${
                  lensNote ? `<p class="lens-aside"><strong>In your ${lens} lens:</strong> ${lensNote}</p>` : ""
                }`,
              })
            : ""
        }
        ${
          topic.human
            ? answerBlock({
                kind: "human",
                label: "Worth bringing to a person",
                note: "Trumpet Nation is not a substitute",
                body: `<p>${topic.human}</p>`,
              })
            : ""
        }
        ${answerActions(topic.actions || [])}
      </div>`;
  };

  const renderPost = (post) => {
    const encouraged = state.encouragedPosts.has(post.id);
    const prayed = state.prayedPosts.has(post.id);
    return `
      <article class="post-card">
        <div class="post-head">
          ${avatarMarkup(post)}
          <div class="post-author">
            <strong>${escapeHtml(post.author)} ${post.verified ? `<span class="verified" title="Verified partner">${icon("check")}</span>` : ""}</strong>
            <small>${escapeHtml(post.time)} · ${escapeHtml(post.audience)}</small>
          </div>
          <button class="post-menu" type="button" data-action="post-menu" data-id="${post.id}" aria-label="Post options">•••</button>
        </div>
        <div class="post-body">
          <p>${escapeHtml(post.content)}</p>
          ${
            post.type === "quote"
              ? `<div class="post-media"><div class="post-media-quote">${escapeHtml(post.quote)}</div></div>`
              : post.type === "event"
                ? `<div class="post-event">
                    <div class="event-date"><span>${escapeHtml(post.event.month)}</span><strong>${escapeHtml(post.event.day)}</strong></div>
                    <div class="event-copy"><strong>${escapeHtml(post.event.title)}</strong><p>${escapeHtml(post.event.meta)}</p></div>
                  </div>`
                : ""
          }
        </div>
        <div class="post-stats">
          <span>${post.encouraged + (encouraged ? 1 : 0)} encouraged · ${post.prayers + (prayed ? 1 : 0)} praying</span>
          <span>${post.comments} comments</span>
        </div>
        <div class="post-actions">
          <button class="${encouraged ? "active" : ""}" type="button" data-action="encourage-post" data-id="${post.id}">${icon("heart")}<span>Encourage</span></button>
          <button class="${prayed ? "active" : ""}" type="button" data-action="pray-post" data-id="${post.id}">${icon("hands")}<span>Pray</span></button>
          <button type="button" data-action="comment-post" data-id="${post.id}">${icon("message")}<span>Comment</span></button>
          <button type="button" data-action="share-post" data-id="${post.id}">${icon("share")}<span>Share</span></button>
        </div>
      </article>`;
  };

  const renderCommunity = () => {
    const groups = [
      { id: "group-faith-work", name: "Faith & work", meta: "4.2k members · weekly", icon: "compass" },
      { id: "group-parents", name: "Parents in prayer", meta: "8.9k members · active now", icon: "hands" },
      { id: "group-scripture", name: "Read Scripture slowly", meta: "2.7k members · 30-day rhythm", icon: "book" },
    ];
    return `
      ${pageHeader({
        kicker: "A healthier social space",
        title: "Community built for encouragement.",
        description: "Follow people and ministries you trust, join smaller circles, and turn conversation into prayer and action.",
        actions: `<button class="btn btn-primary" type="button" data-action="open-composer">${icon("plus")} Share something</button>`,
      })}
      <div class="filter-bar">
        <div class="segmented" aria-label="Community feed filter">
          ${["For you", "Following", "Local"]
            .map((filter) => `<button class="${state.communityFilter === filter ? "active" : ""}" type="button" data-action="community-filter" data-value="${filter}">${filter}</button>`)
            .join("")}
        </div>
        <button class="btn btn-ghost btn-small" type="button" data-action="open-command">${icon("search")} Find people, groups, or topics</button>
      </div>
      <div class="community-layout">
        <section class="feed" aria-label="Community feed">
          <div class="composer-card">
            <div class="composer-topline">
              ${avatarMarkup(state.profile)}
              <button class="composer-fake-input" type="button" data-action="open-composer">Share a reflection, question, need, or invitation…</button>
            </div>
            ${
              state.composerOpen
                ? `<form class="composer-expanded" id="post-form">
                    <label class="visually-hidden" for="post-content">Post content</label>
                    <textarea class="textarea" id="post-content" name="content" placeholder="What would be helpful to share?" maxlength="700" required></textarea>
                    <div class="composer-toolbar">
                      <div class="composer-tools">
                        <button type="button" data-action="composer-tool" data-value="prayer">${icon("hands")} Prayer</button>
                        <button type="button" data-action="composer-tool" data-value="event">${icon("calendar")} Event</button>
                        <button type="button" data-action="composer-tool" data-value="photo">${icon("camera")} Photo</button>
                      </div>
                      <div style="display:flex;gap:8px">
                        <button class="btn btn-ghost btn-small" type="button" data-action="close-composer">Cancel</button>
                        <button class="btn btn-primary btn-small" type="submit">Share</button>
                      </div>
                    </div>
                  </form>`
                : ""
            }
          </div>
          ${state.posts.map(renderPost).join("")}
        </section>
        <aside class="community-rail">
          <section class="rail-card">
            <div class="rail-card-header"><h3>Your circles</h3><button class="text-action" type="button" data-action="show-all-groups">See all</button></div>
            ${groups
              .map((group) => {
                const joined = state.joinedGroups.has(group.id);
                return `<div class="group-card-mini">
                  <span class="group-emblem">${icon(group.icon)}</span>
                  <div><strong>${group.name}</strong><small>${group.meta}</small></div>
                  <button class="btn ${joined ? "btn-soft" : "btn-ghost"} btn-small" type="button" data-action="toggle-group" data-id="${group.id}">${joined ? "Joined" : "Join"}</button>
                </div>`;
              })
              .join("")}
          </section>
          <section class="rail-card">
            <div class="rail-card-header"><h3>Topics growing now</h3></div>
            <div class="topic-list">
              ${["#prayer", "#faithandwork", "#parenting", "#scripture", "#serve-local", "#griefsupport", "#youngadults"]
                .map((topic) => `<button type="button" data-action="topic" data-value="${topic}">${topic}</button>`)
                .join("")}
            </div>
          </section>
          <section class="rail-card rail-card-dark">
            <span class="pill pill-dark">Community promise</span>
            <h3 style="font-family:var(--font-display);font-size:1.55rem;margin:15px 0 8px">Dignity before virality.</h3>
            <p style="color:rgba(255,255,255,.55);font-size:.76rem">Trumpet Nation does not reward outrage. Recommendations prioritize trust, relevance, and constructive participation.</p>
            <a class="btn btn-gold btn-small" href="#safety" data-route="safety">Read the covenant</a>
          </section>
        </aside>
      </div>`;
  };

  const focusTimeText = () => {
    const minutes = Math.floor(state.focusRemaining / 60).toString().padStart(2, "0");
    const seconds = (state.focusRemaining % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const renderPrayerCard = (prayer) => {
    const prayed = state.prayedRequests.has(prayer.id);
    const className = prayer.status === "private" ? "private" : prayer.status === "answered" ? "answered" : "";
    return `
      <article class="prayer-card ${className}">
        <div class="prayer-card-head">
          ${avatarMarkup(prayer)}
          <div><strong>${escapeHtml(prayer.author)}</strong><small>${escapeHtml(prayer.time)} · ${escapeHtml(prayer.scope)}</small></div>
          <span class="pill ${prayer.status === "answered" ? "" : prayer.status === "private" ? "pill-gold" : ""}">${
            prayer.status === "answered" ? `${icon("check")} Answered` : prayer.status === "private" ? `${icon("lock")} Circle` : `${icon("globe")} Community`
          }</span>
        </div>
        <p>${escapeHtml(prayer.text)}</p>
        <div class="prayer-card-foot">
          <div class="pray-count">
            <div class="stack-avatars"><span class="avatar avatar-teal">AM</span><span class="avatar avatar-gold">JL</span><span class="avatar avatar-sage">+${Math.max(0, prayer.count - 2)}</span></div>
            <span>${prayer.count + (prayed ? 1 : 0)} people prayed</span>
          </div>
          <button class="btn ${prayed ? "btn-soft" : "btn-primary"} btn-small" type="button" data-action="pray-request" data-id="${prayer.id}">${icon("hands")} ${prayed ? "Prayed" : "Pray now"}</button>
        </div>
      </article>`;
  };

  const renderPrayer = () => {
    const filtered = state.prayerFilter === "All"
      ? state.prayers
      : state.prayers.filter((prayer) => {
          if (state.prayerFilter === "Answered") return prayer.status === "answered";
          if (state.prayerFilter === "My circles") return prayer.status === "private" || prayer.scope === "Group";
          return prayer.status !== "private";
        });
    const progress = ((state.focusTotal - state.focusRemaining) / state.focusTotal) * 100;
    return `
      ${renderJourneyContext("prayer")}
      <section class="prayer-hero" aria-labelledby="prayer-title">
        <div class="prayer-hero-copy">
          <p class="kicker" style="color:var(--gilt)">Prayer, held with care</p>
          <h1 id="prayer-title">You do not have to carry it alone.</h1>
          <p>Share only what feels safe, pray with others, or step into a quiet two-minute rhythm without posting anything.</p>
          <div class="prayer-hero-actions">
            <button class="btn btn-gold" type="button" data-action="open-prayer-modal">${icon("plus")} Share a request</button>
            <button class="btn btn-ghost" style="color:white;border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.06)" type="button" data-action="scroll-prayer-wall">Browse prayer wall</button>
          </div>
        </div>
        <div class="prayer-focus-card">
          <span class="pill pill-dark">Quiet prayer</span>
          <div class="focus-time" id="focus-time">${focusTimeText()}</div>
          <p>Two minutes of stillness. No camera, microphone, or public status.</p>
          <div class="focus-progress"><span id="focus-progress" style="--focus-progress:${progress}%"></span></div>
          <div class="prayer-controls">
            <button class="btn btn-small" type="button" data-action="toggle-focus">${icon(state.focusRunning ? "pause" : "play")} ${state.focusRunning ? "Pause" : "Begin"}</button>
            <button class="btn btn-small" type="button" data-action="reset-focus">Reset</button>
          </div>
        </div>
      </section>

      <div class="prayer-layout" id="prayer-wall">
        <section>
          <div class="filter-bar">
            <div>
              <p class="kicker">Prayer wall</p>
              <h2 class="section-title">Pray with the community</h2>
            </div>
            <div class="segmented" aria-label="Prayer filter">
              ${["All", "Community", "My circles", "Answered"]
                .map((filter) => `<button class="${state.prayerFilter === filter ? "active" : ""}" type="button" data-action="prayer-filter" data-value="${filter}">${filter}</button>`)
                .join("")}
            </div>
          </div>
          <div class="prayer-wall">
            ${filtered.length ? filtered.map(renderPrayerCard).join("") : `<div class="empty-state"><div><span class="choice-icon">${icon("hands")}</span><h3>No requests in this view</h3><p class="muted">Choose another filter or share a prayer request.</p></div></div>`}
          </div>
        </section>
        <aside class="prayer-rail">
          <section class="rail-card">
            <div class="rail-card-header"><h3>Share with control</h3></div>
            <div class="privacy-option"><span class="privacy-icon">${icon("lock")}</span><div><strong>Private journal</strong><small>Visible only to you. Trumpet can help put the prayer into words.</small></div></div>
            <div class="privacy-option"><span class="privacy-icon">${icon("users")}</span><div><strong>Trusted circle</strong><small>Share with one group, family, or selected people.</small></div></div>
            <div class="privacy-option"><span class="privacy-icon">${icon("globe")}</span><div><strong>Community wall</strong><small>Visible to the broader Trumpet Nation community with reporting controls.</small></div></div>
          </section>
          <section class="rail-card">
            <div class="rail-card-header"><h3>Prayer watch</h3><span class="pill">Live</span></div>
            <div class="activity-list">
              <div class="activity-item"><span class="avatar avatar-teal">23</span><div class="activity-item-copy"><strong>People praying now</strong><p>Across 8 countries and 14 circles</p></div></div>
              <div class="activity-item"><span class="avatar avatar-gold">1.2k</span><div class="activity-item-copy"><strong>Prayers offered today</strong><p>Private counts, never public rankings</p></div></div>
              <div class="activity-item"><span class="avatar avatar-sage">86</span><div class="activity-item-copy"><strong>Gratitude updates</strong><p>Shared answers and signs of hope</p></div></div>
            </div>
          </section>
          <section class="rail-card rail-card-dark">
            <span class="pill pill-dark">Need more support?</span>
            <h3 style="font-family:var(--font-display);font-size:1.5rem;margin:14px 0 7px">Prayer can sit beside professional care.</h3>
            <p style="color:rgba(255,255,255,.55);font-size:.75rem">For urgent safety, medical, or mental-health concerns, contact local emergency or qualified support services.</p>
            <button class="btn btn-gold btn-small" type="button" data-action="support-resources">Find support resources</button>
          </section>
        </aside>
      </div>`;
  };

  const renderOpportunity = (item) => {
    const committed = state.committedOpportunities.has(item.id);
    return `
      <article class="opportunity-card">
        <div class="opportunity-art" style="--art:${item.art}">${icon(item.icon)}</div>
        <div class="opportunity-copy">
          <span class="pill">${escapeHtml(item.tag)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="meta-row">
            <span>${icon("pin")} ${escapeHtml(item.distance)}</span>
            <span>${icon("calendar")} ${escapeHtml(item.time)}</span>
            <span>${icon("clock")} ${escapeHtml(item.commitment)}</span>
          </div>
          <button class="btn ${committed ? "btn-soft" : "btn-primary"}" type="button" data-action="toggle-opportunity" data-id="${item.id}">${icon(committed ? "check" : "heart")} ${committed ? "Saved to my plan" : "I’m interested"}</button>
        </div>
      </article>`;
  };

  const SERVE_FOCUS_LABELS = {
    families: "families and housing",
    youth: "youth and mentoring",
    food: "food access",
    care: "care and companionship",
  };

  const renderServe = () => {
    // Arriving from an answer narrows the list to what the question was about,
    // rather than restating the whole catalogue and making the person hunt.
    const focus = state.serveFocus;
    const focused = focus ? OPPORTUNITIES.filter((item) => item.focus === focus) : [];
    const rest = focus ? OPPORTUNITIES.filter((item) => item.focus !== focus) : OPPORTUNITIES;
    return `
    ${renderJourneyContext("serve")}
    ${pageHeader({
      kicker: "Faith in action",
      title: "Find the need you can keep showing up for.",
      description: "Discover trusted local and remote opportunities by cause, time, distance, and the kind of commitment you can sustain.",
      actions: `<button class="btn btn-ghost" type="button" data-action="serve-filter">${icon("filter")} Filter opportunities</button><button class="btn btn-primary" type="button" data-action="partner-with-trumpet">Partner with Trumpet Nation</button>`,
    })}

    ${
      focused.length
        ? `<section class="serve-focus" style="margin-bottom:26px">
            ${sectionHeader(
              `Closest to what you asked`,
              `Showing ${escapeHtml(SERVE_FOCUS_LABELS[focus] || focus)} first.`,
              `<button class="text-action" type="button" data-action="clear-serve-focus">Show everything ${icon("arrow")}</button>`,
            )}
            <div class="opportunity-grid">${focused.map(renderOpportunity).join("")}</div>
          </section>`
        : ""
    }

    <section class="serve-map" aria-label="Nearby service opportunities map">
      <span class="map-pin pin-1">${icon("heart")}</span>
      <span class="map-pin pin-2">${icon("book")}</span>
      <span class="map-pin pin-3">${icon("users")}</span>
      <span class="map-pin pin-4">${icon("hands")}</span>
      <div class="map-overlay">
        <div><strong>18 opportunities near ${escapeHtml(state.profile.firstName)}</strong><small>Within 10 miles of ${escapeHtml(state.profile.location)}</small></div>
        <button class="btn btn-primary btn-small" type="button" data-action="serve-filter">Refine the map ${icon("arrow")}</button>
      </div>
    </section>

    <section style="margin-top:32px">
      ${sectionHeader(focused.length ? "More near you" : "Recommended for you", "Based on your availability, interests, and location.", `<button class="text-action" type="button" data-action="show-all-opportunities">View all ${icon("arrow")}</button>`)}
      <div class="opportunity-grid">${rest.slice(0, 3).map(renderOpportunity).join("")}</div>
    </section>

    ${
      rest.length > 3
        ? `<section style="margin-top:38px">
            ${sectionHeader("Flexible and remote", "Serve from home or choose a schedule that changes week to week.")}
            <div class="opportunity-grid">${rest.slice(3).map(renderOpportunity).join("")}</div>
          </section>`
        : ""
    }

    <section style="margin-top:38px">
      ${sectionHeader("Trusted local partners", "Organizations are reviewed for identity, program clarity, safeguarding, and community accountability.")}
      <div class="partner-strip">
        <div class="partner-logo">Hope City<br />Shelter</div>
        <div class="partner-logo">Open Door<br />Youth</div>
        <div class="partner-logo">Neighbor<br />Nations</div>
        <div class="partner-logo">CareLine<br />Network</div>
      </div>
    </section>`;
  };

  const renderCause = (cause) => {
    const progress = Math.min(100, Math.round((cause.raised / cause.goal) * 100));
    return `
      <article class="cause-card">
        <div class="cause-art" style="--cause-bg:${cause.bg}"><span class="cause-mark">${icon(cause.icon)}</span></div>
        <div class="cause-copy">
          <div class="cause-org">${icon("check")} Verified · ${escapeHtml(cause.org)}</div>
          <h3>${escapeHtml(cause.title)}</h3>
          <p>${escapeHtml(cause.description)}</p>
          <div class="progress-line" style="--progress:${progress}%"><span></span></div>
          <div class="progress-labels"><span>${formatCurrency(cause.raised)} raised</span><span>${progress}%</span></div>
          <button class="btn btn-primary" type="button" data-action="open-donation" data-id="${cause.id}">${icon("gift")} Give to this cause</button>
        </div>
      </article>`;
  };

  const renderGive = () => `
    ${renderJourneyContext("give")}
    <section class="give-hero" aria-labelledby="give-title">
      <div class="give-hero-copy">
        <p class="kicker" style="color:var(--gilt)">Generosity with clarity</p>
        <h1 id="give-title">Know where your gift goes.</h1>
        <p>Support verified ministries and community causes with plain-language budgets, visible progress, and impact updates that respect the people being served.</p>
        <div class="prayer-hero-actions">
          <button class="btn btn-gold" type="button" data-action="open-donation" data-id="cause-water">Explore giving ${icon("arrow")}</button>
          <button class="btn btn-ghost" style="color:white;border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.06)" type="button" data-action="giving-standards">How verification works</button>
        </div>
      </div>
      <div class="give-impact">
        <div class="give-impact-stat"><strong>${formatCurrency(state.profile.donationTotal)}</strong><span>Your giving through Trumpet Nation</span></div>
        <div class="give-impact-stat"><strong>3</strong><span>Causes supported</span></div>
        <div class="give-impact-stat"><strong>92¢</strong><span>Average reaching programs per $1</span></div>
      </div>
    </section>

    <section style="margin-top:34px">
      ${sectionHeader("Causes making measurable progress", "Each partner publishes goals, use of funds, and regular updates.", `<button class="text-action" type="button" data-action="browse-causes">Browse all causes ${icon("arrow")}</button>`)}
      <div class="cause-grid">${CAUSES.map(renderCause).join("")}</div>
    </section>

    <section style="margin-top:38px">
      ${sectionHeader("Trust is part of the gift", "Trumpet Nation’s giving layer is designed to make generosity safer and more understandable.")}
      <div class="trust-row">
        <div class="trust-item"><span class="choice-icon">${icon("shield")}</span><div><strong>Verified identity</strong><small>Legal organization, leadership, and payment destination checks.</small></div></div>
        <div class="trust-item"><span class="choice-icon">${icon("eye")}</span><div><strong>Plain-language transparency</strong><small>Program budgets, fees, progress, and reporting shown before giving.</small></div></div>
        <div class="trust-item"><span class="choice-icon">${icon("users")}</span><div><strong>Dignity-centered stories</strong><small>Impact updates avoid exploiting people or turning hardship into content.</small></div></div>
      </div>
    </section>`;

  const renderDiscoveryCard = (item) => {
    const saved = state.savedDiscoveries.has(item.id);
    return `
      <article class="discovery-card">
        <div class="discovery-art" style="--discovery-bg:${item.bg}">
          <button class="discovery-save ${saved ? "saved" : ""}" type="button" data-action="save-discovery" data-id="${item.id}" aria-label="${saved ? "Remove from saved" : "Save"} ${escapeHtml(item.title)}">${icon("bookmark")}</button>
          <span class="discovery-art-symbol">${icon(item.icon)}</span>
        </div>
        <div class="discovery-copy">
          <span class="discovery-type">${escapeHtml(item.type)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="discovery-foot"><span>${escapeHtml(item.meta)}</span><button class="text-action" type="button" data-action="open-discovery" data-id="${item.id}"><strong>${escapeHtml(item.price)}</strong> ${icon("chev")}</button></div>
        </div>
      </article>`;
  };

  const renderDiscover = () => {
    const query = state.discoverQuery.trim().toLowerCase();
    const filtered = DISCOVERY_ITEMS.filter((item) => {
      const categoryMatch = state.discoverCategory === "All" || item.category === state.discoverCategory;
      const queryMatch = !query || `${item.title} ${item.description} ${item.category} ${item.type}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
    const categories = ["All", ...new Set(DISCOVERY_ITEMS.map((item) => item.category))];
    return `
      <section class="discover-hero" aria-labelledby="discover-title">
        <p class="kicker">Explore what helps you grow</p>
        <h1 id="discover-title">Find people, practices, and places worth your attention.</h1>
        <p>Discover trusted groups, churches, events, studies, music, and goods from creators and organizations serving the Christian community.</p>
        <form class="discover-search" id="discover-search-form">
          ${icon("search")}
          <label class="visually-hidden" for="discover-search-input">Search Discover</label>
          <input id="discover-search-input" type="search" name="query" value="${escapeHtml(state.discoverQuery)}" placeholder="Search groups, events, studies, churches, creators…" autocomplete="off" enterkeyhint="search" />
          <button class="btn btn-primary btn-small" type="submit">Search</button>
        </form>
      </section>
      <div class="category-row" aria-label="Discovery categories">
        ${categories
          .map((category) => `<button class="category-button ${state.discoverCategory === category ? "active" : ""}" type="button" data-action="discover-category" data-value="${category}">${category === "All" ? icon("compass") : ""}${category}</button>`)
          .join("")}
      </div>
      ${
        filtered.length
          ? `<div class="discovery-grid">${filtered.map(renderDiscoveryCard).join("")}</div>`
          : `<div class="empty-state"><div><span class="choice-icon">${icon("search")}</span><h3>No matching discoveries</h3><p class="muted">Try another category or a broader search.</p><button class="btn btn-soft" type="button" data-action="clear-discovery">Clear filters</button></div></div>`
      }
      <section style="margin-top:38px">
        ${sectionHeader("Built for trusted discovery", "Partners and creators are labeled clearly, commerce is separated from spiritual guidance, and paid placement never changes AI answers.")}
        <div class="trust-row">
          <div class="trust-item"><span class="choice-icon">${icon("check")}</span><div><strong>Verified sources</strong><small>Identity and partner status are visible before you join, buy, visit, or give.</small></div></div>
          <div class="trust-item"><span class="choice-icon">${icon("eye")}</span><div><strong>Clear recommendations</strong><small>Trumpet Nation explains why an item appears and lets you tune your interests.</small></div></div>
          <div class="trust-item"><span class="choice-icon">${icon("shield")}</span><div><strong>No pay-to-answer</strong><small>Commercial relationships do not determine faith guidance or AI responses.</small></div></div>
        </div>
      </section>`;
  };

  const settingsNav = () => {
    const items = [
      { id: "profile", label: "Profile", icon: "users" },
      { id: "lens", label: "Faith lens", icon: "spark" },
      { id: "privacy", label: "Privacy", icon: "lock" },
      { id: "notifications", label: "Notifications", icon: "bell" },
      { id: "data", label: "Data & account", icon: "shield" },
    ];
    return `<nav class="settings-nav" aria-label="Settings sections">${items
      .map((item) => `<button class="${state.settingsSection === item.id ? "active" : ""}" type="button" data-action="settings-section" data-value="${item.id}">${icon(item.icon)} ${item.label}</button>`)
      .join("")}</nav>`;
  };

  const toggleSetting = (key, title, note) => `
    <div class="setting-row">
      <div class="setting-copy"><strong>${title}</strong><small>${note}</small></div>
      <button class="toggle ${state.profile[key] ? "on" : ""}" type="button" data-action="toggle-setting" data-key="${key}" aria-pressed="${Boolean(state.profile[key])}"><span class="visually-hidden">Toggle ${title}</span></button>
    </div>`;

  const renderSettingsContent = () => {
    if (state.settingsSection === "lens") {
      return `<section class="settings-card">
        <p class="kicker">Personalization</p>
        <h2 class="section-title">Your faith lens</h2>
        <p class="muted">Trumpet Nation adapts vocabulary, sources, practices, and tone while naming where Christians differ.</p>
        <form id="lens-form" class="modal-form" style="margin-top:24px">
          <label class="field-label">Faith tradition or starting point
            <select class="select" name="tradition">${TRADITIONS.map((item) => `<option value="${escapeHtml(item.value)}" ${state.profile.tradition === item.value ? "selected" : ""}>${escapeHtml(item.value)} — ${escapeHtml(item.note)}</option>`).join("")}</select>
          </label>
          <label class="field-label">Response style
            <select class="select" name="tone">${TONES.map((item) => `<option value="${escapeHtml(item.value)}" ${state.profile.tone === item.value ? "selected" : ""}>${escapeHtml(item.value)} — ${escapeHtml(item.note)}</option>`).join("")}</select>
          </label>
          <label class="field-label">Preferred language
            <select class="select" name="language">${LANGUAGES.map((language) => `<option value="${language}" ${state.profile.language === language ? "selected" : ""}>${language}</option>`).join("")}</select>
          </label>
          <label class="field-label">Preferred Bible translation
            <select class="select" name="translation">${TRANSLATIONS.map((item) => `<option value="${escapeHtml(item.value)}" ${preferredTranslation() === item.value ? "selected" : ""}>${escapeHtml(item.label)} — ${escapeHtml(item.note)}</option>`).join("")}</select>
            <span class="subtle" style="font-size:.68rem">Only public-domain translations carry text in this prototype. Licensed translations fall back to the World English Bible until a publisher agreement is in place.</span>
          </label>
          <div>
            <p class="field-label" style="margin-bottom:9px">Priorities shaping Today</p>
            <div class="choice-grid">
              ${GOALS.map((goal) => onboardingChoice({ value: goal.value, label: goal.label, note: goal.note, iconName: goal.icon, selected: state.profile.goals.includes(goal.value), action: "toggle-profile-goal", multi: true })).join("")}
            </div>
          </div>
          <div class="modal-actions"><button class="btn btn-primary" type="submit">Save faith lens</button></div>
        </form>
        <div class="onboarding-note">${icon("eye")}<span>When traditions interpret a topic differently, Trumpet should say so rather than quietly presenting one view as universal.</span></div>
      </section>`;
    }

    if (state.settingsSection === "privacy") {
      return `<section class="settings-card">
        <p class="kicker">Privacy</p>
        <h2 class="section-title">You choose what becomes social.</h2>
        <p class="muted">AI conversations, prayer entries, location, and faith-lens settings each have separate controls.</p>
        <div class="settings-section">
          <h3>Sharing defaults</h3>
          <p>Start private and make sharing an intentional action.</p>
          <div class="settings-grid">
            ${toggleSetting("privateByDefault", "Private prayer by default", "New requests begin as private journal entries.")}
            ${toggleSetting("localDiscovery", "Use location for local discovery", "Show nearby groups, service, churches, and events.")}
          </div>
        </div>
        <div class="settings-section">
          <h3>AI conversation controls</h3>
          <p>Prototype conversations are stored only in this browser.</p>
          <div class="setting-row">
            <div class="setting-copy"><strong>Delete conversation history</strong><small>Remove all saved Ask Trumpet messages from this device.</small></div>
            <button class="btn btn-danger-soft btn-small" type="button" data-action="delete-chat-history">Delete</button>
          </div>
        </div>
      </section>`;
    }

    if (state.settingsSection === "notifications") {
      return `<section class="settings-card">
        <p class="kicker">Attention</p>
        <h2 class="section-title">Notifications with a purpose.</h2>
        <p class="muted">Trumpet Nation avoids engagement traps. Choose only the updates that help you participate or follow through.</p>
        <div class="settings-section">
          <div class="settings-grid">
            ${toggleSetting("weeklyDigest", "Weekly digest", "A quiet summary of circles, prayer, service, and saved items.")}
            ${toggleSetting("prayerAlerts", "Prayer updates", "Responses and gratitude updates on requests you follow.")}
            ${toggleSetting("communityReplies", "Community replies", "Replies to your posts and direct invitations.")}
            ${toggleSetting("ministryUpdates", "Partner updates", "Occasional updates from ministries and causes you follow.")}
          </div>
        </div>
      </section>`;
    }

    if (state.settingsSection === "data") {
      return `<section class="settings-card">
        <p class="kicker">Data & account</p>
        <h2 class="section-title">Your information, portable and removable.</h2>
        <p class="muted">This prototype keeps all personal state in your browser. Production infrastructure should preserve the same user control.</p>
        <div class="settings-section">
          <h3>Export</h3>
          <p>Download a JSON copy of your profile, posts, prayer requests, and saved activity.</p>
          <button class="btn btn-soft" type="button" data-action="export-data">${icon("bookmark")} Export my data</button>
        </div>
        <div class="settings-section">
          <h3>Reset prototype</h3>
          <p>Delete all Trumpet Nation prototype data from this browser and return to onboarding.</p>
          <button class="btn btn-danger-soft" type="button" data-action="reset-prototype">Reset all prototype data</button>
        </div>
      </section>`;
    }

    return `<section class="settings-card">
      <div class="profile-hero">
        ${avatarMarkup(state.profile, "avatar-xl")}
        <div class="profile-hero-copy"><h2>${escapeHtml(state.profile.firstName)} ${escapeHtml(state.profile.lastName)}</h2><p>${escapeHtml(state.profile.location)} · ${escapeHtml(state.profile.tradition)} lens</p></div>
        <button class="btn btn-soft btn-small" type="button" data-action="avatar-demo">Change photo</button>
      </div>
      <form id="profile-form" class="modal-form">
        <div class="name-row">
          <label class="field-label">First name<input class="field" name="firstName" value="${escapeHtml(state.profile.firstName)}" autocomplete="given-name" required /></label>
          <label class="field-label">Last name<input class="field" name="lastName" value="${escapeHtml(state.profile.lastName)}" autocomplete="family-name" required /></label>
        </div>
        <label class="field-label">Email<input class="field" type="email" name="email" value="${escapeHtml(state.profile.email)}" autocomplete="email" required /></label>
        <label class="field-label">Home area<input class="field" name="location" value="${escapeHtml(state.profile.location)}" autocomplete="address-level2" /></label>
        <div class="modal-actions"><button class="btn btn-primary" type="submit">Save profile</button></div>
      </form>
      <div class="settings-section">
        <h3>Your impact</h3>
        <p>Visible only to you. Trumpet Nation uses private progress to support follow-through, not public status.</p>
        <div class="pulse-row">
          <article class="pulse-card"><div class="pulse-card-top"><span>Giving</span>${icon("gift")}</div><div><div class="pulse-number">${formatCurrency(state.profile.donationTotal)}</div><small>Across verified causes</small></div></article>
          <article class="pulse-card"><div class="pulse-card-top"><span>Service</span>${icon("heart")}</div><div><div class="pulse-number">${state.profile.serviceHours} hrs</div><small>Logged this quarter</small></div></article>
          <article class="pulse-card"><div class="pulse-card-top"><span>Prayer rhythm</span>${icon("hands")}</div><div><div class="pulse-number">5 days</div><small>Current weekly rhythm</small></div></article>
        </div>
      </div>
    </section>`;
  };

  const renderProfile = () => `
    ${pageHeader({
      kicker: "Your Trumpet Nation",
      title: "Personalization without losing control.",
      description: "Manage your profile, faith lens, privacy, notifications, and portable data in one place.",
    })}
    <div class="settings-layout">
      ${settingsNav()}
      ${renderSettingsContent()}
    </div>`;

  const renderSafety = () => {
    const principles = [
      ["Christ-centered, honest about differences", "Trumpet Nation serves the broad Christian community while clearly naming where traditions interpret doctrine or practice differently."],
      ["Dignity before virality", "The product should not reward outrage, humiliation, fear, or addictive engagement patterns. People are never content inventory."],
      ["AI with humility", "Trumpet Nation distinguishes information, interpretation, and pastoral wisdom; cites sources where possible; and names uncertainty rather than fabricating authority."],
      ["Human care remains essential", "AI does not replace pastors, physicians, therapists, attorneys, emergency services, or the embodied life of a local community."],
      ["Private by design", "Prayer, faith-lens, conversation, location, and giving data receive separate controls with clear sharing boundaries."],
      ["Trustworthy action", "Ministries, causes, creators, and commerce are labeled and reviewed. Paid relationships never determine spiritual guidance or AI answers."],
    ];
    return `
      ${pageHeader({
        kicker: "The Trumpet Nation covenant",
        title: "Trust must be designed, not declared.",
        description: "These commitments govern the AI, community, giving, commerce, partnerships, and growth systems inside Trumpet Nation.",
        actions: `<button class="btn btn-primary" type="button" data-action="report-concern">${icon("shield")} Report a concern</button>`,
      })}
      <div class="safety-constitution">
        <section class="constitution-copy">
          <p class="kicker">Founding principle</p>
          <h2>Technology should help people practice what they believe—not manipulate belief for attention.</h2>
          <p>Trumpet Nation is designed as a faith-aligned daily operating system: a place to think, pray, belong, serve, and give. Its success should be measured by durable human benefit, trusted relationships, and real-world participation—not by time spent scrolling.</p>
          <div class="principles-list">
            ${principles
              .map(
                ([title, body], index) => `<div class="principle-row"><div class="principle-row-number">${String(index + 1).padStart(2, "0")}</div><div><h3>${title}</h3><p>${body}</p></div></div>`,
              )
              .join("")}
          </div>
        </section>
        <aside class="safety-rail">
          <section class="safety-score"><span class="pill pill-dark">Prototype status</span><strong style="margin-top:16px">6 / 6</strong><p>Core covenant principles represented in the product experience.</p></section>
          <section class="rail-card">
            <div class="rail-card-header"><h3>Visible safeguards</h3></div>
            <div class="activity-list">
              <div class="activity-item"><span class="privacy-icon">${icon("shield")}</span><div class="activity-item-copy"><strong>AI uncertainty labels</strong><p>Important guidance includes limits and human escalation.</p></div></div>
              <div class="activity-item"><span class="privacy-icon">${icon("lock")}</span><div class="activity-item-copy"><strong>Granular sharing</strong><p>Private, circle, community, and public are distinct states.</p></div></div>
              <div class="activity-item"><span class="privacy-icon">${icon("eye")}</span><div class="activity-item-copy"><strong>Partner transparency</strong><p>Verification, paid placement, and fund use are labeled.</p></div></div>
            </div>
          </section>
          <section class="rail-card">
            <div class="rail-card-header"><h3>Governance before scale</h3></div>
            <p class="muted" style="font-size:.76rem">A production launch should add independent theological, safeguarding, privacy, security, and child-safety review before opening broad public access.</p>
            <button class="btn btn-soft btn-small" type="button" data-action="view-governance">View governance roadmap</button>
          </section>
        </aside>
      </div>`;
  };

  const modalShell = ({ title, subtitle = "", body, size = "", closeLabel = "Close dialog" }) => `
    <div class="modal-backdrop" data-action="close-modal" role="presentation">
      <section class="modal ${size}" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-modal-panel tabindex="-1">
        <div class="modal-head">
          <div><h2 id="modal-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div>
          <button class="icon-btn modal-close" type="button" data-action="close-modal" aria-label="${closeLabel}">${icon("close")}</button>
        </div>
        ${body}
      </section>
    </div>`;

  const renderCommandModal = () => {
    const query = state.commandQuery.trim().toLowerCase();
    const matches = COMMAND_ITEMS.filter((item) => `${item.label} ${item.note}`.toLowerCase().includes(query));
    return `
      <div class="modal-backdrop" data-action="close-modal" role="presentation">
        <section class="modal command-palette" role="dialog" aria-modal="true" aria-label="Search Trumpet Nation" data-modal-panel tabindex="-1">
          <div class="command-search">${icon("search")}<input id="command-search" name="query" aria-label="Search Trumpet Nation" data-action="command-search" value="${escapeHtml(state.commandQuery)}" placeholder="Go to a feature or find an action…" autocomplete="off" /><button class="icon-btn" type="button" data-action="close-modal" aria-label="Close search">${icon("close")}</button></div>
          <div class="command-results" id="command-results">
            ${matches.length ? matches.map((item) => `<button class="command-result" type="button" data-action="command-select" data-route="${item.route}" data-command-action="${item.action || ""}"><span class="choice-icon">${icon(item.icon)}</span><div><strong>${item.label}</strong><small>${item.note}</small></div>${icon("chev")}</button>`).join("") : `<div class="empty-state" style="min-height:180px"><div><p class="muted">No matching feature or action.</p></div></div>`}
          </div>
        </section>
      </div>`;
  };

  const renderPrayerModal = () => {
    // Preserved when someone returns from the care dialog to edit.
    const draft = state.pendingShare?.kind === "prayer" ? state.pendingShare : null;
    const scopeSelected = (value) =>
      draft ? draft.scope === value : value === "Private journal" && state.profile.privateByDefault;
    return modalShell({
      title: "Share a prayer request",
      subtitle: "Start private. You control who can see it.",
      body: `<form class="modal-form" id="prayer-form">
        <label class="field-label">Prayer request
          <textarea class="textarea" name="text" placeholder="What would you like prayer for? Share only what feels safe." maxlength="700" required>${escapeHtml(draft?.text || "")}</textarea>
        </label>
        <label class="field-label">Who can see this?
          <select class="select" name="scope">
            <option value="Private journal" ${scopeSelected("Private journal") ? "selected" : ""}>Private journal — only me</option>
            <option value="Trusted circle" ${scopeSelected("Trusted circle") ? "selected" : ""}>Trusted circle — selected people</option>
            <option value="Community" ${scopeSelected("Community") ? "selected" : ""}>Community prayer wall</option>
          </select>
        </label>
        <label class="setting-row" style="cursor:pointer">
          <span class="setting-copy"><strong>Post anonymously</strong><small>Your name and profile photo will not be shown.</small></span>
          <input type="checkbox" name="anonymous" class="visually-hidden" />
          <span class="toggle" data-checkbox-toggle><span class="visually-hidden">Anonymous setting</span></span>
        </label>
        <div class="onboarding-note">${icon("shield")}<span>Requests involving immediate danger, abuse, self-harm, or medical emergencies should also be shared with qualified local support.</span></div>
        <div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Share request</button></div>
      </form>`,
    });
  };

  const renderCareModal = () => {
    const pending = state.pendingShare;
    const route = pending && CRISIS_ROUTES.find((item) => item.id === pending.crisisId);
    if (!route) return "";
    const isPublic = pending.kind === "post" || pending.scope === "Community";
    return modalShell({
      title: "Before you share this",
      subtitle: "You can still post it. We just don't want this to be the only place it goes.",
      body: `
        <p class="crisis-lead">${route.lead}</p>
        ${crisisResourceList(route)}
        ${
          isPublic
            ? `<div class="onboarding-note">${icon(
                "lock",
              )}<span>You've chosen to share this publicly. Consider whether it names details — medical, legal, abuse, or child-safety — that you would not want attached to your name later. Posting anonymously or to a trusted circle is often the safer route.</span></div>`
            : `<div class="onboarding-note">${icon(
                "lock",
              )}<span>This stays private to you. A private entry is a good place to be honest, but it can't check on you the way a person can.</span></div>`
        }
        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" data-action="close-modal">Go back and edit</button>
          <button class="btn btn-primary" type="button" data-action="confirm-share">Share it anyway</button>
        </div>`,
      closeLabel: "Close support dialog",
    });
  };

  const renderDonationModal = () => {
    const cause = CAUSES.find((item) => item.id === state.donationCauseId) || CAUSES[0];
    return modalShell({
      title: "Give with clarity",
      subtitle: `${cause.org} · ${cause.title}`,
      body: `<form class="modal-form" id="donation-form">
        <div class="give-summary"><div class="give-summary-row"><span>Verified partner</span><strong>${escapeHtml(cause.org)}</strong></div><div class="give-summary-row"><span>Cause</span><strong>${escapeHtml(cause.title)}</strong></div></div>
        <div>
          <p class="field-label" style="margin-bottom:8px">Gift amount</p>
          <div class="amount-grid">
            ${[10, 25, 50, 100].map((amount) => `<button class="amount-button ${state.donationAmount === amount ? "selected" : ""}" type="button" data-action="select-amount" data-value="${amount}">$${amount}</button>`).join("")}
          </div>
        </div>
        <label class="field-label">Custom amount
          <input class="field" type="number" name="customAmount" min="1" step="1" inputmode="decimal" autocomplete="off" placeholder="Enter another amount" />
        </label>
        <div class="setting-row">
          <div class="setting-copy"><strong>Make this monthly</strong><small>You would be able to cancel any time in a production account.</small></div>
          <button class="toggle ${state.donationRecurring ? "on" : ""}" type="button" data-action="toggle-recurring" aria-pressed="${state.donationRecurring}"><span class="visually-hidden">Toggle monthly gift</span></button>
        </div>
        <div class="give-summary">
          <div class="give-summary-row"><span>Gift</span><strong>${formatCurrency(state.donationAmount)}${state.donationRecurring ? " / month" : ""}</strong></div>
          <div class="give-summary-row"><span>Prototype processing fee</span><strong>$0</strong></div>
          <div class="give-summary-row total"><span>Total today</span><strong>${formatCurrency(state.donationAmount)}</strong></div>
        </div>
        <div class="onboarding-note">${icon("lock")}<span>Prototype only: no payment information is requested and no money will be collected.</span></div>
        <div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-gold" type="submit">Confirm demo gift</button></div>
      </form>`,
    });
  };

  const renderNotificationsModal = () =>
    modalShell({
      title: "What needs your attention",
      subtitle: "Trumpet Nation groups updates by purpose, not urgency theater.",
      body: `<div class="activity-list">
        <div class="activity-item"><span class="privacy-icon">${icon("message")}</span><div class="activity-item-copy"><strong>Maya replied in Faith & work</strong><p>“That framing helped me slow down and ask a better question.” · 18 min</p></div></div>
        <div class="activity-item"><span class="privacy-icon">${icon("hands")}</span><div class="activity-item-copy"><strong>Prayer update from Elena</strong><p>She shared a gratitude update with everyone who prayed. · 1 hr</p></div></div>
        <div class="activity-item"><span class="privacy-icon">${icon("calendar")}</span><div class="activity-item-copy"><strong>Service reminder</strong><p>Family shelter dinner is Saturday at 4:30 PM. · Tomorrow</p></div></div>
      </div>
      <div class="modal-actions"><a class="btn btn-soft" href="#profile" data-route="profile" data-settings="notifications">Manage notifications</a><button class="btn btn-primary" type="button" data-action="close-modal">Mark reviewed</button></div>`,
    });

  const renderReflectionModal = () =>
    modalShell({
      title: "Love that becomes visible",
      subtitle: "A two-minute reflection on 1 John 3:18",
      size: "modal-lg",
      body: `<article style="font-family:var(--font-display);font-size:1.25rem;line-height:1.65"><p>John does not dismiss words; he refuses to let words stand alone. Christian love becomes credible when it takes form—attention, truth-telling, generosity, protection, presence, repair.</p><p>Ask yourself: <em>Who already knows I care, but may need that care to become practical this week?</em></p></article><div class="rule"></div><div class="trust-row"><div class="trust-item"><span class="choice-icon">${icon("eye")}</span><div><strong>Notice</strong><small>One person or need you have overlooked.</small></div></div><div class="trust-item"><span class="choice-icon">${icon("heart")}</span><div><strong>Choose</strong><small>One action that costs time, comfort, or attention.</small></div></div><div class="trust-item"><span class="choice-icon">${icon("hands")}</span><div><strong>Pray</strong><small>Ask for the courage to follow through quietly.</small></div></div></div><div class="modal-actions"><button class="btn btn-soft" type="button" data-action="save-reflection">${icon("bookmark")} Save reflection</button><a class="btn btn-primary" href="#serve" data-route="serve">Find a way to act</a></div>`,
    });

  const renderSupportModal = () =>
    modalShell({
      title: "Support beyond the app",
      subtitle: "Prayer and community can accompany—not replace—qualified care.",
      body: `<div class="activity-list">
        <div class="activity-item"><span class="privacy-icon">${icon("shield")}</span><div class="activity-item-copy"><strong>Immediate danger</strong><p>Contact your local emergency services or go to the nearest emergency department.</p></div></div>
        <div class="activity-item"><span class="privacy-icon">${icon("users")}</span><div class="activity-item-copy"><strong>Personal support</strong><p>Reach out to a trusted person, pastor, counselor, physician, or local crisis service who can respond in real time.</p></div></div>
        <div class="activity-item"><span class="privacy-icon">${icon("lock")}</span><div class="activity-item-copy"><strong>Protect privacy</strong><p>Avoid posting identifying medical, legal, abuse, or child-safety details to a public prayer wall.</p></div></div>
      </div><div class="onboarding-note">${icon("eye")}<span>This prototype does not determine your location or provide a verified crisis directory.</span></div><div class="modal-actions"><button class="btn btn-primary" type="button" data-action="close-modal">Close</button></div>`,
    });

  const renderReportModal = () =>
    modalShell({
      title: "Report a concern",
      subtitle: "Tell us what happened and what needs review.",
      body: `<form class="modal-form" id="report-form"><label class="field-label">Concern type<select class="select" name="type"><option>AI answer</option><option>Community content</option><option>Prayer safety</option><option>Giving or partner</option><option>Privacy or data</option><option>Other</option></select></label><label class="field-label">What happened?<textarea class="textarea" name="details" required placeholder="Describe the issue without including unnecessary private information."></textarea></label><div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Send report</button></div></form>`,
    });

  const renderInfoModal = ({ title, subtitle, content, primaryLabel = "Got it" }) =>
    modalShell({
      title,
      subtitle,
      body: `${content}<div class="modal-actions"><button class="btn btn-primary" type="button" data-action="close-modal">${primaryLabel}</button></div>`,
    });

  const renderModal = () => {
    if (!state.modal) return "";
    switch (state.modal.type) {
      case "command": return renderCommandModal();
      case "prayer": return renderPrayerModal();
      case "care": return renderCareModal();
      case "donation": return renderDonationModal();
      case "notifications": return renderNotificationsModal();
      case "reflection": return renderReflectionModal();
      case "support": return renderSupportModal();
      case "report": return renderReportModal();
      case "giving-standards":
        return renderInfoModal({
          title: "Giving verification",
          subtitle: "A clear standard before a cause can receive funds.",
          content: `<div class="activity-list"><div class="activity-item"><span class="privacy-icon">${icon("check")}</span><div class="activity-item-copy"><strong>Identity and governance</strong><p>Legal identity, leadership, payment destination, and basic safeguarding are reviewed.</p></div></div><div class="activity-item"><span class="privacy-icon">${icon("eye")}</span><div class="activity-item-copy"><strong>Program clarity</strong><p>The partner explains the intended use of funds, measurable goal, and reporting cadence.</p></div></div><div class="activity-item"><span class="privacy-icon">${icon("shield")}</span><div class="activity-item-copy"><strong>Ongoing monitoring</strong><p>Material complaints, changes, and missed reporting can pause fundraising and trigger review.</p></div></div></div>`,
        });
      case "serve-filter":
        return modalShell({
          title: "Find the right fit",
          subtitle: "Filter by the commitment you can genuinely keep.",
          body: `<form class="modal-form" id="serve-filter-form"><label class="field-label">Cause<select class="select" name="cause"><option>Any cause</option><option>Families and housing</option><option>Youth and education</option><option>Food access</option><option>Immigrant and refugee support</option><option>Care and companionship</option></select></label><div class="name-row"><label class="field-label">Distance<select class="select" name="distance"><option>Within 10 miles</option><option>Within 25 miles</option><option>Remote only</option></select></label><label class="field-label">Time needed<select class="select" name="time"><option>Any commitment</option><option>Under 1 hour</option><option>One-time event</option><option>Weekly</option><option>Monthly</option></select></label></div><label class="field-label">Good for<select class="select" name="audience"><option>Anyone</option><option>Families</option><option>Groups</option><option>Skilled volunteers</option><option>First-time volunteers</option></select></label><div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Show matches</button></div></form>`,
        });
      case "partner":
        return modalShell({
          title: "Partner with Trumpet Nation",
          subtitle: "For churches, ministries, nonprofits, and community organizations.",
          body: `<form class="modal-form" id="partner-form"><label class="field-label">Organization name<input class="field" name="organization" required /></label><label class="field-label">Organization type<select class="select" name="type"><option>Church</option><option>Ministry</option><option>Nonprofit</option><option>Community organization</option><option>Creator or small business</option></select></label><label class="field-label">Work email<input class="field" type="email" name="email" required /></label><label class="field-label">How would you like to participate?<textarea class="textarea" name="message" placeholder="Service opportunities, giving, community, marketplace, events, or another use case."></textarea></label><div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Submit interest</button></div></form>`,
        });
      case "governance":
        return renderInfoModal({
          title: "Governance roadmap",
          subtitle: "The controls required before broad public launch.",
          content: `<div class="activity-list"><div class="activity-item"><span class="privacy-icon">${icon("book")}</span><div class="activity-item-copy"><strong>Theological council</strong><p>Cross-tradition review, disagreement labeling, source standards, and escalation.</p></div></div><div class="activity-item"><span class="privacy-icon">${icon("shield")}</span><div class="activity-item-copy"><strong>Safety and safeguarding</strong><p>Child safety, abuse response, crisis pathways, moderation appeals, and partner standards.</p></div></div><div class="activity-item"><span class="privacy-icon">${icon("lock")}</span><div class="activity-item-copy"><strong>Privacy and security</strong><p>Data minimization, encryption, access controls, retention, audits, and incident response.</p></div></div><div class="activity-item"><span class="privacy-icon">${icon("eye")}</span><div class="activity-item-copy"><strong>Independent accountability</strong><p>Transparent metrics, external audits, public policy changes, and user redress.</p></div></div></div>`,
        });
      default:
        return "";
    }
  };

  const renderView = () => {
    switch (state.route) {
      case "ask": return renderAsk();
      case "community": return renderCommunity();
      case "prayer": return renderPrayer();
      case "serve": return renderServe();
      case "give": return renderGive();
      case "discover": return renderDiscover();
      case "profile": return renderProfile();
      case "safety": return renderSafety();
      case "home":
      default: return renderHome();
    }
  };

  const renderAppShell = () => `
    <div class="app-shell">
      ${renderSidebar()}
      <div class="app-body">
        ${renderTopbar()}
        <main id="main-content" class="main-content${state.route === "ask" ? " is-ask" : ""}" tabindex="-1">${renderView()}</main>
      </div>
      ${renderMobileNav()}
      ${renderModal()}
    </div>`;

  /* Every render replaces the whole tree, which drops focus to <body>. For a
   * keyboard or screen-reader user that means being thrown back to the top of
   * the page on every Pray, Encourage, or Save. We record enough to find the
   * same control in the new tree and put focus back on it. */

  const focusSignature = (element) => {
    if (!element || !element.dataset || element === document.body) return null;
    if (element.id) return `#${cssEscape(element.id)}`;
    const action = element.dataset.action;
    if (!action) return null;
    let selector = `[data-action="${action}"]`;
    if (element.dataset.id) selector += `[data-id="${element.dataset.id}"]`;
    if (element.dataset.value) selector += `[data-value="${element.dataset.value}"]`;
    return selector;
  };

  const cssEscape = (value) =>
    typeof CSS !== "undefined" && CSS.escape ? CSS.escape(value) : String(value).replace(/[^\w-]/g, "\\$&");

  const render = ({ focusCommand = false, scrollChat = false, focusMain = false } = {}) => {
    const app = document.getElementById("app");
    const previousFocus = focusSignature(document.activeElement);
    app.innerHTML = state.profile.onboarded ? renderAppShell() : renderOnboarding();
    document.body.style.overflow = state.modal ? "hidden" : "";
    document.title = state.profile.onboarded
      ? `${VIEW_TITLES[state.route] || "Trumpet Nation"} — Trumpet Nation`
      : "Welcome — Trumpet Nation";

    if (focusCommand || state.modal?.type === "command") {
      requestAnimationFrame(() => {
        const input = document.getElementById("command-search");
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      });
    } else if (state.modal) {
      requestAnimationFrame(() => {
        const panel = document.querySelector("[data-modal-panel]");
        const firstControl = panel?.querySelector?.("input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href]");
        (firstControl || panel)?.focus?.();
      });
    } else if (focusMain) {
      requestAnimationFrame(() => document.getElementById("main-content")?.focus?.());
    } else if (previousFocus) {
      // Synchronous: the new tree already exists, so there is nothing to wait
      // for, and deferring a frame would drop the restore whenever the tab is
      // backgrounded (rAF does not run while hidden).
      // preventScroll: the control is already where the reader left it.
      document.querySelector(previousFocus)?.focus?.({ preventScroll: true });
    }

    if (scrollChat) {
      requestAnimationFrame(scrollChatToBottom);
    }
  };

  const navigate = (route, options = {}) => {
    const normalized = VALID_ROUTES.has(route) ? route : "home";
    state.route = normalized;
    state.sidebarOpen = false;
    state.modal = null;
    if (options.settingsSection) state.settingsSection = options.settingsSection;
    if (location.hash !== `#${normalized}`) history.pushState(null, "", `#${normalized}`);
    render({ scrollChat: normalized === "ask", focusMain: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const showToast = (title, note = "") => {
    const layer = document.getElementById("toast-layer");
    layer.innerHTML = `<div class="toast" role="status"><span class="choice-icon">${icon("check")}</span><div><strong>${escapeHtml(title)}</strong>${note ? `<small>${escapeHtml(note)}</small>` : ""}</div></div>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      layer.innerHTML = "";
    }, 3600);
  };

  const scrollChatToBottom = () => {
    const scroller = document.getElementById("chat-scroll");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    }
  };

  const stripHtml = (html) => {
    const element = document.createElement("div");
    element.innerHTML = html;
    return element.textContent || element.innerText || "";
  };

  const sendChat = (prompt) => {
    const clean = String(prompt || "").trim();
    if (!clean || state.chatTyping) return;
    state.chatMessages.push({ id: uid("message"), role: "user", content: clean, createdAt: Date.now() });
    state.chatDraft = "";
    state.chatTyping = true;
    storage.set("chatMessages", state.chatMessages);
    state.route = "ask";
    if (location.hash !== "#ask") history.pushState(null, "", "#ask");
    render({ scrollChat: true });

    window.setTimeout(() => {
      state.chatMessages.push({ id: uid("answer"), role: "assistant", content: buildTrumpetResponse(clean), createdAt: Date.now() });
      state.chatTyping = false;
      storage.set("chatMessages", state.chatMessages);
      render({ scrollChat: true });
    }, 720);
  };

  const startFocusTimer = () => {
    if (state.focusRunning) return;
    if (state.focusRemaining <= 0) state.focusRemaining = state.focusTotal;
    state.focusRunning = true;
    render();
    focusInterval = window.setInterval(() => {
      state.focusRemaining -= 1;
      updateFocusTimerDom();
      if (state.focusRemaining <= 0) {
        state.focusRemaining = 0;
        stopFocusTimer(false);
        render();
        showToast("Quiet prayer complete", "Carry one word of peace into your next step.");
      }
    }, 1000);
  };

  const stopFocusTimer = (shouldRender = true) => {
    state.focusRunning = false;
    if (focusInterval) window.clearInterval(focusInterval);
    focusInterval = null;
    if (shouldRender) render();
  };

  const resetFocusTimer = () => {
    stopFocusTimer(false);
    state.focusRemaining = state.focusTotal;
    render();
  };

  const updateFocusTimerDom = () => {
    const time = document.getElementById("focus-time");
    const progress = document.getElementById("focus-progress");
    if (time) time.textContent = focusTimeText();
    if (progress) {
      const percentage = ((state.focusTotal - state.focusRemaining) / state.focusTotal) * 100;
      progress.style.setProperty("--focus-progress", `${percentage}%`);
    }
  };

  /* A share that trips crisis detection is held at the composer, shown real
   * resources, and then committed through these same two functions if the
   * person still chooses to post. Interception informs; it does not block. */

  const commitPost = (content) => {
    state.posts.unshift({
      id: uid("post"),
      author: `${state.profile.firstName} ${state.profile.lastName}`,
      initials: initials(state.profile.firstName, state.profile.lastName),
      avatar: "avatar-teal",
      verified: false,
      time: "Just now",
      audience: state.communityFilter === "Local" ? "Local community" : "Your community",
      content,
      type: "text",
      encouraged: 0,
      comments: 0,
      prayers: 0,
    });
    state.composerOpen = false;
    state.pendingShare = null;
    state.modal = null;
    storage.set("posts", state.posts);
    render();
    showToast("Shared with your community", "You can manage the post from its options menu.");
  };

  const commitPrayer = ({ text, scope, anonymous }) => {
    state.prayers.unshift({
      id: uid("prayer"),
      author: anonymous ? "Anonymous" : `${state.profile.firstName} ${state.profile.lastName.charAt(0)}.`,
      initials: anonymous ? "A" : initials(state.profile.firstName, state.profile.lastName),
      avatar: anonymous ? "avatar-sage" : "avatar-teal",
      time: "Just now",
      scope,
      text,
      count: 0,
      status: scope === "Community" ? "active" : "private",
    });
    storage.set("prayers", state.prayers);
    state.pendingShare = null;
    state.modal = null;
    state.route = "prayer";
    history.pushState(null, "", "#prayer");
    render();
    showToast(
      scope === "Community" ? "Prayer request shared" : "Prayer request saved privately",
      scope === "Community"
        ? "The community can now pray without seeing more than you chose to share."
        : "You can change the audience later.",
    );
  };

  const commitPendingShare = () => {
    const pending = state.pendingShare;
    if (!pending) return;
    if (pending.kind === "post") {
      commitPost(pending.content);
      return;
    }
    commitPrayer({ text: pending.text, scope: pending.scope, anonymous: pending.anonymous });
  };

  /* ------------------------------------------------------------------ *
   * The journey
   *
   * Ask → Serve → Give is the product's central claim, and until now it was
   * only claimed. A question that leads somewhere opens a thread; acting on
   * the suggestion, committing to an opportunity, and giving all append to it.
   * The thread is what lets Serve say "you're here because you asked X" and
   * lets Today show the arc rather than a set of unrelated features.
   * ------------------------------------------------------------------ */

  const JOURNEY_STEPS = {
    asked: { label: "Asked", icon: "spark" },
    explored: { label: "Explored", icon: "compass" },
    committed: { label: "Committed", icon: "heart" },
    gave: { label: "Gave", icon: "gift" },
    prayed: { label: "Prayed", icon: "hands" },
  };

  const persistJourney = () => storage.set("journey", state.journey);

  const lastQuestion = () => {
    for (let index = state.chatMessages.length - 1; index >= 0; index -= 1) {
      if (state.chatMessages[index].role === "user") return state.chatMessages[index].content;
    }
    return null;
  };

  const startJourney = (question, topic) => {
    if (!question) return;
    if (state.journey && state.journey.question === question) return;
    state.journey = {
      question,
      topic: topic || null,
      startedAt: Date.now(),
      steps: [{ kind: "asked", label: question }],
    };
    persistJourney();
  };

  const addJourneyStep = (kind, label, detail = "") => {
    if (!state.journey) return;
    const steps = state.journey.steps;
    const previous = steps[steps.length - 1];
    // Re-clicking the same suggestion shouldn't stutter the thread.
    if (previous && previous.kind === kind && previous.label === label) return;
    steps.push({ kind, label, detail });
    persistJourney();
  };

  const clearJourney = () => {
    state.journey = null;
    storage.remove("journey");
  };

  const journeyStepMarkup = (step, index, total) => `
    <li class="journey-step${index === total - 1 ? " is-current" : ""}">
      <span class="journey-mark">${icon(JOURNEY_STEPS[step.kind]?.icon || "arrow")}</span>
      <div class="journey-step-copy">
        <span class="journey-kind">${escapeHtml(JOURNEY_STEPS[step.kind]?.label || step.kind)}</span>
        <strong>${escapeHtml(step.label)}</strong>
        ${step.detail ? `<small>${escapeHtml(step.detail)}</small>` : ""}
      </div>
    </li>`;

  const renderJourneyCard = () => {
    const journey = state.journey;
    if (!journey || journey.steps.length < 2) return "";
    const total = journey.steps.length;
    return `
      <section class="rail-card journey-card" aria-labelledby="journey-title">
        <div class="rail-card-header">
          <h3 id="journey-title">Where this is going</h3>
          <button class="text-action" type="button" data-action="clear-journey">Clear</button>
        </div>
        <p class="journey-intro">One thread, from the question to what it turned into.</p>
        <ol class="journey-list">${journey.steps.map((step, index) => journeyStepMarkup(step, index, total)).join("")}</ol>
        ${
          journey.steps.some((step) => step.kind === "committed") && !journey.steps.some((step) => step.kind === "gave")
            ? `<a class="btn btn-soft btn-small" href="#give" data-route="give">Support this work too ${icon("arrow")}</a>`
            : ""
        }
      </section>`;
  };

  // Shown at the top of a destination the person reached from an answer.
  const renderJourneyContext = (route) => {
    const journey = state.journey;
    if (!journey) return "";
    const arrival = [...journey.steps].reverse().find((step) => step.kind === "explored");
    if (!arrival || arrival.detail !== route) return "";
    return `
      <div class="journey-context">
        <span class="journey-context-mark">${icon("spark")}</span>
        <div>
          <small>You asked</small>
          <strong>${escapeHtml(journey.question)}</strong>
        </div>
        <a class="text-action" href="#ask" data-route="ask">Back to the answer</a>
      </div>`;
  };

  const completeOnboarding = (demo = false) => {
    const firstNameInput = document.getElementById("onboarding-first-name");
    const lastNameInput = document.getElementById("onboarding-last-name");
    const locationInput = document.getElementById("onboarding-location");
    const languageInput = document.getElementById("onboarding-language");
    const translationInput = document.getElementById("onboarding-translation");
    if (firstNameInput) state.onboardingDraft.firstName = firstNameInput.value.trim() || "Grace";
    if (lastNameInput) state.onboardingDraft.lastName = lastNameInput.value.trim() || "Walker";
    if (locationInput) state.onboardingDraft.location = locationInput.value.trim() || "Denver, Colorado";
    if (languageInput) state.onboardingDraft.language = languageInput.value || "English";
    if (translationInput) state.onboardingDraft.translation = translationInput.value || "WEB";

    state.profile = {
      ...state.profile,
      ...state.onboardingDraft,
      onboarded: true,
      firstName: demo ? "Grace" : state.onboardingDraft.firstName,
      lastName: demo ? "Walker" : state.onboardingDraft.lastName,
      location: demo ? "Denver, Colorado" : state.onboardingDraft.location,
    };
    persistProfile();
    state.route = "home";
    history.replaceState(null, "", "#home");
    render();
    showToast("Welcome to Trumpet Nation", "Your Today view is ready.");
  };

  const downloadData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: state.profile,
      posts: state.posts,
      prayers: state.prayers,
      chatMessages: state.chatMessages.map((message) => ({ ...message, content: message.role === "assistant" ? stripHtml(message.content) : message.content })),
      encouragedPosts: [...state.encouragedPosts],
      prayedPosts: [...state.prayedPosts],
      prayedRequests: [...state.prayedRequests],
      joinedGroups: [...state.joinedGroups],
      committedOpportunities: [...state.committedOpportunities],
      savedDiscoveries: [...state.savedDiscoveries],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trumpet-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Data export created", "Your download contains this browser’s prototype data.");
  };

  const handleAction = (action, element) => {
    const value = element.dataset.value;
    const id = element.dataset.id;

    switch (action) {
      case "open-sidebar":
        state.sidebarOpen = true;
        render();
        break;
      case "close-sidebar":
        state.sidebarOpen = false;
        render();
        break;
      case "open-command":
        state.commandQuery = "";
        state.modal = { type: "command" };
        render({ focusCommand: true });
        break;
      case "open-notifications":
        state.modal = { type: "notifications" };
        render();
        break;
      case "close-modal":
        // Closing the care dialog returns to the composer with the text intact,
        // rather than discarding what the person just wrote.
        if (state.modal?.type === "care" && state.pendingShare?.kind === "prayer") {
          state.modal = { type: "prayer" };
          render();
          break;
        }
        state.modal = null;
        state.pendingShare = null;
        render({ focusMain: true });
        break;
      case "confirm-share":
        commitPendingShare();
        break;
      case "follow-suggestion": {
        // The suggestion is the hinge of the whole journey: it carries the
        // question forward instead of dumping the person on a generic list.
        const route = element.dataset.route || "home";
        const filter = element.dataset.filter || "";
        const answer = element.closest?.("[data-topic]");
        startJourney(lastQuestion(), answer?.dataset?.topic);
        addJourneyStep("explored", element.textContent.trim(), route);
        if (filter) state.serveFocus = filter;
        navigate(route);
        break;
      }
      case "clear-journey":
        clearJourney();
        render();
        showToast("Thread cleared", "Your next question starts a new one.");
        break;
      case "select-tradition":
        state.onboardingDraft.tradition = value;
        render();
        break;
      case "select-tone":
        state.onboardingDraft.tone = value;
        render();
        break;
      case "toggle-goal": {
        const goals = new Set(state.onboardingDraft.goals);
        goals.has(value) ? goals.delete(value) : goals.add(value);
        state.onboardingDraft.goals = [...goals];
        render();
        break;
      }
      case "toggle-onboarding-local":
        state.onboardingDraft.localDiscovery = !state.onboardingDraft.localDiscovery;
        render();
        break;
      case "toggle-onboarding-private":
        state.onboardingDraft.privateByDefault = !state.onboardingDraft.privateByDefault;
        render();
        break;
      case "onboarding-next": {
        if (state.onboardingStep === 1) {
          const firstName = document.getElementById("onboarding-first-name")?.value.trim();
          const lastName = document.getElementById("onboarding-last-name")?.value.trim();
          const locationValue = document.getElementById("onboarding-location")?.value.trim();
          state.onboardingDraft.firstName = firstName || "Grace";
          state.onboardingDraft.lastName = lastName || "Walker";
          state.onboardingDraft.location = locationValue || "Denver, Colorado";
        }
        if (state.onboardingStep === 2 && state.onboardingDraft.goals.length === 0) {
          showToast("Choose at least one priority", "This helps shape your Today view.");
          return;
        }
        state.onboardingStep = Math.min(3, state.onboardingStep + 1);
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      }
      case "onboarding-back":
        state.onboardingStep = Math.max(1, state.onboardingStep - 1);
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "finish-onboarding":
        completeOnboarding(false);
        break;
      case "explore-demo":
        completeOnboarding(true);
        break;
      case "quick-ask":
        sendChat(element.dataset.prompt || "");
        break;
      case "new-chat":
        state.chatMessages = [];
        state.chatTyping = false;
        storage.set("chatMessages", []);
        render();
        requestAnimationFrame(() => document.getElementById("ask-input")?.focus());
        break;
      case "open-reflection":
        state.modal = { type: "reflection" };
        render();
        break;
      case "save-reflection":
        state.modal = null;
        render();
        showToast("Reflection saved", "You can return to it from Discover.");
        break;
      case "open-composer":
        state.composerOpen = true;
        render();
        requestAnimationFrame(() => document.getElementById("post-content")?.focus());
        break;
      case "close-composer":
        state.composerOpen = false;
        render();
        break;
      case "community-filter":
        state.communityFilter = value;
        render();
        break;
      case "encourage-post":
        state.encouragedPosts.has(id) ? state.encouragedPosts.delete(id) : state.encouragedPosts.add(id);
        persistSets();
        render();
        break;
      case "pray-post":
        state.prayedPosts.has(id) ? state.prayedPosts.delete(id) : state.prayedPosts.add(id);
        persistSets();
        render();
        if (state.prayedPosts.has(id)) showToast("Prayer marked", "A quiet act, not a public performance.");
        break;
      case "comment-post":
        showToast("Comment thread opened", "Full threaded discussion is a production integration point.");
        break;
      case "share-post": {
        const post = state.posts.find((item) => item.id === id);
        copyText(post ? `${post.author}: ${post.content}` : "Trumpet Nation community post").then(() => showToast("Post copied", "Share it where it will be useful."));
        break;
      }
      case "post-menu":
        showToast("Post controls", "Mute, report, save, and audience controls belong here in production.");
        break;
      case "composer-tool":
        showToast(`${value.charAt(0).toUpperCase() + value.slice(1)} attachment selected`, "Prototype composer keeps the post text-only.");
        break;
      case "toggle-group":
        state.joinedGroups.has(id) ? state.joinedGroups.delete(id) : state.joinedGroups.add(id);
        persistSets();
        render();
        showToast(state.joinedGroups.has(id) ? "Joined circle" : "Left circle", "Your community feed has been updated.");
        break;
      case "show-all-groups":
        showToast("Group directory", "The complete search and moderation-backed directory is a production module.");
        break;
      case "topic":
        showToast(`Opening ${value}`, "Topic filtering is represented in this prototype.");
        break;
      case "open-prayer-modal":
        state.modal = { type: "prayer" };
        render();
        requestAnimationFrame(() => document.querySelector("#prayer-form textarea")?.focus());
        break;
      case "prayer-filter":
        state.prayerFilter = value;
        render();
        break;
      case "pray-request":
        state.prayedRequests.has(id) ? state.prayedRequests.delete(id) : state.prayedRequests.add(id);
        persistSets();
        render();
        if (state.prayedRequests.has(id)) showToast("Prayer offered", "The person will see a count, not your private words.");
        break;
      case "scroll-prayer-wall":
        document.getElementById("prayer-wall")?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "toggle-focus":
        state.focusRunning ? stopFocusTimer() : startFocusTimer();
        break;
      case "reset-focus":
        resetFocusTimer();
        break;
      case "support-resources":
        state.modal = { type: "support" };
        render();
        break;
      case "toggle-opportunity": {
        state.committedOpportunities.has(id) ? state.committedOpportunities.delete(id) : state.committedOpportunities.add(id);
        persistSets();
        if (state.committedOpportunities.has(id)) {
          const opportunity = OPPORTUNITIES.find((item) => item.id === id);
          if (opportunity) addJourneyStep("committed", opportunity.title, opportunity.org);
        }
        render();
        showToast(state.committedOpportunities.has(id) ? "Added to your service plan" : "Removed from your service plan", "No commitment is sent until you confirm with the partner.");
        break;
      }
      case "clear-serve-focus":
        state.serveFocus = "";
        render();
        break;
      case "serve-filter":
        state.modal = { type: "serve-filter" };
        render();
        break;
      case "partner-with-trumpet":
        state.modal = { type: "partner" };
        render();
        break;
      case "show-all-opportunities":
        showToast("All opportunities are shown", "This prototype includes six representative opportunities.");
        break;
      case "open-donation":
        state.donationCauseId = id || "cause-water";
        state.donationAmount = 25;
        state.donationRecurring = false;
        state.modal = { type: "donation" };
        render();
        break;
      case "select-amount":
        state.donationAmount = Number(value) || 25;
        render();
        break;
      case "toggle-recurring":
        state.donationRecurring = !state.donationRecurring;
        render();
        break;
      case "giving-standards":
        state.modal = { type: "giving-standards" };
        render();
        break;
      case "browse-causes":
        showToast("Cause directory", "The prototype highlights three verified campaign patterns.");
        break;
      case "discover-category":
        state.discoverCategory = value;
        render();
        break;
      case "save-discovery":
        state.savedDiscoveries.has(id) ? state.savedDiscoveries.delete(id) : state.savedDiscoveries.add(id);
        persistSets();
        render();
        showToast(state.savedDiscoveries.has(id) ? "Saved for later" : "Removed from saved", "Your Discover collection is private.");
        break;
      case "open-discovery": {
        const item = DISCOVERY_ITEMS.find((entry) => entry.id === id);
        showToast(item ? item.title : "Discovery opened", "Detailed enrollment, checkout, or visit flow is ready for backend integration.");
        break;
      }
      case "clear-discovery":
        state.discoverCategory = "All";
        state.discoverQuery = "";
        render();
        break;
      case "settings-section":
        state.settingsSection = value;
        render();
        break;
      case "toggle-setting": {
        const key = element.dataset.key;
        state.profile[key] = !state.profile[key];
        persistProfile();
        render();
        break;
      }
      case "toggle-profile-goal": {
        const goals = new Set(state.profile.goals);
        goals.has(value) ? goals.delete(value) : goals.add(value);
        state.profile.goals = [...goals];
        persistProfile();
        render();
        break;
      }
      case "delete-chat-history":
        state.chatMessages = [];
        storage.set("chatMessages", []);
        showToast("Conversation history deleted", "Ask Trumpet is clear on this device.");
        render();
        break;
      case "export-data":
        downloadData();
        break;
      case "reset-prototype":
        storage.clear();
        window.location.hash = "";
        window.location.reload();
        break;
      case "avatar-demo":
        showToast("Photo controls", "Image upload and moderation connect during production authentication work.");
        break;
      case "report-concern":
        state.modal = { type: "report" };
        render();
        break;
      case "view-governance":
        state.modal = { type: "governance" };
        render();
        break;
      case "copy-answer": {
        const message = state.chatMessages.find((item) => item.id === id);
        copyText(message ? stripHtml(message.content) : "").then(() => showToast("Answer saved to clipboard", "Keep what is useful and verify important guidance."));
        break;
      }
      case "helpful-answer":
        showToast("Feedback recorded", "Helpful feedback would improve evaluation, not personalize doctrine.");
        break;
      case "share-answer": {
        const message = state.chatMessages.find((item) => item.id === id);
        copyText(message ? stripHtml(message.content) : "").then(() => showToast("Answer copied", "Review it before sharing outside your private conversation."));
        break;
      }
      case "command-select": {
        const route = element.dataset.route || "home";
        const commandAction = element.dataset.commandAction;
        state.route = VALID_ROUTES.has(route) ? route : "home";
        state.modal = commandAction === "open-prayer-modal" ? { type: "prayer" } : null;
        history.pushState(null, "", `#${state.route}`);
        render({ scrollChat: state.route === "ask" });
        window.scrollTo({ top: 0, behavior: "auto" });
        break;
      }
      default:
        break;
    }
  };

  document.addEventListener("click", (event) => {
    let actionElement = event.target.closest("[data-action]");
    if (actionElement?.classList?.contains("modal-backdrop") && event.target !== actionElement) {
      actionElement = null;
    }
    const isFormControlAction = actionElement && ["INPUT", "SELECT", "TEXTAREA"].includes(actionElement.tagName);
    if (actionElement && !isFormControlAction) {
      event.preventDefault();
      handleAction(actionElement.dataset.action, actionElement);
      return;
    }

    const routeElement = event.target.closest("[data-route]");
    if (routeElement) {
      const isModifiedLink =
        routeElement.tagName === "A" &&
        (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
      if (isModifiedLink) return;
      event.preventDefault();
      const settingsSection = routeElement.dataset.settings;
      navigate(routeElement.dataset.route, { settingsSection });
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    event.preventDefault();

    if (form.id === "home-ask-form" || form.id === "ask-form") {
      const data = new FormData(form);
      sendChat(data.get("prompt"));
      return;
    }

    if (form.id === "post-form") {
      const data = new FormData(form);
      const content = String(data.get("content") || "").trim();
      if (!content) return;
      const postCrisis = detectCrisis(content);
      if (postCrisis) {
        state.pendingShare = { kind: "post", crisisId: postCrisis.id, content };
        state.modal = { type: "care" };
        render();
        return;
      }
      commitPost(content);
      return;
    }

    if (form.id === "prayer-form") {
      const data = new FormData(form);
      const text = String(data.get("text") || "").trim();
      const scope = String(data.get("scope") || "Private journal");
      const anonymous = data.get("anonymous") === "on";
      if (!text) return;
      const prayerCrisis = detectCrisis(text);
      if (prayerCrisis) {
        state.pendingShare = { kind: "prayer", crisisId: prayerCrisis.id, text, scope, anonymous };
        state.modal = { type: "care" };
        render();
        return;
      }
      commitPrayer({ text, scope, anonymous });
      return;
    }

    if (form.id === "donation-form") {
      const data = new FormData(form);
      const custom = Number(data.get("customAmount"));
      const amount = Number.isFinite(custom) && custom > 0 ? Math.round(custom) : state.donationAmount;
      state.donationAmount = amount;
      state.profile.donationTotal += amount;
      persistProfile();
      const cause = CAUSES.find((item) => item.id === state.donationCauseId) || CAUSES[0];
      addJourneyStep("gave", `${formatCurrency(amount)} to ${cause.org}`, cause.title);
      state.modal = null;
      render();
      showToast("Demo gift recorded", `${formatCurrency(amount)} to ${cause.org}. No payment was collected.`);
      return;
    }

    if (form.id === "discover-search-form") {
      const data = new FormData(form);
      state.discoverQuery = String(data.get("query") || "").trim();
      render();
      return;
    }

    if (form.id === "profile-form") {
      const data = new FormData(form);
      state.profile.firstName = String(data.get("firstName") || "").trim() || state.profile.firstName;
      state.profile.lastName = String(data.get("lastName") || "").trim() || state.profile.lastName;
      state.profile.email = String(data.get("email") || "").trim() || state.profile.email;
      state.profile.location = String(data.get("location") || "").trim() || state.profile.location;
      persistProfile();
      render();
      showToast("Profile saved", "Your name and home area are updated.");
      return;
    }

    if (form.id === "lens-form") {
      const data = new FormData(form);
      state.profile.tradition = String(data.get("tradition") || state.profile.tradition);
      state.profile.tone = String(data.get("tone") || state.profile.tone);
      state.profile.language = String(data.get("language") || state.profile.language);
      persistProfile();
      render();
      showToast("Faith lens saved", `${state.profile.tradition} · ${state.profile.tone}`);
      return;
    }

    if (form.id === "serve-filter-form") {
      state.modal = null;
      render();
      showToast("Service results refined", "Showing representative matches for this prototype.");
      return;
    }

    if (form.id === "partner-form") {
      state.modal = null;
      render();
      showToast("Partner interest captured", "A production workflow would route this to partner operations.");
      return;
    }

    if (form.id === "report-form") {
      state.modal = null;
      render();
      showToast("Concern recorded", "A production safety team would review and respond through a case workflow.");
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches('[data-action="change-tradition"]')) {
      state.profile.tradition = target.value;
      persistProfile();
      render({ scrollChat: true });
      showToast("Faith lens updated", state.profile.tradition);
      return;
    }
    if (target.matches('[data-action="change-tone"]')) {
      state.profile.tone = target.value;
      persistProfile();
      render({ scrollChat: true });
      showToast("Response style updated", state.profile.tone);
      return;
    }
    if (target.matches('[data-action="change-translation"]')) {
      state.profile.translation = target.value;
      persistProfile();
      render({ scrollChat: true });
      const meta = TRANSLATIONS.find((item) => item.value === state.profile.translation);
      showToast(
        "Translation updated",
        meta && meta.licensed ? `${meta.label} needs a publisher licence — showing WEB` : meta ? meta.label : "",
      );
      return;
    }
    if (target.id === "onboarding-language") {
      state.onboardingDraft.language = target.value;
      return;
    }
    if (target.closest?.("#lens-form") && ["tradition", "tone", "language", "translation"].includes(target.name)) {
      state.profile[target.name] = target.value;
      persistProfile();
      return;
    }
    if (target.name === "anonymous") {
      target.closest("label")?.querySelector("[data-checkbox-toggle]")?.classList.toggle("on", target.checked);
    }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target.id === "ask-input") {
      state.chatDraft = target.value;
      target.style.height = "auto";
      target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
    }
    if (target.id === "onboarding-first-name") state.onboardingDraft.firstName = target.value;
    if (target.id === "onboarding-last-name") state.onboardingDraft.lastName = target.value;
    if (target.id === "onboarding-location") state.onboardingDraft.location = target.value;
    if (target.dataset.action === "command-search") {
      state.commandQuery = target.value;
      render({ focusCommand: true });
    }
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;

    if (state.modal && event.key === "Tab") {
      const panel = document.querySelector("[data-modal-panel]");
      const focusable = panel
        ? [...panel.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")].filter(
            (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true",
          )
        : [];
      if (focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      state.commandQuery = "";
      state.modal = { type: "command" };
      render({ focusCommand: true });
      return;
    }

    if (event.key === "/" && !isTyping && state.profile.onboarded) {
      event.preventDefault();
      state.commandQuery = "";
      state.modal = { type: "command" };
      render({ focusCommand: true });
      return;
    }

    if (event.key === "Escape") {
      if (state.modal) {
        state.modal = null;
        render({ focusMain: true });
      } else if (state.sidebarOpen) {
        state.sidebarOpen = false;
        render();
      }
      return;
    }

    if (target.id === "ask-input" && event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      target.closest("form")?.requestSubmit();
    }
  });

  const handleHistoryNavigation = () => {
    const route = location.hash.replace("#", "");
    if (VALID_ROUTES.has(route) && route !== state.route) {
      state.route = route;
      state.modal = null;
      state.sidebarOpen = false;
      render({ scrollChat: route === "ask", focusMain: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  window.addEventListener("popstate", handleHistoryNavigation);
  window.addEventListener("hashchange", handleHistoryNavigation);

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Trumpet service worker registration failed", error));
    });
  }

  window.TrumpetDemo = {
    state,
    navigate,
    reset() {
      storage.clear();
      location.reload();
    },
    __test: {
      handleAction,
      sendChat,
      render,
      renderView,
      buildTrumpetResponse,
    },
  };

  render({ scrollChat: state.route === "ask" });
})();
