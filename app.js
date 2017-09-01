'use strict';

const SEARCH_URL = 'https://api.edamam.com/search';
const API_ID = '8bfe7b1c'; // Brian's 78cf2ab0';
const API_KEY = '4e0beba3424268c0b8790e7900489e0f'; // brian's 92dd621055244e3a5dad9c0b3e409002'; // later this should be secure


const STORE = {
  results: [],
  resultsCache: [],
  appState: 'genSrch', // options = genSrch, advSrch, results
  resState: 'filter-off',         // filter-on, filter-off
  listState: 'list',      // details, list
  srchIngred: [],
  srchHealthRest: '',
  srchDietRest: '',
  srchCalsLim: null,
  currPage: 1,
  pageSize: 5,
  nextAPIItem: 0,      // 'from' value for next call under current search terms
  apiItemsInCall: 50   // items to call at a time; 'to' value = nextAPIItem + apiItemsInCall - 1 
};

const EL = {
  panel: $('.panel'),
  recOfDay: $('#recipe-of-the-day'),

  genSrch: $('#search-main'),
  genSrchInput: $('#search-input'),
  ingredSrchInput: $('#add-ingredients'), 
  genSrchFrm: $('#gen-search-form'),
  advSrchBtn: $('#get-adv-search'),
  addIngBtn: $('#add-ingredient-button'),
  excIngBtn: $('#exclude-ingredient-button'),
  advSrch: $('#adv-search'),
  advSrchFrm: $('#adv-search-form'),
  advSrchInput: $('#adv-search-input-term'),
  advSrchDiet: $('#adv-search-input-diet'),
  advSrchHealth: $('#adv-search-input-health'),
  advSrchCals: $('#adv-search-input-cals'),
  resNewSrchBtn: $('#results-new-search'),

  results: $('#search-results'), // overall panel
  resultsCntr: $('#results-container'), // where the list goes inside panel
  resultHeader: $('.search-results-header'),
  resFiltBtn: $('#results-filter'),
  resSortBtn: $('#results-sort'),
  resPrevBtn: $('#results-prev-btn'),
  resNextBtn: $('#results-next-btn'),
  resSeeMoreBtn: $('.results-see-more-btn')
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
  // save the app state as sorted
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
  // STORE.priorResults = the STORE.results;
  // add button on screen to show filter is applied, check once more to remove (reverse that action)
  // save the app state as filtered
  STORE.results = newArr.slice(); // right now this edits the store, with no prior saved state; enhance: save prior state & allow restore
  render();
}

function resetStore(){
  STORE.results = [];
  STORE.query = [];
  STORE.srchIngred = [];
  STORE.srchHealthRest = '';
  STORE.srchDietRest = '';
  STORE.srchCalsLim = null;
  STORE.nextAPIItem = 0;       // 'from' value for next call under current search terms
} 

