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
      const original = button ? button.textContent : '';
      const card = form.closest('.form-card');

      if (successTarget) successTarget.classList.remove('show');
      if (errorTarget) errorTarget.classList.remove('show');

      if (button) {
        button.disabled = true;
        button.textContent = form.dataset.loadingText || 'Sending...';
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Failed');

        if (successTarget) successTarget.classList.add('show');

        const hideForm = form.dataset.hideFormOnSuccess === 'true';
        if (form.dataset.onSuccess === 'reveal-results') {
          document.querySelectorAll('.breakdown-hidden').forEach((el) => el.classList.add('show'));
          const gate = document.querySelector('[data-gate-card]');
          if (gate) gate.classList.remove('gate-card');
          if (card) card.classList.add('has-success');
          form.style.display = 'none';
        } else if (form.dataset.onSuccess === 'redirect' && form.dataset.redirectUrl) {
          window.location.href = form.dataset.redirectUrl;
          return;
        } else if (form.dataset.onSuccess === 'message-only' || hideForm) {
          if (card) card.classList.add('has-success');
          form.style.display = 'none';
        } else {
          form.reset();
        }
      } catch (_) {
        if (errorTarget) errorTarget.classList.add('show');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = original;
        }
      }
    });
  });
})();

(function(){
  const STORAGE_KEY = 'bysLead';
  function readStore(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch(e){ return {}; }
  }
  function writeStore(data){
    const current = readStore();
    const next = Object.assign({}, current, data);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch(e){}
  }
  function captureFormData(form){
    const fd = new FormData(form);
    writeStore({
      first_name: String(fd.get('first_name') || '').trim(),
      name: String(fd.get('name') || fd.get('first_name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      role: String(fd.get('role') || '').trim(),
      organization: String(fd.get('organization') || '').trim()
    });
  }
  document.querySelectorAll('form[data-ajax-form]').forEach((form)=>{
    form.addEventListener('submit', ()=> captureFormData(form), true);
  });
  const stored = readStore();
  document.querySelectorAll('[data-autofill]').forEach((field)=>{
    const key = field.dataset.autofill;
    if (!field.value && stored[key]) field.value = stored[key];
    if (!field.value && key === 'name' && stored.first_name) field.value = stored.first_name;
    if (!field.value && key === 'first_name' && stored.name) field.value = stored.name;
  });
})();
