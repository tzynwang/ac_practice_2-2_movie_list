import * as main from '../generalData.js'

export function displayLoadingSpin (target) {
  target.innerHTML = `
  <div class="w-100 d-flex justify-content-center align-items-center">
    <div class="spinner-grow text-light" role="status">
      <span class="visually-hidden">Movie Data Downloading...</span>
    </div>
    <span class="m-3 text-light">Movie Data Downloading...</span>
  </div>`
}

export function displayFilterBadges (target, genresObject) {
  target.innerHTML = ''
  const allGenresArray = Object.entries(genresObject)
  allGenresArray.forEach(genre => {
    target.insertAdjacentHTML('beforeend', `
    <span class="badge bg-warning text-dark m-1">
      <input class="form-check-input" type="checkbox" id="${genre[1]}Input" value="${genre[0]}">
      <label class="form-check-label ms-1" for="${genre[1]}Input">${genre[1]}</label>
    </span>`)
  })
}

export function displayMovieCard (dataArray, target, cardPerPage, currentPage, highlight = false, keyword) {
  target.innerHTML = ''
  const sliceArray = dataArray.slice(cardPerPage * (currentPage - 1), cardPerPage * currentPage)
  sliceArray.forEach(data => {
    let favoriteIconClass = ''
    data.favorite === true
      ? favoriteIconClass = 'bi bi-star-fill'
      : favoriteIconClass = 'bi bi-star'
    let movieTitle
    highlight === true
      ? movieTitle = highlightText(data.title, keyword)
      : movieTitle = data.title
    target.innerHTML += `
    <div class="col">
      <div class="card h-100 justify-content-between">
        <img src="https://raw.githubusercontent.com/ALPHACamp/movie-list-api/master/public/posters/${data.image}" class="card-img-top" alt="movie poster">
        <p class="card-title h5 m-3">${movieTitle}</p>
        <div class="card-body d-flex align-items-end">
          <button type="button" class="btn btn-primary" data-class="detail" data-id="${data.id}"
          data-bs-toggle="modal" data-bs-target="#movieModal">
            Detail
          </button>
          <button type="button" class="btn btn-warning" data-class="favorite" data-id="${data.id}">
            <i class="${favoriteIconClass}" data-class="favorite" data-id="${data.id}"></i>
          </button>
        </div>
      </div>
    </div>
    `
  })
}

export function displayEmptyMessage (message, target) {
  target.innerHTML = ''
  target.insertAdjacentHTML('afterbegin', `
  <div class="w-100 d-flex justify-content-center align-items-center">
    <p class="my-3">${message}</p>
  </div>
  `)
}

function getGenresBadges (movieDetailObject, genresMap, pageStatus) {
  let badges = ''
  let workingFilterBadgeClass
  switch (pageStatus) {
    case 'favorite':
      workingFilterBadgeClass = 'bg-warning'
      break
    default:
      workingFilterBadgeClass = 'genres-filter btn btn-warning'
  }
  movieDetailObject.genres.forEach(genre => {
    badges += `
    <span class="badge ${workingFilterBadgeClass} text-dark me-1" data-genre="${genre}">
      ${genresMap[genre]}
    </span>`
  })
  return badges
}

export function displayMovieModal (movieDetailObject, target, pageStatus) {
  const badges = getGenresBadges(movieDetailObject, main.templateData.movieGenres, pageStatus)
  target.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <p class="modal-title h5" id="movieModalLabel">${movieDetailObject.title}</p>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row row-movie-information mb-3">
          <div class="col">
            <img src="https://raw.githubusercontent.com/ALPHACamp/movie-list-api/master/public/posters/${movieDetailObject.image}" class="w-100" alt="movie poster">
          </div>
          <div class="col col-movie-description">
            <p>${movieDetailObject.description}</p>
          </div>
        </div>
        <div class="row row-genres-badges mb-1">
          <div class="col">${badges}</div>
        </div>
        <div class="row justify-content-between">
          <div class="col-auto">Director: ${movieDetailObject.director}</div>
          <div class="col-auto">Release date: ${movieDetailObject.release_date}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>`
}

export function displayPagination (dataArray, target, cardPerPage) {
  target.innerHTML = ''
  const paginationLength = Math.ceil(dataArray.length / cardPerPage)
  for (let i = 1; i <= paginationLength; i++) {
    i === 1
      ? target.innerHTML += `
      <li class="page-item active"><a class="page-link">1</a></li>`
      : target.innerHTML += `
      <li class="page-item"><a class="page-link">${i}</a></li>`
  }
}

export function toggleFavoriteIcon (event) {
  if (event.target.tagName === 'I') {
    event.target.classList.toggle('bi-star')
    event.target.classList.toggle('bi-star-fill')
  } else {
    event.target.children[0].classList.toggle('bi-star')
    event.target.children[0].classList.toggle('bi-star-fill')
  }
}

export function updatePaginationActivePage (event) {
  document.querySelector('.page-item.active').classList.toggle('active')
  event.target.parentElement.classList.toggle('active')
}

function highlightText (movieTitle, keyword) {
  const regex = new RegExp(keyword, 'i')
  const index = movieTitle.toLowerCase().indexOf(keyword)
  const originTitleString = movieTitle.slice(index, index + keyword.length)
  return movieTitle.replace(regex, `<span class="highlight">${originTitleString}</span>`)
}

export function collapseAccordion () {
  const accordionButton = document.querySelector('button.accordion-button')
  accordionButton.setAttribute('aria-expanded', false)
  if (!accordionButton.classList.contains('collapsed')) {
    accordionButton.classList.add('collapsed')
  }
  const movieGenres = document.querySelector('#movieGenres')
  movieGenres.classList.remove('show')
}

export function expendAccordion () {
  const accordionButton = document.querySelector('button.accordion-button')
  accordionButton.setAttribute('aria-expanded', true)
  accordionButton.classList.remove('collapsed')
  const movieGenres = document.querySelector('#movieGenres')
  if (!movieGenres.classList.contains('show')) {
    movieGenres.classList.add('show')
  }
}
