const baseUrl = 'https://movie-list.alphacamp.io/'
const indexUrl = baseUrl + 'api/v1/movies'
const posterUrl = baseUrl + 'posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')


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
              <button class="btn btn-danger btn-remove-favorite" data-id='${item.id}'>X</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function deleteToFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (!movies || !movies.length) return

  if (movieIndex === -1) return

  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  renderMoviesList(movies)
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
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    deleteToFavorite(Number(event.target.dataset.id))
  }
})

renderMoviesList(movies)