/**
 * nav.js — Mobile navigation toggle
 * Manages aria-expanded, data-open state, Escape key, and focus management.
 */

export function initNav() {
  'use strict';

  const toggle = document.querySelector('.nav__toggle');
  const navList = document.getElementById('primary-nav-list');

  if (!toggle || !navList) return;

  // Reveal toggle (hidden by default to support no-JS state)
  toggle.hidden = false;

  function openNav() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    navList.setAttribute('data-open', 'true');
  }

  function closeNav() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    navList.setAttribute('data-open', 'false');
  }

  toggle.addEventListener('click', function () {
    const isOpen = this.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
      toggle.focus();
    }
  });

  // Close when focus leaves the nav entirely
  navList.addEventListener('focusout', function (e) {
    if (!navList.contains(e.relatedTarget) && !toggle.contains(e.relatedTarget)) {
      closeNav();
    }
  });

  // Close when a nav link is clicked (mobile UX)
  navList.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
      }
    });
  });
}
