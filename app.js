'use strict';
/* <button type="submit" id='gen-search-btn'>Search</button>
<button type="button" id="get-adv-search">Adv Search</button>
<button type="button" id="results-filter">Next</button>
<button type="button" id="results-sort">Next</button>
<button type="button" id="results-new-search">Next</button>
<button type="button" id="results-prev-btn">Next</button>
<button type="button" id="results-next-btn">Next</button> */
{/* <form id='adv-search-form'>
<button type="button" id="add-ingredient-button">Add</button>
<button type="button" id="exclude-ingredient-button">Exclude</button>
<button type="submit" id="submit-adv-search-button">Go Search</button>  */}
//          <div id="results-button-ctr">

{/* <div class='panel' id='search-main'>
<form id='gen-search-form'>
<input id='search-input'></input>
<div id='recipe-of-the-day'>
<div class='panel' id='adv-search'>
<div class='panel' id='search-results'>
<div id='results-container'> */}

const SEARCH_URL = 'https://api.edamam.com/search';
const API_ID = '78cf2ab0';
const API_KEY = '92dd621055244e3a5dad9c0b3e409002'; // later this should be secure

const EL = {
  genSrchInput: $('#search-input'),
  ingredSrchInput: $('#add-ingredients'), 
  genSearchFrm: $('#gen-search-form'),
  advSearchFrm: $('#adv-search-form'),
  resFiltBtn: $('#results-filter'),
  resSortBtn: $('#results-sort'),
  resNewSrchBtn: $('#results-new-search'),
  resPrevBtn: $('#results-prev-btn'),
  resNextBtn: $('#results-next-btn'),
  recOfDay: $('#recipe-of-the-day'),
  results: $('#results-container')
};

// 4 CALLBACK FUNCTION TO DISPLAY DATA, CALLED FROM 3: getDataFromApi();
function renderResults(data) {
  console.log(data);
  const results = data.hits.map(function(cv, idx){
    return `
      <li>${cv.recipe.label}</li>
    `;
  });
  EL.results.html(results);
}

// 3 CALLED FROM 2 watchSubmit() >>> RECEIVE QUERY & CALLBACK FUNCTION 4
function getResultsFromApi(searchTerm, callback) {
  const query = {
    q: searchTerm,
    app_id: API_ID,
    app_key: API_KEY
  };
    
  $.getJSON(SEARCH_URL, query, callback);
};

// 2 APPLY EVENT LISTENERS TO DOM
function watchSubmit() {
  EL.genSearchFrm.submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find(EL.genSrchInput);
    const query = queryTarget.val();
    
    // clear out the input
    queryTarget.val('');
    getResultsFromApi(query, renderResults); // >>>>> TO 3, PASS IN QUERY & FUNCTION
  });
}

// 1 DOCUMENT READY
$(watchSubmit);


