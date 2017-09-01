'use strict';

function renderRecipeOfDay(){
  EL.recOfDay.html(STORE.recipeOfDay.htmlList);
}

function renderResultsHeader(){
  let searchCtHeader = `<h4>${STORE.results.length} found, showing ${STORE.query.from} to ${STORE.query.to}<h4>` ;
  let query = (STORE.query.q) ? `<li>Search Term: ${STORE.query.q}</li>` : '' ;
  let health = (STORE.query.health) ? `<li>Health Criteria: ${STORE.query.health.join(', ')}</li>` : '' ;
  let diet = (STORE.query.diet) ? `<li>Dietary Restrictions: ${STORE.query.diet.join(', ')}</li>` : '' ;
  let cals = (STORE.query.calories) ? `<li>Calories: ${STORE.query.calories}</li>` : '' ;
  
  let searchQueryReadout = `<p>You searched for:</p> <ul> ${query} ${health} ${diet} ${cals} </ul>`;
  EL.resultHeader.html(`${searchCtHeader} ${searchQueryReadout}`);
}

function renderResults(){
  let html = '';
  let max = Math.min(STORE.currPage * STORE.pageSize, STORE.results.length);
  for (let i = (STORE.currPage - 1)*STORE.pageSize; i < max; i++){
    html += STORE.results[i].recipe.htmlList;
  }

  EL.resultsCntr.html(html);
}

function render () {
  EL.panel.addClass('hidden'); // hide all panels
  if (STORE.appState === 'advSrch') {
    EL.advSrch.removeClass('hidden');
  } else if (STORE.appState === 'results') {  
    renderResultsHeader();  
    renderResults();
    EL.results.removeClass('hidden');
  } else { // appstate === genSrch
    console.log('running panel default code');
    renderRecipeOfDay();
    EL.genSrch.removeClass('hidden');    
  }
  
  if(STORE.currPage < 2){
    EL.resPrevBtn.addClass('hidden');
  }
  else {
    EL.resPrevBtn.removeClass('hidden');
  }

  if(STORE.currPage*STORE.pageSize > STORE.results.length){
    EL.resNextBtn.addClass('hidden');
  }
  else{
    EL.resNextBtn.removeClass('hidden');
  }

}