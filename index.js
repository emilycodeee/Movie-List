const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = []
let filterMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
// 搜尋功能

const MOVIES_PER_PAGE = 12

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}" >+</button>
              
            </div>
          </div>
        </div>
      </div>`


  })
  //peocessing

  dataPanel.innerHTML = rawHTML

}

function renderPaginator(amount) {
  // 需要知道幾部電影才可以知道要依序分幾頁
  //math.ceil()無條件進位
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `
<li class="page-item"><a class="page-link" href="#" data-id ="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

//輸入page 回傳該page的電影資料
function getMoviesByPage(page) {

  //movies ? 可能有兩種 movies : filterdMovie 取決於使用者有沒有用搜尋功能

  const data = filterMovies.length ? filterMovies : movies
  //  如果filterMovies是有東西則等於filterMovies 如果沒有，則等於movies
  // page 1 > movies 0 - 11
  // page 2 > movies 12 - 23
  // page 3 > movies 24 - 35
  // ...
  // 頁數起始index
  // const startIndex = page-1
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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

function addToFavorite(id) {
  //list 先把localStorage裡的資料取出，or運算子>如果無資料就給空字串
  // const list = localStorage.getItem('favoriteMovies') || []
  //getItem只能是字串，故記得使用JSON.parse轉回JSON資料

  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已在最愛清單內')
  }


  list.push(movie)
  // console.log(list)
  // JSON.stringify()將資料轉回字串
  // const jsonString = JSON.stringify(list)

  localStorage.setItem('favoriteMovies', JSON.stringify(list))

}


dataPanel.addEventListener('click', function onPanelClickes(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))

  }
})

paginator.addEventListener('click', function onPaginatior(event) {
  if (event.target.tagName !== 'A') return
  //錯誤檢查
  dataID = Number(event.target.dataset.id)
  // console.log(event.target.dataset.id)

  renderMovieList(getMoviesByPage(dataID))
})

searchForm.addEventListener('submit', function onSearchForm(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  // console.log(searchInput.value)
  if (!keyword.length) {
    return alert('Please enter a valid strings')
  }

  //陣列三寶：map()、filter()、reduce()
  //filter()
  // filterMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  //map()
  movies.map(item => {
    if (item.title.toLowerCase().includes(keyword)) {
      filterMovies.push(item)
    }
  })

  // filterMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filterMovies.push(movie)
  //   }
  // }

  if (filterMovies.length === 0) {
    return alert('can not find keyword:' + keyword)
  }
  renderPaginator(filterMovies.length)
  renderMovieList(getMoviesByPage(1))

})



axios.get(INDEX_URL).then((response) => {
  //Attay(80)
  // for (const movie of response.data.results) {
  //   movies.push(movie)
  // }
  // console.log(movies)

  //展開運算

  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
  //展開運算示範
  // const numbers = [1,2,3]
  // movies.push(...[1,2,3])

})

// localStorage.setItem('default_language', 'english')
// console.log(localStorage.getItem('default_language'))
