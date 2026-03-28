(function () {
  const page = document.querySelector('[data-result-page]');
  if (!page || !window.SCORECARD) return;

  const expected = page.dataset.resultPage;
  const params = new URLSearchParams(window.location.search);
  const answers = SCORECARD.decodeAnswers(params.get('a'));
  if (!answers) {
    window.location.href = 'scorecard.html';
    return;
  }

  const analysis = SCORECARD.analyze(answers);
  if (!analysis) {
    window.location.href = 'scorecard.html';
    return;
  }

  if (analysis.bucket.key !== expected) {
    const redirectParams = new URLSearchParams({
      a: SCORECARD.encodeAnswers(answers),
      t: String(analysis.total),
      gaps: analysis.topGaps.join(',')
    });
    window.location.replace(`${analysis.bucket.file}?${redirectParams.toString()}`);
    return;
  }

  document.querySelectorAll('[data-score-total]').forEach((node) => {
    node.textContent = `${analysis.total}/60`;
  });

  const shareUrl = `${window.location.origin || ''}${window.location.pathname}?a=${SCORECARD.encodeAnswers(answers)}&t=${analysis.total}&gaps=${analysis.topGaps.join(',')}`;
  document.querySelectorAll('[data-copy-url], [data-share-url]').forEach((button) => {
    button.dataset.copyUrl = shareUrl;
    button.dataset.shareUrl = shareUrl;
  });

  const shareNode = document.querySelector('[data-computed-share-url]');
  if (shareNode) shareNode.textContent = shareUrl;

  const gapList = document.querySelector('[data-gap-list]');
  if (gapList) {
    gapList.innerHTML = '';
    analysis.topGaps.forEach((key) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = SCORECARD.config.categoryNames[key];
      gapList.appendChild(span);
    });
  }

  const categoryList = document.querySelector('[data-category-list]');
  if (categoryList) {
    categoryList.innerHTML = '';
    SCORECARD.config.categoryOrder.forEach((key) => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `<strong>${SCORECARD.config.categoryNames[key]}</strong><span>${analysis.categoryAverages[key].toFixed(1)}/5 · ${SCORECARD.status(analysis.categoryAverages[key])}</span>`;
      categoryList.appendChild(item);
    });
  }

  document.querySelectorAll('[data-result-hidden]').forEach((field) => {
    const map = {
      score_total: analysis.total,
      result_bucket: analysis.bucket.title,
      share_url: shareUrl,
      top_gap_1: SCORECARD.config.categoryNames[analysis.topGaps[0]] || '',
      top_gap_2: SCORECARD.config.categoryNames[analysis.topGaps[1]] || '',
      top_gap_3: SCORECARD.config.categoryNames[analysis.topGaps[2]] || '',
      answers: SCORECARD.encodeAnswers(answers)
    };
    field.value = map[field.dataset.resultHidden] || '';
  });
})();