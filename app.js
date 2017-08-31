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
  resFiltBtn: $('#results-filter'),
  resSortBtn: $('#results-sort'),
  resPrevBtn: $('#results-prev-btn'),
  resNextBtn: $('#results-next-btn'),
};

function resSort () {
  
}

function resPrev () {
  
}

function resNext () {
  
}

// get advanced search data from drop-down menu options
// select.options[select.selectedIndex].value)

// 4 CALLBACK FUNCTION TO DISPLAY DATA, CALLED FROM 3: getDataFromApi();
function loadResults(data) {
  STORE.results = data.hits.slice();
  STORE.query = data.params; // use a filter not to store app_id, app_key, sane...  
  render();
}

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
    // clear the store
    render();
  })
}

// 1 DOCUMENT READY
$(watchSubmit);


