const baseUrl = 'https://movie-list.alphacamp.io/'
const indexUrl = baseUrl + 'api/v1/movies'
const posterUrl = baseUrl + 'posters/'
const movies = []
let filteredMovies = []
const moviesPage = 12
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const paginator = document.querySelector('#paginator')
const searchInput = document.querySelector('#search-input')


searchForm.addEventListener('submit', function formSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) => 
    movie.title.toLowerCase().includes(keyword)
  )
  if (filteredMovies.length === 0) {
    return alert('cannot find movies with keyword')
  }
  renderPaginator(filteredMovies.length)
  renderMoviesList(getMoviesPage(1))

})

function renderMoviesList(data) {
  let rawHTML = ''
  data.forEach((item) => {

    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${posterUrl + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class='btn btn-primary btn-show-movie' data-bs-toggle='modal'
                data-bs-target='#movie-modal' data-id ='${item.id}'>More</button>
              <button class="btn btn-info btn-add-favorite" data-id='${item.id}'>+</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// 
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / moviesPage)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page = '${page}'>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 分頁器使用函式
function getMoviesPage(page) {
  const startIndex = (page - 1) * moviesPage
  const data = filteredMovies.length ? filteredMovies : movies
  return data.slice(startIndex, startIndex + moviesPage)
}

// 加入favorite 所使用的函式
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(indexUrl + '/' + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'release date ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src='${posterUrl + data.image}' alt='movie-poster' class="img-fluid">`
  })
}

// 監聽器
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 分頁監聽器
paginator.addEventListener('click', function paginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMoviesList(getMoviesPage(page))
})

axios
  .get(indexUrl)
  .then((response) => {
    // 如果沒有加...console.log(movies)結果會是兩層的陣列，加...可以改善成一層陣列
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMoviesList(getMoviesPage(3))
  })
  .catch((err) => console.log(err))