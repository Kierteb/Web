/**
 * nav.js — Mobile navigation toggle + scroll-spy for section-based nav links
 * Manages aria-expanded, data-open, Escape key, focus management,
 * and dynamically updates aria-current based on scroll position.
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

  // Scroll spy — updates aria-current when nav links point to
  // sections on the current page via hash anchors
  initScrollSpy(navList);
}


function initScrollSpy(navList) {
  'use strict';

  const currentPath = window.location.pathname;
  const allNavLinks = Array.from(navList.querySelectorAll('a'));

  // Find all nav links that point to the current page (with or without hash)
  const pageLinks = allNavLinks.filter(function (link) {
    try {
      return new URL(link.href, location.origin).pathname === currentPath;
    } catch (e) {
      return false;
    }
  });

  if (!pageLinks.length) return;

  // Separate hash links (e.g. services.html#pricing) from the base page link
  const hashLinks = pageLinks.filter(function (link) {
    return new URL(link.href, location.origin).hash;
  });

  // No hash links on this page — nothing to spy on
  if (!hashLinks.length) return;

  // Track which hash-targeted sections are currently in the viewport
  const visibleSections = new Set();

  function updateActivLink() {
    pageLinks.forEach(function (link) {
      const hash = new URL(link.href, location.origin).hash.slice(1);

      // Hash link: active if its section is visible
      // Base page link: active only when no hash sections are visible
      const isActive = hash
        ? visibleSections.has(hash)
        : visibleSections.size === 0;

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });
      updateActivLink();
    },
    {
      // Section is "active" when it occupies the upper-middle portion of the viewport
      rootMargin: '-15% 0px -70% 0px',
      threshold: 0,
    }
  );

  // Observe each section that has a corresponding hash nav link
  hashLinks.forEach(function (link) {
    const sectionId = new URL(link.href, location.origin).hash.slice(1);
    const section = document.getElementById(sectionId);
    if (section) observer.observe(section);
  });

  // Set initial state
  updateActivLink();
}
