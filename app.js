'use strict';

const SEARCH_URL = 'https://api.edamam.com/search';
const API_ID = '78cf2ab0';
const API_KEY = '92dd621055244e3a5dad9c0b3e409002'; // later this should be secure

const STORE = {
  results: {},
  appState: 'genSrch' // options = genSrch, advSrch, results
};

const EL = {
  panel: $('.panel'),
  recOfDay: $('#recipe-of-the-day'),

  genSrch: $('#search-main'),
  genSrchInput: $('#search-input'),
  ingredSrchInput: $('#add-ingredients'), 
  genSrchFrm: $('#gen-search-form'),
  advSrchBtn: $('#get-adv-search'),
  advSrch: $('#adv-search'),
  advSrchFrm: $('#adv-search-form'),
  advSrchInput: $('#adv-search-input'),
  advSrchDiet: $('#adv-search-input-diet'),
  advSrchHealth: $('#adv-search-input-health'),
  advSrchCals: $('#adv-search-input-cals'),
  resNewSrchBtn: $('#results-new-search'),

  results: $('#search-results'), // overall panel
  resultsCntr: $('#results-container'), // where the list goes inside panel
  resultHeader: $('#search-results-header'),
  resFiltBtn: $('#results-filter'),
  resSortBtn: $('#results-sort'),
  resPrevBtn: $('#results-prev-btn'),
  resNextBtn: $('#results-next-btn'),
};

function resSort (prop) {
  STORE.results.sort((a,b)=>{
    if (a.recipe[prop] < b.recipe[prop]) {
      return -1;
    } else if (a.recipe[prop] > b.recipe[prop]) {
      return 1;
    } else {
      return 0;
    }
  });
  render();
}

function resFilt (prop, value, comparison) {
  // change this to be case in-sensitive
  // use prop.search(value) for word/character searches, returns -1 if no match
  let newArr = [];
  if (comparison ==='includes') {
    newArr = STORE.results.filter(item=>item.recipe[prop].includes(value));    
  } else if ( comparison ==='excludes') {
    newArr = STORE.results.filter(item=>!item.recipe[prop].includes(value));  
  } else if ( comparison ==='greater') {
    newArr = STORE.results.filter(item=>item.recipe[prop] >= value);  
  } else if ( comparison ==='less') {
    newArr = STORE.results.filter(item=>item.recipe[prop] <= value);  
  } else if ( comparison ==='not') {
    newArr = STORE.results.filter(item=>item.recipe[prop] !== value); 
  } else {
    newArr = STORE.results.filter(item=>item.recipe[prop] === value);  
  }
  STORE.results = newArr.slice();
  render();
}

function resPrev () {
  
}

function resNext () {
  
}  

function resetStore(){
  delete STORE.results;
  delete STORE.query;
} 

