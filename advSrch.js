'use strict';

function recSearch(data){
  
  //console.log(data.hits);
  //console.log('adv search running');

  let loadItem;
  let ingredTerm;
  let ingredCase;
  
  for (let idx = 0; idx < data.hits.length; idx++){
    //console.log('in ingred for loop');
    loadItem = true;
    ingredTerm = '';
    ingredCase = false;
    if(STORE.srchIngred.length > 1){
      for(let i = 1; i < STORE.searchTable.ingTerms.length; i++){
        ingredTerm = STORE.srchIngred[i].ingred.toLowerCase();
        ingredCase = STORE.srchIngred[i].ingOmit;
        let foundIngred;

        for (let j = 0; j < data.hits[idx].recipe.ingredients.length; i++){
          foundIngred = false;
          if (data.hits[idx].recipe.ingredients[j].text.toLowerCase.indexOf(ingredTerm)>0) {
            foundIngred = true;
          }
        }

        if(foundIngred && STORE.srchIngred[i].ingOmit){
          loadItem = false;
        }
        else if(!foundIngred && !STORE.srchIngred[i].ingOmit){
          loadItem = false;
        }
      }                                        
    }
    
    //console.log('running other tests');
    if(loadItem && STORE.srchHealthRest!==''){
      if(!data.hits[idx].recipe.healthLabels.find( hL => hL.toLowerCase() === STORE.srchHealthRest.toLowerCase())){
        loadItem = false;
      }
      else if(data.hits[idx].recipe.healthLabels.length === 0){
        loadItem = false;
      }
    }
    
    if(loadItem && STORE.srchDietRest!==''){
      if(!data.hits[idx].recipe.dietLabels.find( dL => dL.toLowerCase() === STORE.srchDietRest.toLowerCase())){
        loadItem = false;
      }
      else if(data.hits[idx].recipe.dietLabels.length === 0){
        loadItem = false;
      }
    }

    if(loadItem && STORE.srchCalsLim > 0){
      if(data.hits[idx].recipe.calories > STORE.srchCalsLim){
        loadItem = false;
      }
    }
    
    //console.log('checking load status');
    if(loadItem){
      //console.log('load to store');
      STORE.results.push(data.hits[idx]);
    }
  }                                               

  if(STORE.results.length < (STORE.currPage * STORE.pageSize)) {
    //console.log(STORE.results.length + ' results in STORE ... calling again');
    getResultsFromApi();
  }
  else {
    //console.log('have enough items, rendering');
    STORE.appState = 'results';
    render();
  }
}                                               

// ADD TO RENDER
//    if STORE.searchTable.ingTerms.length = 0 ... hide Exclude button - first term must be affirmative
//    if STORE.searchTable.ingTerms.length >= 3 ... hide Add and Exclude buttons