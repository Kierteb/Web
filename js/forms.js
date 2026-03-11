/**
 * forms.js — Progressive form validation with accessible error messaging
 * Uses novalidate + custom validation with aria-describedby error regions.
 */

export function initForms() {
  'use strict';

  const forms = document.querySelectorAll('form[novalidate]');
  if (!forms.length) return;

  forms.forEach(function (form) {
    // Live validation on blur
    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(this);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(form);

      const isValid = validateForm(form);

      if (isValid) {
        submitForm(form);
      } else {
        // Focus first invalid field
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  });

  function validateForm(form) {
    let valid = true;

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      if (!validateField(field)) {
        valid = false;
      }
    });

    return valid;
  }

  function validateField(field) {
    const errorId = field.getAttribute('aria-describedby');
    const errorEl = errorId ? document.getElementById(errorId) : null;

    let message = '';

    if (field.required && !field.value.trim()) {
      message = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value)) {
      message = 'Please enter a valid email address.';
    } else if (field.type === 'tel' && field.value.trim() && !isValidPhone(field.value)) {
      message = 'Please enter a valid phone number.';
    }

    if (errorEl) {
      errorEl.textContent = message;
    }

    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  function clearErrors(form) {
    form.querySelectorAll('[role="alert"]').forEach(function (el) {
      el.textContent = '';
    });
    form.querySelectorAll('[aria-invalid]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidPhone(value) {
    // Accepts UK formats: 01234 567890, 07700 900000, +44 7700 900000 etc.
    return /^[\d\s\+\(\)\-]{7,20}$/.test(value.trim());
  }

  function submitForm(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const successMsg = form.closest('[data-form-wrapper]')
      ? form.closest('[data-form-wrapper]').querySelector('.form-success')
      : null;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (res.ok) {
        window.location.href = '/thank-you.html';
      } else {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Enquiry';
        }
        alert('Something went wrong. Please try again or email us directly.');
      }
    })
    .catch(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry';
      }
      alert('Something went wrong. Please try again or email us directly.');
    });
  }
}
