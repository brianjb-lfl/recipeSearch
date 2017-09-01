'use strict';

function render () {
  EL.panel.addClass('hidden'); // hide all panels
  if (STORE.appState === 'advSrch') {
    EL.advSrch.removeClass('hidden');
  } else if (STORE.appState === 'results') {    
    let html = '';

    for (let i = (STORE.currPage - 1)*10; i < STORE.currPage * 10; i++){
//    STORE.results.map((cv,idx)=>{
      html += `<li>${STORE.results[i].recipe.label}</li>`;
    }

    EL.resultsCntr.html(html);
    EL.results.removeClass('hidden');
  } else { // appstate === genSrch
    EL.genSrch.removeClass('hidden');    
  }  
}