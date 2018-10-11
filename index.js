const SEARCH_URL = 'https://gateway.marvel.com/v1/public/characters';
const PRIV_KEY = 'aaccdca8c0f32bd490d6a26de61f578767240de2';
const PUBLIC_KEY = 'e6d48e51bbc8c11f11a587183af077f6';

function getDataFromApi(searchName, callback) {
  let ts = new Date().getTime();
  let hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
  const query = {
    ts:ts,
    hash:hash,
    nameStartsWith: `${searchName}`,
    limit: 5,
    apikey: PUBLIC_KEY,
  }
  $.getJSON(SEARCH_URL, query, callback).fail(function(err) {
    console.log(err);
  });
}

function displayMarvelSearchData(data) {
  if(data.data.count == 0) {
    noResultsDisplay();
  } else {
    const results = data.data.results.map((results,index) => renderResults(results));
  $('.js-search-results').html(results);
  }
}

function renderResults(result) {
  return `
  <main class="search-results">
    <div class="results-display">
      <a><img src ="${result.thumbnail.path}.${result.thumbnail.extension}"></a>
      <h3>${result.name}</h3>
      <p>${result.description}</p>
      <div class="list-buttons">
        <button class="list events-button" data-character-id= "${result.id}">Events</button>
        <button class="list series-button" data-id-character= "${result.id}">Series</button>
      </div>
    </div>
  </main>
  `;
}

function noResultsDisplay() {
  $('.js-search-results').html(noSearchResults);
  noResultsDisplay();
}

const noSearchResults = `
  <main class="search-results">
      <p>No results found. Please try again.</p>
  </main>
  `;

function handleEventsButton(characterId, callback) {
  $('.js-search-results').on('click', '.events-button', function(event) {
    let eventsData = $(this).data("character-id");
    let ts = new Date().getTime();
    let hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
    const query= {
      ts:ts,
      hash:hash,
      characterId: eventsData,
      limit: 5,
      apikey: PUBLIC_KEY,
    }
    let characterUrl = SEARCH_URL + "/" + eventsData + "/events";
      $.getJSON(characterUrl, query, renderEventsList).fail(function(err) {
        console.log(err);
      });
  });

  }

function handleSeriesButton(characterId, callback) {
  $('.js-search-results').on('click', '.series-button', function(event) {
    let seriesData = $(this).data("id-character");
    let ts = new Date().getTime();
    let hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
    const query= {
      ts:ts,
      hash:hash,
      characterId: seriesData,
      limit: 5,
      apikey: PUBLIC_KEY,
    }
    let characterUrl = SEARCH_URL + "/" + seriesData + "/series";
      $.getJSON(characterUrl, query, renderSeriesList).fail(function(err) {
        console.log(err);
      });
  });
}

function renderEventsList(result) {
  let newHTML = "";
  for(let i =0; i < result.data.results.length; i++) {
    newHTML +=`
    <main class="events-list">
      <div class="events-results">
        <a><img src ="${result.data.results[i].thumbnail.path}.${result.data.results[i].thumbnail.extension}"></a>
        <h2>${result.data.results[i].title}</h2>
        <p>${result.data.results[i].description}</p>
      </div>
    </main>
  `;
  }
  $(".js-search-results").html(newHTML);
}

function renderSeriesList(result) {
  let newHTML = "";
  for(let i =0; i < result.data.results.length; i++){
    newHTML += `
  <main class="series-list">
    <div class="series-results">
      <h2>${result.data.results[i].title}</h2>
      <p>${result.data.results[i].description}</p>
    </div>
  </main>
  `;
  }
  $(".js-search-results").html(newHTML);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
    getDataFromApi(query, displayMarvelSearchData);
  });
}
 function handleAllButtons() {
   handleEventsButton();
   handleSeriesButton();
 }

 handleAllButtons();
$(watchSubmit);