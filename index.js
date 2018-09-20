const SEARCH_URL = 'https://gateway.marvel.com/v1/public/characters';
const ID_URL = 'https://gateway.marvel.com/v1/public/characters/{characterId}';
const PRIV_KEY = 'aaccdca8c0f32bd490d6a26de61f578767240de2';
const PUBLIC_KEY = 'e6d48e51bbc8c11f11a587183af077f6';

function getDataFromApi(searchName, callback) {
  let ts = new Date().getTime();
  let hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
  const query = {
    ts:ts,
    hash:hash,
    nameStartsWith: `${searchName}`,
    limit: 1,
    apikey: PUBLIC_KEY,
  }
  $.getJSON(SEARCH_URL, query, callback).fail(function(err) {
    console.log(err);
  });
}

function displayMarvelSearchData(data) {
  const results = data.data.results.map((results,index) => renderResults(results));
  $('.js-search-results').html(results);
}

function renderResults(result) {
  return `
  <main class="search-results">
    <a><img src ="${result.thumbnail.path}.${result.thumbnail.extension}"></a>
    <h3>${result.name}</h3>
    <p>${result.description}</p>
    <div class="list-buttons">
      <button class="list events-button" data-character-id= "${result.events.items}">Events</button>
      <button class="list stories-button" data-character-id= "${result.stories.items}>Stories</button>
    </div>
  </main>
  `;
}

function handleEventsButton(characterId, callback) {
  $('.js-search-results').on('click', '.events-button', function(event) {
    let eventsData = $(this).data("character-id");
    let ts = new Date().getTime();
    let hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
    const query= {
      ts:ts,
      hash:hash,
      characterId: "eventsData",
      limit: 1,
      apikey: PUBLIC_KEY,
    }
      $.getJSON(ID_URL, query, callback).fail(function(err) {
        console.log(err);
      });
  });
    renderEventsList();
  }

function handleStoriesButton(characterId, callback) {
  $('.js-search-results').on('click', '.stories-button', function(event) {
    let storiesData = $(this).data("character-id");
    let ts = new Date().getTime();
    let hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
    const query= {
      ts:ts,
      hash:hash,
      characterId: "storiesData",
      limit: 1,
      apikey: PUBLIC_KEY,
    }
      $.getJSON(ID_URL, query, callback).fail(function(err) {
        console.log(err);
      });
  });
    renderStoriesList();
}

function renderEventsList(result) {
  return `
    <main class="events-list">
      <a data-events="${result.events.name}"></a>
    </main>
  `;
}

function renderStoriesList(result) {
  return `
  <main class="stories-list">
    <a data-stories="${result.stories.name}"></a>
  </main>
  `;
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
   handleStoriesButton();
 }

 handleAllButtons();
$(watchSubmit);