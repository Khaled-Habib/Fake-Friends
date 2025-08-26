function log(msg) {
  const el = document.getElementById('status');
  el.textContent += `\n${msg}`;
  el.scrollTop = el.scrollHeight;
}

async function sendToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) throw new Error('No active tab');
  const url = tab.url || '';
  if (!/^https:\/\/(www\.)?instagram\.com\//i.test(url)) {
    throw new Error('Open your Instagram profile in the active tab first.');
  }

  async function ping() {
    try {
      const res = await chrome.tabs.sendMessage(tab.id, { kind: 'INSTA_PING' });
      return res && res.ok === true;
    } catch (_) {
      return false;
    }
  }

  let alive = await ping();
  if (!alive) {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    // Give the content script a moment to initialize; retry a few times
    for (let i = 0; i < 5 && !alive; i++) {
      await new Promise(r => setTimeout(r, 300 + i * 150));
      alive = await ping();
    }
    if (!alive) throw new Error('Could not reach content script.');
  }

  const res = await chrome.tabs.sendMessage(tab.id, message);
  if (res && res.ok === false) {
    const err = String(res.error || '').trim();
    // Special handling: if content asks us to navigate, do it from the popup
    if (err.startsWith('NAVIGATE_REQUIRED')) {
      const parts = err.split(/\s+/);
      const url = parts[1];
      const target = url && /^https?:\/\//.test(url) ? url : null;
      if (!target) throw new Error('Navigation required but URL missing.');
      await chrome.tabs.update(tab.id, { url: target });
      // wait for load complete
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Navigation timeout')), 30000);
        function onUpdated(updatedTabId, changeInfo) {
          if (updatedTabId === tab.id && changeInfo.status === 'complete') {
            clearTimeout(timeout);
            chrome.tabs.onUpdated.removeListener(onUpdated);
            resolve();
          }
        }
        chrome.tabs.onUpdated.addListener(onUpdated);
      });
      // ensure content is alive after navigation
      let alive = false;
      for (let i = 0; i < 5 && !alive; i++) {
        try {
          const res2 = await chrome.tabs.sendMessage(tab.id, { kind: 'INSTA_PING' });
          alive = !!(res2 && res2.ok);
        } catch {}
        if (!alive) {
          await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
          await new Promise(r => setTimeout(r, 300 + i * 150));
        }
      }
      if (!alive) throw new Error('Could not reach content after navigation.');
      // retry original message once
      const retry = await chrome.tabs.sendMessage(tab.id, message);
      if (retry && retry.ok === false) throw new Error(retry.error || 'Content script error');
      return retry;
    }
    throw new Error(err || 'Content script error');
  }
  return res;
}

function saveBlob(filename, text, withBOM = true) {
  const parts = withBOM ? [new Uint8Array([0xEF, 0xBB, 0xBF]), text] : [text];
  const blob = new Blob(parts, { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename, saveAs: true });
}

function toCSV(array) {
  return ['username']
    .concat(array.map(u => '"' + String(u).replace(/"/g, '""') + '"'))
    .join('\n');
}

const state = { followers: [], following: [], notFollowingBack: [] };

let busy = false;

async function withBusyUi(fn) {
  if (busy) { log('Already running. Please wait…'); return; }
  busy = true;
  const buttons = Array.from(document.querySelectorAll('button'));
  const prevDisabled = buttons.map(b => b.disabled);
  buttons.forEach(b => { b.disabled = true; b.style.opacity = '0.7'; });
  try {
    await fn();
  } finally {
    buttons.forEach((b, i) => { b.disabled = prevDisabled[i]; b.style.opacity = ''; });
    busy = false;
  }
}

async function scrape(type) {
  await withBusyUi(async () => {
    log(`Starting ${type} scrape…`);
    try {
      const res = await sendToActiveTab({ kind: 'INSTA_SCRAPE', which: type });
      if (!res || !Array.isArray(res.usernames)) throw new Error(res && res.error ? res.error : 'Unexpected response');
      state[type] = res.usernames;
      log(`Got ${res.usernames.length} ${type}.`);
      document.getElementById(`${type}-count`).textContent = res.usernames.length;
      await chrome.storage.local.set({ [type]: res.usernames });
    } catch (e) {
      log(`Error: ${e.message}`);
    }
  });
}

async function compare() {
  const saved = await chrome.storage.local.get(['followers', 'following']);
  const followers = state.followers.length ? state.followers : (saved.followers || []);
  const following = state.following.length ? state.following : (saved.following || []);
  const fset = new Set(followers.map(s => String(s).toLowerCase()));
  const notBack = following.filter(u => !fset.has(String(u).toLowerCase()));
  state.notFollowingBack = notBack;
  log(`Not following back: ${notBack.length}`);
}

async function init() {
  const trigger = document.getElementById('show-fake-friends');
  trigger.addEventListener('click', async () => {
    await withBusyUi(async () => {
      log('Collecting followers and following…');
      // scrape followers then following
      try {
        const resFers = await sendToActiveTab({ kind: 'INSTA_SCRAPE', which: 'followers' });
        if (!resFers || !Array.isArray(resFers.usernames)) throw new Error(resFers && resFers.error ? resFers.error : 'Unexpected response (followers)');
        state.followers = resFers.usernames;
        document.getElementById('followers-count').textContent = resFers.usernames.length;
        await chrome.storage.local.set({ followers: resFers.usernames, followersMeta: resFers.meta || {} });

        const resFing = await sendToActiveTab({ kind: 'INSTA_SCRAPE', which: 'following' });
        if (!resFing || !Array.isArray(resFing.usernames)) throw new Error(resFing && resFing.error ? resFing.error : 'Unexpected response (following)');
        state.following = resFing.usernames;
        document.getElementById('following-count').textContent = resFing.usernames.length;
        await chrome.storage.local.set({ following: resFing.usernames, followingMeta: resFing.meta || {} });

        // compare
        const fset = new Set(resFers.usernames.map(s => String(s).toLowerCase()));
        const notBack = resFing.usernames.filter(u => !fset.has(String(u).toLowerCase()));
        state.notFollowingBack = notBack;
        log(`Not following back: ${notBack.length}`);

        // mark influencers using verification info (from following list, where we filtered from)
        const meta = resFing.meta || {};
        const rows = notBack.map(u => ({ username: u, influencer: meta[u]?.verified ? 'yes' : '' }));

        // auto-download CSV
        const csv = ['username,influencer'].concat(rows.map(r => `${JSON.stringify(r.username)},${r.influencer}`)).join('\n');
        saveBlob('not_following_back.csv', csv);
      } catch (e) {
        log(`Error: ${e.message}`);
      }
    });
  });

  const saved = await chrome.storage.local.get(['followers', 'following']);
  if (saved.followers) document.getElementById('followers-count').textContent = saved.followers.length;
  if (saved.following) document.getElementById('following-count').textContent = saved.following.length;
}

init();

