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
(function(){
  function show(el){ if(el) el.classList.add('show'); }
  function hide(el){ if(el) el.classList.remove('show'); }
  async function postForm(form, successTarget, errorTarget, onSuccess){
    const button=form.querySelector('button[type="submit"]');
    const original=button?button.textContent:'';
    hide(errorTarget); hide(successTarget);
    if(button){ button.disabled=true; button.textContent='Sending...'; }
    try{
      const response = await fetch(form.action,{method:'POST', body:new FormData(form), headers:{Accept:'application/json'}});
      if(!response.ok) throw new Error('failed');
      show(successTarget);
      if(typeof onSuccess==='function') onSuccess();
      return true;
    }catch(e){ show(errorTarget); return false; }
    finally{ if(button){ button.disabled=false; button.textContent=original; } }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const unlockForm=document.getElementById('unlock-form');
    if(unlockForm){
      unlockForm.addEventListener('submit', async (event)=>{
        event.preventDefault();
        const ok = await postForm(unlockForm, document.getElementById('gate-success'), document.getElementById('gate-error'), ()=>{
          document.querySelectorAll('.breakdown-hidden').forEach((el)=>el.classList.add('show'));
          const gate=document.querySelector('[data-gate-card]');
          if(gate) gate.classList.remove('gate-card');
          unlockForm.style.display='none';
          const map={first_name:unlockForm.querySelector('[name="first_name"]')?.value||'', name:unlockForm.querySelector('[name="first_name"]')?.value||'', email:unlockForm.querySelector('[name="email"]')?.value||'', role:unlockForm.querySelector('[name="role"]')?.value||'', organization:unlockForm.querySelector('[name="organization"]')?.value||''};
          try{ localStorage.setItem('bysLead', JSON.stringify(Object.assign({}, JSON.parse(localStorage.getItem('bysLead')||'{}'), map))); }catch(e){}
          document.querySelectorAll('[data-autofill]').forEach((field)=>{ const key=field.dataset.autofill; if(!field.value && map[key]) field.value=map[key]; if(!field.value && key==='name' && map.first_name) field.value=map.first_name; });
          const target=document.querySelector('.breakdown-hidden.show'); if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
        });
        return ok;
      }, {capture:true});
    }
    const readForm=document.getElementById('outside-read-form');
    if(readForm){
      readForm.addEventListener('submit', async (event)=>{
        event.preventDefault();
        await postForm(readForm, document.getElementById('readout-success'), document.getElementById('readout-error'), ()=>{
          readForm.style.display='none';
        });
      }, {capture:true});
    }
  });
})();