function formatStoreHtml() {
  STORE.results.forEach((cv,idx)=>{
    STORE.results[idx].recipe.details = 
      `<div class='results-recipe-details'>
      <h3 class='results-recipe-name'>${cv.recipe.label}</h3>
      <p>Serves ${cv.recipe.yield}</p>
      <div class='results-recipe-image-container'>
        <a href="${cv.recipe.url}" target="_blank"><img src="${cv.recipe.image}"/></a>
      </div> 
      <div class='results-recipe-details-full'>
        <div class='results-recipe-cals-brief'>
          <h4>${cv.recipe.calsServing}</h4>
          <p>per serving</p>
        </div>
        <div class='results-recipe-ingredients'>
          <ul class='results-recipe-ingredients'>Ingredients:${cv.recipe.ingredientLi.join(' ')}</ul>
        </div><!--end results-recipe-ingredients-->
        <div class='results-recipe-health'>
          <ul class='results-recipe-health'>Health Criteria:${cv.recipe.healthLi.join(' ')}</ul>
        </div><!--end results-recipe-health-->
        <div class='results-recipe-diet'>
          <ul class='results-recipe-diet'>Dietary Restrictions:${cv.recipe.dietLi.join(' ')}</ul>
        </div><!--end results-recipe-diet-->
        <div class='results-recipe-cautions'>
          <ul class='results-recipe-cautions'>Cautions:${cv.recipe.cautionsLi.join(' ')}</ul>
        </div><!--end results-recipe-cautions-->
        <div class='results-recipe-nutrTable'>
          <h6>Nutrition Information:</h6>${cv.recipe.nutrTable}
        </div><!--end results-recipe-nutrTable-->
      </div><!--end results-recipe-details-full-->
    </div><!--end results-recipe-list-->`;
  
  STORE.results[idx].recipe.htmlList =
    `<div class='results-recipe-list'>
      <h3 class='results-recipe-name'>${cv.recipe.label}</h3>
      <p>Serves ${cv.recipe.yield}</p>
      <div class='results-recipe-thumbnail-container'>
        <a href="${cv.recipe.url}" target="_blank"><img src="${cv.recipe.image}"/></a>
      </div> 
      <div class='results-recipe-details-brief'>
         <div class='results-recipe-cals-brief'>
          <h4>${cv.recipe.calsServing}</h4>
          <p>per serving</p>
        </div>
        <div class='results-recipe-ingredients'>
          <ul class='results-recipe-ingredients'>
            ${cv.recipe.ingredientLi[0]}
            ${cv.recipe.ingredientLi[1]}
            ${cv.recipe.ingredientLi[2]}
           </ul>
          <p class='seeMore'>...see more</p>        
        </div><!--end results-recipe-ingredients-->
      </div><!--end results-recipe-details-brief-->
      ${STORE.results[idx].recipe.details}
    </div><!--end results-recipe-list-->`;
    // not currently using cv.recipe.shareAs
  }); // end forEach
}

// reads raw data from STORE and manipulates it for use in rendering (saves in store, doesn't render)
function preformatStore(){
  STORE.results.forEach((cv,idx)=>{
    // combine totalDaily and totalNutrients
    // STORE.results[idx].recipe.nutrition = {};
    for (let prop in cv.recipe.totalDaily) {
      STORE.results[idx].recipe.totalDaily[prop].labelNutr = STORE.results[idx].recipe.totalNutrients[prop].label;
      STORE.results[idx].recipe.totalDaily[prop].quantityNutr = STORE.results[idx].recipe.totalNutrients[prop].quantity;
      STORE.results[idx].recipe.totalDaily[prop].unitNutr = STORE.results[idx].recipe.totalNutrients[prop].unit;
    }
    // convert nutritiion into an html table
    let trTd = '';
    for (let prop in cv.recipe.totalDaily){
      trTd += `<tr>
      <td>${cv.recipe.totalDaily[prop].label}</td>
      <td>${cv.recipe.totalDaily[prop].quantityNutr}</td>
      <td>${cv.recipe.totalDaily[prop].unitNutr}</td>
      <td>${cv.recipe.totalDaily[prop].quantity}</td>
      <td>${cv.recipe.totalDaily[prop].unit}</td>
      </tr>`;
    }

    let th = '<tr><th>Nutrient</th><th>Qty/Serving</th><th>Unit</th><th>Daily Value</th><th>% Daily Value</th></tr>';
    STORE.results[idx].recipe.nutrTable = `<table class='results-recipe-nutrTable'> ${th} ${trTd} </table>`;
    // convert list items into html li
    STORE.results[idx].recipe.ingredientLi = cv.recipe.ingredientLines.map((x,idx) => `<li>${cv.recipe.ingredientLines[idx]}</li>`);
    STORE.results[idx].recipe.healthLi = cv.recipe.healthLabels.map((x,idx) => `<li>${cv.recipe.healthLabels[idx]}</li>`);
    STORE.results[idx].recipe.dietLi = cv.recipe.dietLabels.map((x,idx) => `<li>${cv.recipe.dietLabels[idx]}</li>`);
    STORE.results[idx].recipe.cautionsLi = cv.recipe.cautions.map((x,idx) => `<li>${cv.recipe.cautions[idx]}</li>`);
    STORE.results[idx].recipe.calsServing = cv.recipe.calories/cv.recipe.yield;
  }); // end map
}

// get advanced search data from drop-down menu options
// select.options[select.selectedIndex].value)

