// Run with PLAYWRIGHT_CORE_PATH set to an installed playwright-core package.
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'artifacts', 'final-pages-review');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = 'http://127.0.0.1:8080/';
  const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
  const changed = ['design-process.html', 'project-thumbnails.html', 'project-thumbnails-2.html', 'daybrave-skincare.html', 'work.html'];
  try {
    let layouts = 0;
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const name of [390, 1440].includes(width) ? pages : changed) {
        assert.equal((await page.goto(base + name)).status(), 200);
        await page.evaluate(async () => {
          await document.fonts.ready;
          document.querySelectorAll('img').forEach(img => img.loading = 'eager');
          await Promise.all(Array.from(document.images, img => img.decode().catch(() => {})));
        });
        const state = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          missing: Array.from(document.images).filter(img => img.getAttribute('src') && !img.naturalWidth).map(img => img.src),
          processLinks: document.querySelectorAll('a[href="design-process.html"]').length,
          thumbnailLinks: document.querySelectorAll('a[href="project-thumbnails.html"]').length,
        }));
        assert.equal(state.overflow, false, `${name} overflow at ${width}`);
        assert.deepEqual(state.missing, [], `${name} missing images at ${width}`);
        assert.ok(state.processLinks >= 2 && state.thumbnailLinks >= 2, `${name} discovery links`);
        if (changed.includes(name) && [390, 1440].includes(width)) {
          await page.screenshot({ path: path.join(output, `${name.replace('.html', '')}-${width}.png`), fullPage: true });
        }
        layouts++;
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const [name, source] of [
      ['project-thumbnails.html', 'project-thumbnails-1.jpg'],
      ['project-thumbnails-2.html', 'project-thumbnails-2.jpg'],
      ['daybrave-skincare.html', 'daybrave-products-final.png'],
    ]) {
      await page.goto(base + name);
      const button = page.locator(`[data-lightbox$="${source}"]`);
      await button.click();
      await page.locator('#lightbox.show').waitFor();
      await page.locator('#lightbox img').evaluate(img => img.decode());
      assert.ok((await page.locator('#lightbox img').getAttribute('src')).endsWith(source));
      await page.keyboard.press('Escape');
      await page.locator('#lightbox').waitFor({ state: 'hidden' });
      assert.ok(await button.evaluate(el => el === document.activeElement), `${name} restores focus`);
    }
    await page.goto(base + 'project-thumbnails.html');
    await page.locator('.sheet-pagination').first().getByRole('link', { name: 'Page 2' }).click();
    assert.ok(page.url().endsWith('project-thumbnails-2.html'));
    await page.goto(base + 'design-process.html');
    assert.equal(await page.locator('.process-steps > li').count(), 6);
    assert.equal(await page.locator('.process-values article').count(), 3);
    await page.getByRole('link', { name: 'Step 6: Delivery', exact: true }).click();
    assert.ok(page.url().endsWith('#process-6'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + 'index.html');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('.navbar .dropdown-toggle').click();
    await page.locator('.dropdown-menu').getByRole('link', { name: 'My creative process' }).click();
    assert.ok(page.url().endsWith('design-process.html'));
    assert.deepEqual(errors, []);
    const report = `PASS: ${pages.length} pages, ${layouts} responsive layouts, all images loaded, no horizontal overflow.\nPASS: three original-image viewers, Escape dismissal and focus return, two-sheet pagination, six process steps, process anchors, three differentiators, mobile navigation and no JavaScript errors.\n`;
    fs.writeFileSync(path.join(output, 'browser-verification.txt'), report);
    console.log(report);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
