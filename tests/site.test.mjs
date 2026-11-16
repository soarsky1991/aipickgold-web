import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSite } from '../src/site/site.js';

for (const view of ['home', 'learn', 'about']) {
  test(`${view}: complete page and valid local destinations`, () => {
    const page = renderSite(`?view=${view}`);
    assert.equal(page.view, view);
    assert.equal((page.html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(page.html, new RegExp(`href="\\?view=${view}" aria-current="page"`));
    const ids = [...page.html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, id] of page.html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `missing anchor ${id}`);
    assert.doesNotMatch(page.html, /concept=|方案 [ABC]|<script/);
  });
}
test('unknown and malicious route input falls back without interpolation', () => {
  for (const search of ['?view=constructor', '?view=__proto__', '?view=%3Cscript%3E', '?concept=b']) {
    const page = renderSite(search);
    assert.equal(page.view, 'home');
    assert.equal(page.html, renderSite().html);
  }
});
test('five accessible content entries survive without WebGL', () => {
  const html = renderSite().html;
  assert.equal((html.match(/data-node=/g) || []).length, 5);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /以下入口仍可浏览/);
});