// 4 CALLBACK FUNCTION TO DISPLAY DATA, CALLED FROM 3: getDataFromApi();
function loadResults(data) {
  STORE.results = data.hits.slice();
  STORE.query = data.params; // use a filter not to store app_id, app_key, sane...  
  preformatStore();
  formatStoreHtml();
  render();
}

function loadRecipeOfDay(data) {
  STORE.results = data.hits.slice();
  STORE.query = data.params; // use a filter not to store app_id, app_key, sane...  
  preformatStore(); // do exactly the same as the store to avoid re-writing that
  formatStoreHtml();
  STORE.recipeOfDay = Object.assign({},STORE.results[0].recipe); // copy recipe of day to a separate part of store
  renderRecipeOfDay(); // render to screen
  resetStore(); 
}

function getRecipeOfDay() {
  let theDate = new Date();
  let m = parseInt(theDate.getMonth()); 
  let d = parseInt(theDate.getDate());
  let d2 = d++;
  let w = parseInt(theDate.getDay());
  let topic = ['lemon','pear','berry','egg','grill','summer','green','roast','bake','squash','harvest','rich','red'];
  let health = ['vegan','tree-nut-free','vegetarian','peanut-free','vegan','tree-nut-free','vegetarian','peanut-free','peanut-free'];
  let i = m; // index (topic) is per month
  if (w===2) {i--;} else if (w>5) {i++;} // Tues, use last month's topic, Fri-Sat use next month's
  const query = {
    q: topic[i],
    app_id: API_ID,
    app_key: API_KEY,
    health: health[4],
    from: 0,
    to: 5
  };
  $.getJSON(SEARCH_URL, query, loadRecipeOfDay);
};

// 3 CALLED FROM 2 watchSubmit() >>> RECEIVE QUERY & CALLBACK FUNCTION 4
function getResultsFromApi(searchTerm, callback) {
  const query = {
    q: searchTerm,
    app_id: API_ID,
    app_key: API_KEY,
    health: 'peanut-free',
    from: 50,
    to: 100
  };
  $.getJSON(SEARCH_URL, query, callback);
};

// 2 APPLY EVENT LISTENERS TO DOM
// right now this = genSrch, advSrch is same, except more fields
function watchSubmit() {
  EL.genSrchFrm.submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find(EL.genSrchInput);
    const query = queryTarget.val();
    STORE.appState = 'results'; // change app state    
    queryTarget.val(''); // clear out the input    
    getResultsFromApi(query, loadResults); // >>>>> TO 3, PASS IN QUERY & FUNCTION
  });
  EL.advSrchFrm.submit(event => {
    event.preventDefault();
    const queryTargetTerm = $(event.currentTarget).find(EL.advSrchInput);
    const queryTerm = queryTargetTerm.val();
    const queryTargetDiet = $(event.currentTarget).find(EL.advSrchDiet);
    const queryDiet = queryTargetDiet.val();
    const queryTargetHealth = $(event.currentTarget).find(EL.advSrchHealth);
    const queryHealth = queryTargetHealth.val();
    const queryTargetCals = $(event.currentTarget).find(EL.advSrchCals);
    const queryCals = queryTargetCals.val();
    STORE.appState = 'results';
    queryTargetTerm.val(''); // do this for all 4 fields !!!!!!!!!!!!!!!!!!
    const query = {queryTerm, queryDiet, queryHealth, queryCals};
    getResultsFromApi(query, loadResults); // >>>>> TO 3, PASS IN QUERY & FUNCTION
  });
  EL.advSrchBtn.click(event=>{
    STORE.appState = 'advSrch';
    render();
  });
  EL.resNewSrchBtn.click(event=>{
    STORE.appState = 'genSrch';
    resetStore();
    render();
  });
  EL.resSortBtn.click(event=>{
    STORE.resultsPage = 1;
    resSort('label'); // edit this so that the property is read from the button or a checkbox
    render();
  });
  EL.resFiltBtn.click(event=>{
    STORE.resultsPage = 1;
    resFilt('label', 'Lemon Pudding', 'includes'); // edit this so that the property is read from the button or a checkbox
    render();
  });
}

// 1 DOCUMENT READY
$(getRecipeOfDay);
$(watchSubmit);


