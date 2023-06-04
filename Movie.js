const api_key = "1255afbe5117d144663e9b5b2f51fda4";
const Movies = document.querySelector('.movieList');
const category = document.querySelector('#Category');
const main = document.querySelector('main');
let page = 1;
let endpoint = "Popular";

/* Model */
const Model = {
  Liked_Movies:[]
}

category.addEventListener('change', (e) => {

  e.preventDefault();
  const movies = document.querySelectorAll('.movie-name');
  movies.forEach(element => {
    Movies.removeChild(element)
  })
  endpoint = e.target.value;
  renderMovies();
})

/* Controllers */
async function renderMovies() {
  const {results} = await FetchAndStore(endpoint);
  console.log(results);
  results.forEach((result) => {
    createMovieComponent(result)
  })
}

async function FetchAndStore(endpoint) {
  if (endpoint === "Popular") {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`);
    const data = await response.json();
    return data;
  }
  else if (endpoint === "NowPlaying") {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=${page}`);
    const data = await response.json();
    return data;
  }
  else if (endpoint === "TopRated") {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&page=${page}`);
    const data = await response.json();
    return data;
  }
  else if (endpoint === "UpComing") {
    const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&page=${page}`);
    const data = await response.json();
    return data;
  }
  else {
    return new Error('Please use the correct endpoint!')
  }
}

function createMovieComponent(all) {

  /* Creating Movie Components */
  const movieComponent = document.createElement('section');
  Movies.appendChild(movieComponent);
  movieComponent.className = "movie-name";
  const posterSection = document.createElement('div');
  movieComponent.appendChild(posterSection);
  posterSection.className = "poster";
  const image = document.createElement('img');
  posterSection.appendChild(image);
  image.src = `https://image.tmdb.org/t/p/w500${all.poster_path}`;
  image.alt = `${all.title} poster`;
  image.className = "posterImage";
  const content = document.createElement('div');
  posterSection.appendChild(content);
  content.className = "content";
  const buttons = document.createElement('div');
  posterSection.appendChild(buttons);
  buttons.className = "buttons";
  const movieTitle = document.createElement('h2');
  content.appendChild(movieTitle);
  movieTitle.className = "title";
  movieTitle.textContent = `${all.title}`;
  const Rating = document.createElement('h1');
  content.appendChild(Rating);
  Rating.textContent = `${all.vote_average}`;
  Rating.className = "Movie-rating";
  const likeButton = document.createElement('img');
  likeButton.src = "./img/like.png";
  likeButton.alt = "like-button";
  likeButton.className = "like-button";
  buttons.appendChild(likeButton);

  /* Checking Like */
  if (Model.Liked_Movies.includes(all)) {
    likeButton.src = "http://127.0.0.1:5501/img/like-red.png";
  }

  /* Switching Like Button */
  likeButton.addEventListener('click',(e) => {
    if (e.target.src === "http://127.0.0.1:5501/img/like.png") {
      e.target.src = "http://127.0.0.1:5501/img/like-red.png";
      Model.Liked_Movies.push(all);
    }
    else if (e.target.src === "http://127.0.0.1:5501/img/like-red.png") {
      e.target.src = "http://127.0.0.1:5501/img/like.png";
      Model.Liked_Movies = Model.Liked_Movies.filter(name => name !== all.title);
    }
  })

  /* toggle the movie element */
  movieComponent.addEventListener('mouseenter', (e) => {
    e.target.style.transform = "translateY(-10px)";
    e.target.style.transition = "700ms";
  })
  movieComponent.addEventListener('mouseleave', (e) => {
    e.target.style.transform = "translateY(10px)";
    e.target.style.transition = "700ms";
  })

  /* Creating Popup Components */
  movieTitle.addEventListener('click',() => {
    const categoryIcon = document.querySelector('#categoryIcon');
    categoryIcon.style = "display:none;";
    Movies.style = "display:none;";
    category.style = "display:none;";
    const popup = document.createElement('div');
    popup.className = "popup";
    main.appendChild(popup);
    const popupImage = `https://image.tmdb.org/t/p/w500${all.poster_path}`;
    const popupHTML = ` <img src=${popupImage} alt="popup-img" />
                        <section class="popup-content">
                          <div class="popup-title">
                            <h1>${all.title}</h1>
                          </div>
                          <div class="popup-overview">
                            <h1>Overview</h1>
                            <p>${all.overview}</p>
                          </div>
                          <div class="popup-genres">
                            <h1>Genres</h1>
                            <p>xxxxxxx Genres xxxxxxx</p>
                          </div>
                          <div class="popup-rating">
                            <h1>Rating</h1>
                            <p>${all.vote_average}</p>
                          </div>
                          <div class="popup-productionCompany">
                            <h1>Production Companies</h1>
                            <p>xxxxxxx Production Company xxxxxxx</p>
                          </div>
                        </section>
                        <img src="./img/close.png" alt="close-icon" id="closing-tag"/>
                      `;
    popup.innerHTML = popupHTML;
    console.log(`popup for ${all.title} generate successfully`);
    const cancel_btn = popup.querySelector('#closing-tag');
    cancel_btn.addEventListener('click', () => {
      categoryIcon.style = "display:block;";
      Movies.style = "display:grid;";
      category.style = "display:block;";
      popup.style = "display: none;";
    })
  })
}

renderMovies()

/* Creating Liked Movies */
const likedList = document.querySelector('.Liked');
likedList.addEventListener('click', (e) => {
  e.preventDefault();
  const homeList = document.querySelector('.HOME');
  homeList.style = "background-color: transparent; color: rgba(0,0,0,0.7)";
  likedList.style = "background-color: rgba(0,0,0,0.6); color: white; border-radius: 3rem; padding: 1rem 2rem;"
  
  /* delete all movielists */
  const movies = document.querySelectorAll('.movie-name');
  movies.forEach(movie => {
    Movies.removeChild(movie);
  })

  /* Recreate Liked Movie List */
  Model.Liked_Movies.forEach(model => {
    createMovieComponent(model);
  })
})


/* Handle next or previous pages */
const next = document.querySelector('#next');
const prev = document.querySelector('#previous');

next.addEventListener('click',() => {
  page += 1;
  const movies = document.querySelectorAll('.movie-name');
  movies.forEach(movie => {
    Movies.removeChild(movie);
  })
  renderMovies();
})

prev.addEventListener('click',() => {
  if (page === 1) {
    prev.disabled = true;
  }
  else {
    page -= 1;
    prev.disabled = false;
    const movies = document.querySelectorAll('.movie-name');
    movies.forEach(movie => {
      Movies.removeChild(movie);
    })
    renderMovies();
  }
})