function formatStoreHtml() {
  STORE.results.forEach((cv,idx)=>{
    STORE.results[idx].recipe.details = 
      `<div class='results-recipe-details row hidden' id='recipe-${idx}-details'>
        <h3 class='results-recipe-name'>${cv.recipe.label}</h3>

        <div class="col col-6">
          <p>Serves ${cv.recipe.yield}</p>
          <div class='results-recipe-image-container'>
            <a href="${cv.recipe.url}" target="_blank"><img src="${cv.recipe.image}"/></a>
          </div> 
          <div class='results-recipe-details-full'>
            <div class='results-recipe-cals-brief'>
              <p>${cv.recipe.calsServing} calories per serving</p>
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
          </div><!--end results-recipe-details-full-->
      </div><!--end col-6>-->

      <div class='results-recipe-nutrTable col col-6'>
          <h6>Nutrition Information:</h6>${cv.recipe.nutrTable}
      </div><!--end results-recipe-nutrTable-->
      <button type='button' class='results-see-more-btn'>close</button> 
    </div><!--end results-recipe-list-->`;
  
    STORE.results[idx].recipe.htmlList =
    `<div class='results-recipe-list row' id='recipe-${idx}-lst'>
      <h3 class='results-recipe-name'>${cv.recipe.label}</h3>

      <div class='col col-3'>
        <div class='results-recipe-thumbnail-container'>
          <a href="${cv.recipe.url}" target="_blank"><img src="${cv.recipe.image}"/></a>
        </div> 
      </div>

      <div class='results-recipe-details-brief col col-9'>
        <div class='results-recipe-cals-brief'>
          <p>${cv.recipe.calsServing} calories per serving</p>
          <p>Serves ${cv.recipe.yield}</p>
        </div>
        <div class='results-recipe-ingredients'>
          <ul class='results-recipe-ingredients'>
            ${cv.recipe.ingredientLi[0]}
            ${cv.recipe.ingredientLi[1]}
            ${cv.recipe.ingredientLi[2]}
           </ul>
          <button type='button' class='results-see-more-btn' id='recipe-${idx}'>see more</button>        
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
      STORE.results[idx].recipe.totalDaily[prop].quantityNutr = Math.round(STORE.results[idx].recipe.totalNutrients[prop].quantity,2);
      STORE.results[idx].recipe.totalDaily[prop].quantity = Math.round(STORE.results[idx].recipe.totalDaily[prop].quantity,2);
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
    STORE.results[idx].recipe.calsServing = Math.round(cv.recipe.calories/cv.recipe.yield*100)/100;
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
    health: health[w],
    from: d,
    to: 8
  };
  $.getJSON(SEARCH_URL, query, loadRecipeOfDay);
};

// 3 CALLED FROM 2 watchSubmit() >>> RECEIVE QUERY & CALLBACK FUNCTION 4

function getResultsFromApi() { // searching ONLY by ingredients b/c other API searches are buggy. Using other search criteria in filter vs. in search.
  const query = {
    q: STORE.srchIngred[0].ingred,
    app_id: API_ID,
    app_key: API_KEY,
    from: STORE.nextAPIItem,
    to: (STORE.nextAPIItem + STORE.apiItemsInCall),
  };
  $.getJSON(SEARCH_URL, query, recSearch);
  STORE.nextAPIItem += STORE.apiItemsInCall;
};

// 2 APPLY EVENT LISTENERS TO DOM
// right now this = genSrch, advSrch is same, except more fields
function watchSubmit() {
  EL.genSrchFrm.submit(event => {
    event.preventDefault();
    if(EL.genSrchInput.val()!==''){
      STORE.srchIngred[0] = {};
      STORE.srchIngred[0].ingred = EL.genSrchInput.val();
      STORE.srchIngred[0].ingOmit = false;
    }

    EL.genSrchInput.val('');

    STORE.appState = 'results'; 
  
    getResultsFromApi(); 
  });

  EL.addIngBtn.on('click', event => { // only allow exclude once we have at least one ingredient via add. Once we hit 3, make the add button hide
    let iCt = STORE.srchIngred.length;
    if(EL.advSrchInput.val() !== ''){
      STORE.srchIngred[iCt] = {};
      STORE.srchIngred[iCt].ingred = EL.advSrchInput.val();
      STORE.srchIngred[iCt].ingOmit = false;
      EL.advSrchInput.val('');
    }
  });

  EL.excIngBtn.on('click', event => {
    let iCt = STORE.srchIngred.length;    
    if(EL.advSrchInput.val() !== ''){
      STORE.srchIngred[iCt] = {};
      STORE.srchIngred[iCt].ingred = EL.advSrchInput.val();
      STORE.srchIngred[iCt].ingOmit = true;
      EL.advSrchInput.val('');
    }
  });

  EL.advSrchFrm.submit(event => {
    event.preventDefault();
    
    if(STORE.srchIngred.length == 0){ // why won't === work here?
      alert('ERROR:  You must add at least one item to your search');
    }
    else{

      if(EL.advSrchDiet.val() !== 'none'){
        STORE.srchDietRest = EL.advSrchDiet.val().toLowerCase();
      }

      if(EL.advSrchHealth.val() !== 'none'){
        STORE.srchHealthRest = EL.advSrchHealth.val().toLowerCase();
      }

      if(EL.advSrchCals.val() > 0){
        STORE.srchCalsLim = EL.advSrchCals.val();
      }

      STORE.appState = 'results';

      EL.advSrchInput.val(''); 
      EL.advSrchDiet.val('none');
      EL.advSrchHealth.val('none');
      EL.advSrchCals.val('');

      getResultsFromApi();

    }

  });

  EL.resPrevBtn.on('click', event => {
    STORE.currPage -= 1;
    render();

  });
  
  EL.resultsCntr.on('click', '.results-see-more-btn', function(event) {
    if(STORE.listState === 'list'){
      STORE.listState = 'details';
      let selItm = $(this).attr('id');
      let trgItm = selItm + '-details';
      $(`#${trgItm}`).removeClass('hidden');
    }
    else{
      STORE.listState = 'list';
      $('.results-recipe-details').addClass('hidden');
    }


  });

  EL.resNextBtn.on('click', event => {
    STORE.currPage += 1;
    render();
  });

  EL.advSrchBtn.click(event=>{
    STORE.appState = 'advSrch';
    render();
  });
  
  EL.resNewSrchBtn.click(event=>{
    console.log('new search clicked');
    STORE.appState = 'genSrch';
    resetStore();
    render();
  });
  EL.resSortBtn.click(event=>{
    STORE.resultsPage = 1;
    resSort('label'); // edit this so that the property is read from the button or a checkbox
    render();
  });

  EL.resFiltBtn.click(event=>{                      // currently set for one filter at a time
    STORE.resultsPage = 1;
    console.log('button click');
    if(STORE.resState === 'filter-off'){
      STORE.resState = 'filter-on';
      console.log(STORE);
      STORE.resultsCache = STORE.results.slice();
      console.log(STORE);
      resFilt('healthLabels', 'Vegetarian', 'includes'); // edit this so that the property is read from the button or a checkbox
    }
    else{
      STORE.resState = 'filter-off';
      STORE.results = STORE.resultsCache.slice();
      //STORE.resultsCache = [];
    }
    EL.resFiltBtn.toggleClass('btn-selected');    
    render();
  });
}

// 1 DOCUMENT READY
$(getRecipeOfDay);
$(watchSubmit);


