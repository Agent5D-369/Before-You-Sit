(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('[data-scorecard-form]');
    if (!form) return;

    const progressBar = document.querySelector('[data-progress-bar]');
    const progressCopy = document.querySelector('[data-progress-copy]');
    const errorBanner = document.getElementById('scorecard-error');
    const questionCards = Array.from(form.querySelectorAll('[data-question]'));
    const questionNames = questionCards.map((card) => card.dataset.question);
    const prevButton = form.querySelector('[data-prev-question]');
    const nextButton = form.querySelector('[data-next-question]');
    const submitButton = form.querySelector('[data-submit-results]');
    const stepCopy = form.querySelector('[data-step-copy]');
    let currentIndex = 0;

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

    function showQuestion(index) {
      currentIndex = Math.max(0, Math.min(index, questionCards.length - 1));
      questionCards.forEach((card, i) => {
        const active = i === currentIndex;
        card.hidden = !active;
        card.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      if (stepCopy) stepCopy.textContent = `Question ${currentIndex + 1} of ${questionCards.length}`;
      if (prevButton) prevButton.disabled = currentIndex === 0;
      const onLast = currentIndex === questionCards.length - 1;
      if (nextButton) nextButton.hidden = onLast;
      if (submitButton) submitButton.hidden = !onLast;
      const activeCard = questionCards[currentIndex];
      if (activeCard) activeCard.scrollIntoView({behavior:'smooth', block:'start'});
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
        const card = this.closest('.question-card');
        const idx = questionCards.indexOf(card);
        if (idx >= 0 && idx < questionCards.length - 1) {
          setTimeout(() => showQuestion(idx + 1), 120);
        } else {
          showQuestion(questionCards.length - 1);
        }
      });
    });

    if (prevButton) prevButton.addEventListener('click', function(){ showQuestion(currentIndex - 1); });
    if (nextButton) nextButton.addEventListener('click', function(){ showQuestion(currentIndex + 1); });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const values = [];
      let firstMissingIndex = -1;
      questionNames.forEach((name, idx) => {
        const selected = getCheckedValue(name);
        const card = form.querySelector(`[data-question="${name}"]`);
        if (!selected) {
          if (card) card.classList.add('is-missing');
          if (firstMissingIndex === -1) firstMissingIndex = idx;
        } else {
          if (card) card.classList.remove('is-missing');
          values.push(selected);
        }
      });
      updateProgress();
      if (values.length !== questionNames.length) {
        if (errorBanner) errorBanner.classList.add('show');
        if (firstMissingIndex > -1) showQuestion(firstMissingIndex);
        return false;
      }
      const analysis = window.SCORECARD ? window.SCORECARD.analyze(values) : null;
      const encoded = window.SCORECARD ? window.SCORECARD.encodeAnswers(values) : values.join('');
      if (!analysis) return false;
      const params = new URLSearchParams({ a: encoded, t: String(analysis.total), gaps: analysis.topGaps.join(',') });
      window.location.href = `${analysis.bucket.file}?${params.toString()}`;
      return false;
    });

    updateProgress();
    showQuestion(0);
    window.addEventListener('pageshow', function(){ updateProgress(); showQuestion(currentIndex); });
  });
})();
