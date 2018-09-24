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
      <button class="list events-button" data-character-id= "${result.id}">Events</button>
      <button class="list stories-button" data-id-character= "${result.id}">Stories</button>
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
      characterId: eventsData,
      limit: 1,
      apikey: PUBLIC_KEY,
    }
    let characterUrl = SEARCH_URL + "/" + eventsData + "/events";
      $.getJSON(characterUrl, query, renderEventsList).fail(function(err) {
        console.log(err);
      });
  });

  }

function handleStoriesButton(characterId, callback) {
  $('.js-search-results').on('click', '.stories-button', function(event) {
    let storiesData = $(this).data("id-character");
    let ts = new Date().getTime();
    let hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
    const query= {
      ts:ts,
      hash:hash,
      characterId: storiesData,
      limit: 1,
      apikey: PUBLIC_KEY,
    }
    let characterUrl = SEARCH_URL + "/" + storiesData + "/events";
      $.getJSON(characterUrl, query, renderStoriesList).fail(function(err) {
        console.log(err);
      });
  });
}

function renderEventsList(result) {
  let newHTML = "";
  for(let i =0; i < data.results.length; i++) {
    newHTML +=`
    <main class="events-list">
      <div data-events="${result.data.thumbnail.path}.${result.data.thumbnail.extention}>"</div>
      <h2 data-events="${result.data.title}></h2>
      <a data-events="${result.data.results}"></a>
    </main>
  `;
  }
  $(".js-search-results").html(newHTML);
}

function renderStoriesList(result) {
  let newHTML = "";
  for(let i =0; i < data.results.length; i++){
    newHTML += `
  <main class="stories-list">
    <div data-stories="${}></div>
    <h2 data-stories="${}></h2>
    <a data-stories="${}"></a>
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
   handleStoriesButton();
 }

 handleAllButtons();
$(watchSubmit);