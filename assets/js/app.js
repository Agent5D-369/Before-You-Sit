(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav-links]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('[data-copy-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = button.dataset.copyUrl || window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        const original = button.textContent;
        button.textContent = 'Link copied';
        setTimeout(() => button.textContent = original, 1800);
      } catch (_) {
        window.prompt('Copy this link:', url);
      }
    });
  });

  document.querySelectorAll('[data-share-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = button.dataset.shareUrl || window.location.href;
      const title = button.dataset.shareTitle || document.title;
      const text = button.dataset.shareText || 'Take a look at this result.';
      if (navigator.share) {
        try { await navigator.share({ title, text, url }); } catch (_) {}
      } else {
        try {
          await navigator.clipboard.writeText(url);
          const original = button.textContent;
          button.textContent = 'Link copied';
          setTimeout(() => button.textContent = original, 1800);
        } catch (_) {
          window.prompt('Copy this link:', url);
        }
      }
    });
  });

  document.querySelectorAll('[data-ajax-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const successTarget = document.querySelector(form.dataset.successTarget || '');
      const errorTarget = document.querySelector(form.dataset.errorTarget || '');
      const button = form.querySelector('button[type="submit"]');
      if (successTarget) successTarget.classList.remove('show');
      if (errorTarget) errorTarget.classList.remove('show');
      const original = button ? button.textContent : '';
      if (button) {
        button.disabled = true;
        button.textContent = form.dataset.loadingText || 'Sending...';
      }
      try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Failed');
        if (successTarget) successTarget.classList.add('show');
        form.reset();
        if (form.dataset.onSuccess === 'reveal-results') {
          document.querySelectorAll('.breakdown-hidden').forEach((el) => el.classList.add('show'));
          const gate = document.querySelector('[data-gate-card]');
          if (gate) gate.classList.remove('gate-card');
          const contact = document.getElementById('private-readout');
          if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (form.dataset.onSuccess === 'redirect' && form.dataset.redirectUrl) {
          window.location.href = form.dataset.redirectUrl;
          return;
        }
      } catch (_) {
        if (errorTarget) errorTarget.classList.add('show');
      } finally {
        if (button) { button.disabled = false; button.textContent = original; }
      }
    });
  });
})();
