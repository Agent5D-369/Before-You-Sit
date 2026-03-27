(function () {
  const form = document.querySelector('[data-scorecard-form]');
  if (!form || !window.SCORECARD) return;
  const progressBar = document.querySelector('[data-progress-bar]');
  const progressCopy = document.querySelector('[data-progress-copy]');
  const errorBanner = document.getElementById('scorecard-error');

  function updateProgress() {
    const answered = SCORECARD.config.questions.filter((question) => form.querySelector(`input[name="${question.id}"]:checked`)).length;
    const percent = Math.round((answered / SCORECARD.config.questions.length) * 100);
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressCopy) progressCopy.textContent = `${answered} of ${SCORECARD.config.questions.length} answered`;
  }

  form.addEventListener('change', (event) => {
    const card = event.target.closest('.question-card');
    if (card) card.classList.remove('is-missing');
    if (errorBanner) errorBanner.classList.remove('show');
    updateProgress();
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
})();
