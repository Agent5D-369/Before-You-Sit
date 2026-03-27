const SCORECARD = (() => {
  const config = {
    questions: [
      { id: 'q1', category: 'screening' },
      { id: 'q2', category: 'screening' },
      { id: 'q3', category: 'roles' },
      { id: 'q4', category: 'roles' },
      { id: 'q5', category: 'thresholds' },
      { id: 'q6', category: 'thresholds' },
      { id: 'q7', category: 'containment' },
      { id: 'q8', category: 'containment' },
      { id: 'q9', category: 'integrity' },
      { id: 'q10', category: 'integrity' },
      { id: 'q11', category: 'aftercare' },
      { id: 'q12', category: 'aftercare' }
    ],
    categoryOrder: ['screening','roles','thresholds','containment','integrity','aftercare'],
    categoryNames: {
      screening: 'Screening and discernment',
      roles: 'Role clarity',
      thresholds: 'Crisis thresholds',
      containment: 'Containment capacity',
      integrity: 'Integrity and safety culture',
      aftercare: 'Communication and aftercare'
    },
    buckets: {
      fragile: { key:'fragile', title:'Fragile Container', file:'results-fragile-container.html', min:12, max:27, badgeClass:'fragile' },
      heart: { key:'heart', title:'Heart-Led, Underprepared', file:'results-heart-led-underprepared.html', min:28, max:39, badgeClass:'heart' },
      reactive: { key:'reactive', title:'Reactive, Not Ready', file:'results-reactive-not-ready.html', min:40, max:50, badgeClass:'reactive' },
      grounded: { key:'grounded', title:'Grounded and Guarded', file:'results-grounded-and-guarded.html', min:51, max:60, badgeClass:'grounded' }
    }
  };
  function decodeAnswers(str) {
    if (!str || typeof str !== 'string') return null;
    const cleaned = str.replace(/[^1-5]/g, '');
    if (cleaned.length !== 12) return null;
    return cleaned.split('').map(Number);
  }
  function encodeAnswers(values) { return values.join(''); }
  function analyze(values) {
    const total = values.reduce((sum, value) => sum + value, 0);
    const categoryAverages = {};
    config.categoryOrder.forEach((key) => categoryAverages[key] = []);
    config.questions.forEach((question, index) => categoryAverages[question.category].push(values[index]));
    Object.keys(categoryAverages).forEach((key) => {
      const list = categoryAverages[key];
      categoryAverages[key] = Number((list.reduce((a,b) => a+b, 0) / list.length).toFixed(2));
    });
    const topGaps = Object.entries(categoryAverages).sort((a,b) => a[1] - b[1]).slice(0,3).map(([key]) => key);
    let bucket = config.buckets.fragile;
    Object.values(config.buckets).forEach((candidate) => { if (total >= candidate.min && total <= candidate.max) bucket = candidate; });
    return { total, categoryAverages, topGaps, bucket };
  }
  function status(value) {
    if (value <= 2.4) return 'Critical gap';
    if (value <= 3.4) return 'Unstable';
    if (value <= 4.2) return 'Functional but vulnerable';
    return 'Strong';
  }
  return { config, decodeAnswers, encodeAnswers, analyze, status };
})();
