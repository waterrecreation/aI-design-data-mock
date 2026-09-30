/**
 * Vibers theme system. Canonical mechanism site-wide (supersedes the old
 * vibers-ui.js theme code, which nothing ever loaded, and the standalone
 * theme-toggle.js this file replaces). Drives [data-v-theme] on <html>,
 * persists under localStorage key 'v-theme', dispatches 'vibers:themechange'
 * so other scripts can react without polling the DOM.
 */
(function () {
  'use strict';
  var KEY = 'v-theme';

  try {
    var stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-v-theme', stored);
    }
  } catch (e) { /* no localStorage, fall back to the page's own default */ }

  function current() {
    return document.documentElement.getAttribute('data-v-theme') === 'light' ? 'light' : 'dark';
  }

  function syncLabels(theme) {
    document.querySelectorAll('[data-pf-theme-label]').forEach(function (el) {
      el.textContent = theme === 'light' ? '深色' : '浅色';
    });
  }

  function set(theme) {
    var resolved = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-v-theme', resolved);
    try { localStorage.setItem(KEY, resolved); } catch (e) {}
    syncLabels(resolved);
    window.dispatchEvent(new CustomEvent('vibers:themechange', { detail: { theme: resolved } }));
    return resolved;
  }

  function toggle() {
    return set(current() === 'light' ? 'dark' : 'light');
  }

  // Event-delegated so buttons added after load (e.g. by vibers-interact.js
  // re-rendering a list) work without re-wiring.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-pf-theme-toggle]');
    if (btn) toggle();
  });

  document.addEventListener('DOMContentLoaded', function () {
    syncLabels(current());
  });

  // Real login-state indicator injected into the shared .page-topbar, on
  // every page that has one (theme.js is the one script every page already
  // loads, so this rolls out site-wide without touching each page's HTML).
  // Only rendered when actually logged in -- most guest pages start logged
  // out on purpose, and a fake "logout" affordance on a logged-out page
  // would be dishonest.
  function renderAuthChip() {
    var bar = document.querySelector('.page-topbar');
    if (!bar || !window.VibersStore) return;
    var existing = document.getElementById('vTopbarAuth');
    var auth = window.VibersStore.get('auth');
    if (!auth || !auth.isLoggedIn) {
      if (existing) existing.remove();
      return;
    }
    var identity = window.VibersStore.get('currentIdentity') || {};
    var profile = (window.VibersStore.get('profile') || {})[identity.userId] || {};
    var initial = profile.avatarInitial || (auth.user && auth.user.name && auth.user.name.charAt(0)) || '?';
    if (existing) { existing.querySelector('.v-topbar-auth-avatar').textContent = initial; return; }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'vTopbarAuth';
    btn.className = 'v-topbar-auth';
    btn.setAttribute('aria-label', '退出登录');
    btn.innerHTML = '<span class="v-topbar-auth-avatar"></span>退出';
    btn.querySelector('.v-topbar-auth-avatar').textContent = initial;
    btn.addEventListener('click', function () {
      window.VibersStore.logout();
      window.VibersStore.set('currentIdentity', function (curr) {
        curr = curr || {};
        curr.mode = 'guest';
        return curr;
      });
      window.location.href = 'landing.html';
    });
    bar.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', renderAuthChip);
  window.addEventListener('vibers:store:auth', renderAuthChip);

  window.VibersTheme = Object.freeze({ current: current, set: set, toggle: toggle });
})();
