// content.js
(function () {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ------------------ visibility & DOM helpers ------------------
  const isHiddenTree = (el) =>
    !!(el && (el.closest('[aria-hidden="true"]') || el.closest('[inert]')));

  const isActuallyVisible = (el) => {
    if (!el || isHiddenTree(el)) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  };

  function getActiveDialog() {
    // pick the top-most visible dialog that isn't aria-hidden/inert
    const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
    const visible = dialogs.filter((d) => isActuallyVisible(d));
    return visible.length ? visible[visible.length - 1] : null;
  }

  // ------------------ URL & page helpers ------------------
  function getUsernameFromPath() {
    const m = location.pathname.match(/^\/([^\/?]+)\/?/);
    return m ? m[1] : null;
  }

  function onProfilePage() {
    // Accept both www and non-www, tolerate query/hash
    return /^https:\/\/(www\.)?instagram\.com\/[^\/?#]+(\/(followers|following)\/?)?([?#].*)?$/i.test(location.href);
  }

  // ------------------ expected count from header (nice-to-have) ------------------
  function parseAbbrevNumber(s) {
    if (!s) return null;
    s = s.trim().toLowerCase().replace(/,/g, '');
    const m = s.match(/^([0-9]*\.?[0-9]+)\s*([km])?$/);
    if (!m) return null;
    let n = parseFloat(m[1]);
    if (m[2] === 'k') n *= 1_000;
    if (m[2] === 'm') n *= 1_000_000;
    return Math.round(n);
  }

  function getExpectedCount(which) {
    const sel = which === 'followers' ? 'a[href$="/followers/"]' : 'a[href$="/following/"]';
    const anchors = Array.from(document.querySelectorAll(sel)).filter(isActuallyVisible);
    for (const a of anchors) {
      const txt = (a.textContent || '').trim();
      const n = parseAbbrevNumber(txt);
      if (n) return n;

      const aria = a.getAttribute('aria-label') || '';
      const n2 = parseAbbrevNumber(aria);
      if (n2) return n2;

      const inner = Array.from(a.querySelectorAll('span[aria-label], div[aria-label]'));
      for (const el of inner) {
        const nn = parseAbbrevNumber(el.getAttribute('aria-label') || '');
        if (nn) return nn;
      }

      const m = txt.match(/[\d,.]+[kKmM]?/);
      if (m) {
        const n3 = parseAbbrevNumber(m[0]);
        if (n3) return n3;
      }
    }
    return null;
  }

  // ------------------ open followers/following ------------------
  async function openList(which) {
    const selector = which === 'followers' ? 'a[href$="/followers/"]' : 'a[href$="/following/"]';
    let anchor = Array.from(document.querySelectorAll(selector)).find(isActuallyVisible);
    if (!anchor) {
      anchor = Array.from(document.querySelectorAll('a')).find((a) => {
        const href = a.getAttribute('href') || '';
        return (
          isActuallyVisible(a) &&
          (which === 'followers' ? /\/followers\/$/.test(href) : /\/following\/$/.test(href))
        );
      });
    }

    if (anchor) {
      console.debug('[IFE] Clicking to open', which, 'dialog');
      anchor.click();
      return true;
    } else {
      // Avoid navigating within the content script because it closes the message channel.
      // Signal the caller to navigate instead.
      if (location.href.includes(`/${which}/`)) return true;
      const username = getUsernameFromPath();
      if (!username) throw new Error('NAVIGATE_REQUIRED about:blank');
      const url = `https://www.instagram.com/${username}/${which}/`;
      console.debug('[IFE] Navigation required to', url);
      throw new Error(`NAVIGATE_REQUIRED ${url}`);
    }
  }

  // ------------------ locate the real scrollable container ------------------
  function findScrollable() {
    // Prefer common IG list class
    const pass = (node) => node && isActuallyVisible(node) && node.scrollHeight > node.clientHeight + 10;

    let el = document.querySelector('div._aano');
    if (pass(el)) return el;

    // Inside active dialog: search any descendant that looks scrollable
    const dlg = getActiveDialog();
    if (dlg) {
      el = dlg.querySelector('div._aano');
      if (pass(el)) return el;

      // Try any element with overflow-y auto/scroll
      const all = Array.from(dlg.querySelectorAll('*')).filter(isActuallyVisible);
      for (const c of all) {
        const cs = getComputedStyle(c);
        if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && c.scrollHeight > c.clientHeight + 10) return c;
      }

      // Heuristic: tallest visible container within dialog
      let best = null;
      for (const c of all) {
        if (!best || c.scrollHeight > best.scrollHeight) best = c;
      }
      if (pass(best)) return best;
    }

    // Page-level scroll container
    const se = document.scrollingElement;
    if (se && se.scrollHeight > innerHeight + 10) return se;

    return null;
  }

  // ------------------ username + meta extraction (excluding hidden trees) ------------------
  function extractUsersWithMeta() {
    const scope = getActiveDialog() || document;
    const badPrefixes = new Set(['explore', 'reels', 'direct', 'accounts', 'p', 'tv', 'stories']);
    const links = Array.from(scope.querySelectorAll('a[href^="/"][href$="/"]')).filter(
      (a) => !isHiddenTree(a)
    );
    const names = new Set();
    const meta = Object.create(null);
    for (const a of links) {
      const href = a.getAttribute('href') || '';
      if (!/^\/[A-Za-z0-9_.]+\/$/.test(href)) continue;
      const name = href.slice(1, -1);
      const head = name.split('/')[0];
      if (badPrefixes.has(head)) continue;
      names.add(name);

      // detect verified badge nearby
      let container = a;
      for (let i = 0; i < 4 && container && container.parentElement; i++) container = container.parentElement;
      let isVerified = false;
      try {
        const root = container || a.parentElement || a;
        if (root.querySelector('svg[aria-label*="Verified" i], [aria-label*="Verified" i]')) {
          isVerified = true;
        }
      } catch {}
      if (!meta[name]) meta[name] = { verified: !!isVerified };
      else meta[name].verified = meta[name].verified || !!isVerified;
    }
    return { usernames: Array.from(names), meta };
  }

  // ------------------ wait for visible UI ------------------
  async function waitForListUI(timeoutMs = 25000) {
    const isReady = () => {
      const dlg = getActiveDialog();
      if (dlg) return true;
      const list = document.querySelector('div._aano');
      return !!(list && isActuallyVisible(list));
    };

    if (isReady()) return true;

    return new Promise(async (resolve) => {
      let done = false;
      const stop = () => { if (observer) observer.disconnect(); done = true; };
      const observer = new MutationObserver(() => {
        if (done) return;
        if (isReady()) { stop(); resolve(true); }
      });
      try {
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true, attributes: true });
      } catch {}

      const start = Date.now();
      while (!done && Date.now() - start < timeoutMs) {
        if (isReady()) { stop(); resolve(true); return; }
        await sleep(200);
      }
      if (!done) { stop(); resolve(false); }
    });
  }

  // ------------------ robust scroll loop with aria-hidden safety ------------------
  async function scrollToLoadAll({ which, expectedTotal, maxTotalMs = 300000 } = {}) {
    let scrollable = findScrollable();
    if (!scrollable) {
      // Give UI extra time to render and try to open again if needed
      for (let i = 0; i < 15 && !scrollable; i++) {
        await sleep(300);
        const dlg = getActiveDialog();
        if (!dlg) {
          try { await openList(which); } catch {}
        }
        scrollable = findScrollable();
      }
      if (!scrollable) throw new Error('Could not find the list container to scroll.');
    }

    // If focus is inside a hidden subtree, blur it to stop Chrome accessibility warning
    if (document.activeElement && isHiddenTree(document.activeElement)) {
      document.activeElement.blur();
    }

    // Focus only if visible
    if (isActuallyVisible(scrollable)) {
      try { scrollable.focus(); } catch {}
    }

    let lastCount = -1;
    let stableTicks = 0;
    const started = Date.now();

    const nudge = () => {
      try {
        // Avoid focusing hidden nodes mid-run
        if (document.activeElement && isHiddenTree(document.activeElement)) {
          document.activeElement.blur();
        }
        if (!isHiddenTree(scrollable)) {
          scrollable.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: 240 }));
        }
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', code: 'PageDown', bubbles: true }));
      } catch {}
    };

    while (Date.now() - started < maxTotalMs) {
      // Re-evaluate the container each loop in case IG swaps the DOM
      const maybeNew = findScrollable();
      if (maybeNew && maybeNew !== scrollable) {
        scrollable = maybeNew;
        if (isActuallyVisible(scrollable)) {
          try { scrollable.focus(); } catch {}
        }
      }

      if (isHiddenTree(scrollable) || !isActuallyVisible(scrollable)) {
        // If the current container became hidden, reacquire and continue
        const recovered = findScrollable();
        if (recovered) scrollable = recovered;
      }

      // Aggressive bottom scroll (helps virtualized lists)
      scrollable.scrollTo({ top: scrollable.scrollHeight });
      await sleep(650);
      scrollable.scrollTo({ top: scrollable.scrollHeight + 4000 });
      await sleep(300);

      const nowCount = extractUsersWithMeta().usernames.length;
      console.debug(`[IFE] ${which}: count=${nowCount} ${expectedTotal ? `(target ${expectedTotal})` : ''}`);

      if (expectedTotal && nowCount >= Math.max(1, expectedTotal - 1)) break;

      if (nowCount <= lastCount) {
        stableTicks += 1;
        nudge();
      } else {
        stableTicks = 0;
        lastCount = nowCount;
      }

      if (stableTicks >= 10) break; // no growth for several cycles
    }

    await sleep(400);
  }

  // ------------------ main collector ------------------
  async function collect(which) {
    // Be permissive with page location; we'll attempt to open or navigate as needed

    await openList(which);

    const uiReady = await waitForListUI(30000);
    if (!uiReady) throw new Error('Followers/Following UI did not appear.');

    const expected = getExpectedCount(which);
    if (expected) {
      console.debug('[IFE]', which, 'expected total:', expected);
    } else {
      console.debug('[IFE]', which, 'expected total unknown');
    }

    await scrollToLoadAll({ which, expectedTotal: expected, maxTotalMs: 300000 });

    const result = extractUsersWithMeta();
    const usernames = result.usernames;
    const meta = result.meta;
    console.debug('[IFE]', which, 'final count:', usernames.length);

    // Close dialog via Escape (if present)
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, which: 27, bubbles: true })
    );

    const sorted = usernames.sort((a, b) => a.localeCompare(b));
    const sortedMeta = Object.create(null);
    for (const u of sorted) { if (meta[u]) sortedMeta[u] = meta[u]; }
    return { usernames: sorted, meta: sortedMeta };
  }

  // ------------------ messaging ------------------
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    (async () => {
      try {
        if (msg && msg.kind === 'INSTA_PING') {
          sendResponse({ ok: true });
          return;
        }
        if (msg && msg.kind === 'INSTA_SCRAPE' && (msg.which === 'followers' || msg.which === 'following')) {
          const data = await collect(msg.which);
          sendResponse({ ok: true, usernames: data.usernames, meta: data.meta });
          return;
        }
        sendResponse({ ok: false, error: 'Unknown message' });
      } catch (e) {
        console.error('[IFE] Error:', e);
        sendResponse({ ok: false, error: e.message || String(e) });
      }
    })();
    return true; // keep channel open for async
  });
})();

