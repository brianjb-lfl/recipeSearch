'use strict';

const SEARCH_URL = 'https://api.edamam.com/search';
const API_ID = '78cf2ab0';
const API_KEY = '92dd621055244e3a5dad9c0b3e409002'; // later this should be secure

const STORE = {
  results: [],
  appState: 'genSrch', // options = genSrch, advSrch, results
  srchIngred: [],
  srchHealthRest: '',
  srchDietRest: '',
  srchCalsLim: null,
  currPage: 1,
  pageSize: 5,
  nextAPIItem: 0,       // 'from' value for next call under current search terms
  apiItemsInCall: 5   // items to call at a time; 'to' value = nextAPIItem + apiItemsInCall - 1 
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
  resFiltBtn: $('#results-filter'),
  resSortBtn: $('#results-sort'),
  resPrevBtn: $('#results-prev-btn'),
  resNextBtn: $('#results-next-btn'),
};

function resSort () {
  
}

// get advanced search data from drop-down menu options
// select.options[select.selectedIndex].value)


function getResultsFromApi() {
  console.log(STORE.srchIngred[0].ingred);
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

  EL.addIngBtn.on('click', event => {
    let iCt = STORE.srchIngred.length;
    if(EL.advSrchInput.val() !== ''){
      STORE.srchIngred[0] = {};
      STORE.srchIngred[0].ingred = EL.advSrchInput.val();
      STORE.srchIngred[0].ingOmit = false;
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
    
    if(STORE.srchIngred.length == 0){
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
    if(STORE.currPage > 0){
      STORE.currPage -= 1;
      render();
    }
  });
  
  EL.resNextBtn.on('click', event => {
    STORE.currPage += 1;
    if(STORE.results.length < (STORE.currPage * STORE.pageSize)) {
      getResultsFromApi();
    }
    else {
      render();
    }
  });

  EL.advSrchBtn.click(event=>{
    STORE.appState = 'advSrch';
    render();
  });
  
  EL.resNewSrchBtn.click(event=>{
    STORE.appState = 'genSrch';
    // clear the store
    render();
  });
}

// 1 DOCUMENT READY
$(watchSubmit);


