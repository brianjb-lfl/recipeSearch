'use strict';

function recSearch(data){
  
  console.log(data.hits);

  let loadItem;
  let ingredTerm;
  let ingredCase;
  
  for (let idx = 0; idx < data.hits.length; idx++){
    console.log('for idx loop L 12');
    loadItem = true;
    ingredTerm = '';
    ingredCase = false;
    if(STORE.srchIngred.length > 1){
      console.log('if ingred loop - L 16');
      for(let i = 1; i < STORE.searchTable.ingTerms.length; i++){
        console.log('begin looping STORE ingred terms');
        ingredTerm = STORE.srchIngred[i].ingred.toLowerCase();
        ingredCase = STORE.srchIngred[i].ingOmit;
        
        for (let j = 0; j < data.hits[idx].recipe.ingredients.length; i++){
          let foundIngred = false;
          console.log('begin looping ingred in recipe')
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
                                                  
    if(loadItem && STORE.srchHealthRest!==''){
      if(!data.hits[idx].recipe.healthLabels.find( hL => hL.toLowerCase() === STORE.srchHealthRest.toLowerCase())){
        loadItem = false;
      }
      else if(data.hits[idx].recipe.healthLabels.length === 0){
        loadItem = false;
      }
    }
    
    if(loadItem && STORE.srchDietRest!==''){
      console.log('checking diet Labels');
      if(!data.hits[idx].recipe.dietLabels.find( dL => dL.toLowerCase() === STORE.srchDietRest.toLowerCase())){
        console.log('d label not found, setting lI to false')
        loadItem = false;
      }
      else if(data.hits[idx].recipe.dietLabels.length === 0){
        console.log('there are no diet labels, setting lI to false')
        loadItem = false;
      }
    }

    if(loadItem && STORE.srchCalsLim > 0){
      if(data.hits[idx].recipe.calories > STORE.srchCalsLim){
        loadItem = false;
      }
    }
  
    if(loadItem){
      STORE.results.push(data.hits[idx]);
    }
  }                                               

render();

}                                               

// ADD TO RENDER
//    if STORE.searchTable.ingTerms.length = 0 ... hide Exclude button - first term must be affirmative
//    if STORE.searchTable.ingTerms.length >= 3 ... hide Add and Exclude buttons