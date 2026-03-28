(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('[data-scorecard-form]');
    if (!form) return;

    const progressBar = document.querySelector('[data-progress-bar]');
    const progressCopy = document.querySelector('[data-progress-copy]');
    const errorBanner = document.getElementById('scorecard-error');
    const questionCards = Array.from(form.querySelectorAll('[data-question]'));
    const questionNames = questionCards.map((card) => card.dataset.question);

    function getCheckedValue(name) {
      const checked = form.querySelector(`input[name="${name}"]:checked`);
      return checked ? Number(checked.value) : null;
    }

    function countAnswered() {
      return questionNames.reduce((count, name) => count + (getCheckedValue(name) ? 1 : 0), 0);
    }

    function updateProgress() {
      const answered = countAnswered();
      const percent = Math.round((answered / questionNames.length) * 100);
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', String(percent));
      }
      if (progressCopy) progressCopy.textContent = `${answered} of ${questionNames.length} answered`;
    }

    function clearMissingState(target) {
      const card = target && target.closest ? target.closest('.question-card') : null;
      if (card) card.classList.remove('is-missing');
      if (errorBanner) errorBanner.classList.remove('show');
    }

    form.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener('change', function () {
        clearMissingState(this);
        updateProgress();
      });
      input.addEventListener('click', function () {
        clearMissingState(this);
        updateProgress();
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const values = [];
      let firstMissing = null;
      questionNames.forEach((name) => {
        const selected = getCheckedValue(name);
        const card = form.querySelector(`[data-question="${name}"]`);
        if (!selected) {
          if (card) card.classList.add('is-missing');
          if (!firstMissing) firstMissing = card;
        } else {
          if (card) card.classList.remove('is-missing');
          values.push(selected);
        }
      });
      updateProgress();
      if (values.length !== questionNames.length) {
        if (errorBanner) errorBanner.classList.add('show');
        if (firstMissing) firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const analysis = window.SCORECARD ? window.SCORECARD.analyze(values) : null;
      const encoded = window.SCORECARD ? window.SCORECARD.encodeAnswers(values) : values.join('');
      if (!analysis) return;
      const params = new URLSearchParams({ a: encoded, t: String(analysis.total), gaps: analysis.topGaps.join(',') });
      window.location.href = `${analysis.bucket.file}?${params.toString()}`;
    });

    updateProgress();
    setTimeout(updateProgress, 50);
    window.addEventListener('pageshow', updateProgress);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) setTimeout(updateProgress, 0); });
  });
})();
