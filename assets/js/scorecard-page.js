(function () {
  const form = document.querySelector('[data-scorecard-form]');
  if (!form || !window.SCORECARD) return;
  const progressBar = document.querySelector('[data-progress-bar]');
  const progressCopy = document.querySelector('[data-progress-copy]');
  const errorBanner = document.getElementById('scorecard-error');

  function countAnswered() {
    return SCORECARD.config.questions.filter((question) => form.querySelector(`input[name="${question.id}"]:checked`)).length;
  }

  function updateProgress() {
    const answered = countAnswered();
    const percent = Math.round((answered / SCORECARD.config.questions.length) * 100);
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
      progressBar.setAttribute('aria-valuenow', String(percent));
    }
    if (progressCopy) progressCopy.textContent = `${answered} of ${SCORECARD.config.questions.length} answered`;
  }

  function clearMissingState(target) {
    const card = target?.closest?.('.question-card');
    if (card) card.classList.remove('is-missing');
    if (errorBanner) errorBanner.classList.remove('show');
  }

  form.addEventListener('change', (event) => {
    clearMissingState(event.target);
    updateProgress();
  });

  form.addEventListener('click', (event) => {
    if (event.target.matches('input[type="radio"]')) {
      clearMissingState(event.target);
      window.requestAnimationFrame(updateProgress);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = [];
    let firstMissing = null;
    SCORECARD.config.questions.forEach((question) => {
      const selected = form.querySelector(`input[name="${question.id}"]:checked`);
      const card = form.querySelector(`[data-question="${question.id}"]`);
      if (!selected) {
        card?.classList.add('is-missing');
        if (!firstMissing) firstMissing = card;
      } else {
        card?.classList.remove('is-missing');
        values.push(Number(selected.value));
      }
    });
    if (values.length !== SCORECARD.config.questions.length) {
      if (errorBanner) errorBanner.classList.add('show');
      firstMissing?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const analysis = SCORECARD.analyze(values);
    const params = new URLSearchParams({ a: SCORECARD.encodeAnswers(values), t: String(analysis.total), gaps: analysis.topGaps.join(',') });
    window.location.href = `${analysis.bucket.file}?${params.toString()}`;
  });

  updateProgress();
  window.addEventListener('pageshow', () => setTimeout(updateProgress, 50));
  window.addEventListener('load', () => setTimeout(updateProgress, 0));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTimeout(updateProgress, 0);
  });
})();
