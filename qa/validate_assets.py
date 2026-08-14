from pathlib import Path
import json

from lxml import html
import tinycss2

ROOT = Path(__file__).resolve().parents[1]

html_text = (ROOT / 'index.html').read_text()
doc = html.fromstring(html_text)
assert doc.xpath('//meta[@name="viewport"]'), 'viewport meta missing'
assert doc.xpath('//*[@id="app"]'), 'app root missing'
assert doc.xpath('//*[@id="toast-layer"]'), 'toast layer missing'
assert doc.xpath('//link[@rel="manifest"]'), 'manifest link missing'
assert doc.xpath('//script[@src="app.js"]'), 'app script missing'
assert doc.xpath('//a[@class="skip-link" and @href="#main-content"]'), 'skip link missing'

ids = doc.xpath('//@id')
assert len(ids) == len(set(ids)), 'duplicate static HTML ids found'

css_text = (ROOT / 'styles.css').read_text()
rules = tinycss2.parse_stylesheet(css_text, skip_comments=True, skip_whitespace=True)
errors = [rule for rule in rules if rule.type == 'error']
assert not errors, f'CSS parse errors: {errors}'
assert ':focus-visible' in css_text, 'keyboard focus styling missing'
assert ':focus-within' in css_text, 'compound-control focus styling missing'
assert 'prefers-reduced-motion' in css_text, 'reduced motion handling missing'
assert '@media (max-width: 680px)' in css_text, 'mobile breakpoint missing'
assert 'touch-action: manipulation' in css_text, 'touch interaction optimization missing'
assert 'transition: all' not in css_text, 'transition: all should not be used'

manifest = json.loads((ROOT / 'manifest.webmanifest').read_text())
assert manifest['display'] == 'standalone', 'PWA standalone mode missing'
assert manifest['start_url'] == './#home', 'unexpected PWA start route'
manifest_icons = {item['src'] for item in manifest.get('icons', [])}
expected_icons = {'assets/favicon.svg', 'assets/icon-192.png', 'assets/icon-512.png'}
assert expected_icons.issubset(manifest_icons), 'manifest icons incomplete'

for relative_path in [
    'app.js',
    'styles.css',
    'sw.js',
    'assets/favicon.svg',
    'assets/icon-192.png',
    'assets/icon-512.png',
]:
    path = ROOT / relative_path
    assert path.exists() and path.stat().st_size > 0, f'missing or empty asset: {relative_path}'

app_text = (ROOT / 'app.js').read_text()
assert 'Intentional relationships' in app_text, 'connections safety preview missing'
assert 'Preferred language' in app_text, 'language personalization missing'
assert 'data-modal-panel tabindex="-1"' in app_text, 'dialog focus target missing'
assert 'role="log" aria-live="polite"' in app_text, 'chat live region missing'

print('Trumpet asset validation passed')
