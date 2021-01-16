const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    //title image
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-id="${item.id}"
                data-target="#movie-modal">More</button>
              <button class="btn btn-danger btn-delete" data-id="${item.id}" >X</button>
              
            </div>
          </div>
        </div>
      </div>`


  })
  //peocessing

  dataPanel.innerHTML = rawHTML

}



function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date:' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function deleteFromFavorite(id) {
  //錯誤處理：一旦收藏清單是空的，或傳入的 id 在收藏清單中不存在，就結束這個函式
  if (!movies) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  //錯誤處理：findIndex()如果沒有符合的對象，將返回 -1
  if (movieIndex === -1) return



  if (movies.some((movie) => movie.id === id)) {
    const check = confirm('是否確定要刪除')
    if (check) {
      movies.splice(movieIndex, 1)
      localStorage.setItem('favoriteMovies', JSON.stringify(movies))

    }
  }
}

dataPanel.addEventListener('click', function onPanelClickes(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-delete')) {
    deleteFromFavorite(Number(event.target.dataset.id))
    renderMovieList(movies)
  }
})


renderMovieList(movies)



// localStorage.setItem('default_language', 'english')
// console.log(localStorage.getItem('default_language'))
