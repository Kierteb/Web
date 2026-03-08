/**
 * tracking.js — GA4 custom event tracking for Google Ads conversions
 * Tracks phone link clicks as 'phone_click' events.
 */

export function initTracking() {
  'use strict';

  if (typeof gtag !== 'function') return;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (!link) return;

    gtag('event', 'phone_click', {
      event_category: 'engagement',
      event_label: link.textContent.trim()
    });
  });
}
