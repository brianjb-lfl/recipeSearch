'use strict';

const youtube_search_url = 'https://www.googleapis.com/youtube/v3/search';
const apiKey = 'AIzaSyBrGjzU2ONDD5CWm3mtnsIAysPqHHY6-q8'; // later this should be secure

const EL = {
  results: $('.js-search-results'), 
  search: $('.js-search-form'),
  thumbnail: $('.js-video-thumbnail'), // click to show lightbox
  lightbox: 'NEED TO ADD', // actual ligthbox
};


// 4 CALLBACK FUNCTION TO DISPLAY DATA, CALLED FROM 3: getDataFromApi();
function displayThinktubeSearchData(data) {
  const results = data.items.map(function(cv, idx){
    return renderVideoResult(cv, idx);
  })
  EL.results.html(results);
}

// 3 CALLED FROM 2 watchSubmit() >>> RECEIVE QUERY & CALLBACK FUNCTION 4
function getDataFromApi(searchTerm, callback) {
  const query = {
    maxResults: 10,
    part: 'snippet',
    key: apiKey,
    q: `${searchTerm}`,
    order: 'viewCount'
  }
  $.getJSON(youtube_search_url, query, callback);
  console.log($.getJSON(youtube_search_url, query, callback));
};

// 2 APPLY EVENT LISTENERS TO DOM
function watchSubmit() {
  EL.search.submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    
    // clear out the input
    queryTarget.val('');
    getDataFromApi(query, displayThinktubeSearchData); // >>>>> TO 3, PASS IN QUERY & FUNCTION
  });
}

// 1 DOCUMENT READY
$(watchSubmit);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ DISPLAY FEATURES ~~~~~~~~~~~~~~~~~~~~~

// function onPlayerReady(){};
// function onPlayerStateChange(){};

// function onYouTubeIframeAPIReady(id) {
//   let player = new YT.Player(id, { //'player' is the id# from the DOM, where we will insert the iframe
//     height: '390',
//     width: '640',
//     videoId: id, // get this from the JSON
//     events: {
//       'onReady': onPlayerReady,
//       'onStateChange': onPlayerStateChange
//     }
//   });
//   //return player;
// }

function openLightbox(id) { // video0, video1, etc.
  console.log('openLightbox' + id);
  $(`#${id}-lightbox`).removeClass('hidden');
  // add the player? or set player to play?
  //let player = onYouTubeIframeAPIReady(id);
  //$(`'.${videoId}'`).html() ;// populate html with video player
}

function closeLightbox(id) {
  //DOESN'T STOP PLAYING, JUST HIDES
  // detect click outside of lightbox
  console.log('closeLightbox')
  $(`#${id}-lightbox`).addClass('hidden');
}

$("body").on("click", function(e){
    if(!$('this').hasClass("js-video-lightbox")){
      $(".js-video-lightbox").addClass("hidden");
    }
  }
);


// apply event listener to DOM
function handleLightbox() {
  EL.results.on('mouseover', '.js-video-thumbnail', function(event){
    let id = $(this).attr('id');
    console.log('handleLightbox' + id);
    openLightbox(id);
  });
  EL.results.on('click', '.js-video-lightbox', function(event){ // for now, click on the lightbox to close it.
    let id = $(this).attr('id');
    closeLightbox(id);
  });
}

function applyDisplayListeners () {
  handleLightbox();
}

$(applyDisplayListeners);