export function displayLoadingSpin (target) {
  target.innerHTML = `
  <div class="w-100 d-flex justify-content-center align-items-center">
    <div class="spinner-grow text-light" role="status">
      <span class="visually-hidden">spinner</span>
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

export function setDisplaySettingPanelClass (displaySetting) {
  switch (displaySetting) {
    case 'grid':
      document.querySelector('[data-display="grid"]').classList.add('btn-primary')
      document.querySelector('[data-display="list"]').classList.add('btn-link', 'unchecked')
      break
    case 'list':
      document.querySelector('[data-display="list"]').classList.add('btn-primary')
      document.querySelector('[data-display="grid"]').classList.add('btn-link', 'unchecked')
  }
}

export function toggleDisplaySettingPanelClass () {
  document.querySelector('[data-display="grid"]').classList.toggle('btn-link')
  document.querySelector('[data-display="grid"]').classList.toggle('btn-primary')
  document.querySelector('[data-display="grid"]').classList.toggle('unchecked')
  document.querySelector('[data-display="list"]').classList.toggle('btn-link')
  document.querySelector('[data-display="list"]').classList.toggle('btn-primary')
  document.querySelector('[data-display="list"]').classList.toggle('unchecked')
}

export function displayMovieCard (dataArray, target, itemPerPage, currentPage, highlight = false, keyword) {
  target.innerHTML = ''
  const sliceArray = dataArray.slice(itemPerPage * (currentPage - 1), itemPerPage * currentPage)
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
        <p class="card-title fs-5 m-3">${movieTitle}</p>
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

export function displayMovieList (dataArray, target, itemPerPage, currentPage, highlight = false, keyword) {
  target.innerHTML = ''
  target.insertAdjacentHTML('afterbegin', `
    <ul class="list-group list-group-flush w-100" id="movieList">
    </ul>
  `)
  const sliceArray = dataArray.slice(itemPerPage * (currentPage - 1), itemPerPage * currentPage)
  let movieIndex = itemPerPage * (currentPage - 1) + 1
  sliceArray.forEach(data => {
    let favoriteIconClass = ''
    data.favorite === true
      ? favoriteIconClass = 'bi bi-star-fill'
      : favoriteIconClass = 'bi bi-star'
    let movieTitle
    highlight === true
      ? movieTitle = highlightText(data.title, keyword)
      : movieTitle = data.title
    document.querySelector('#movieList').innerHTML += `
    <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
      <span class="list-movie-title">${movieIndex}. ${movieTitle}</span>
      <div class="inline-block">
        <button type="button" class="btn btn-primary" data-class="detail" data-id="${data.id}"
        data-bs-toggle="modal" data-bs-target="#movieModal">
          Detail
        </button>
        <button type="button" class="btn btn-warning" data-class="favorite" data-id="${data.id}">
          <i class="${favoriteIconClass}" data-class="favorite" data-id="${data.id}"></i>
        </button>
      </div>
    </li>
    `
    movieIndex++
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
    case 'index':
      workingFilterBadgeClass = 'genres-filter btn btn-warning'
      break
    default:
      workingFilterBadgeClass = 'bg-warning'
  }
  movieDetailObject.genres.forEach(genre => {
    badges += `
    <span class="badge ${workingFilterBadgeClass} text-dark me-1" data-genre="${genre}">
      ${genresMap[genre]}
    </span>`
  })
  return badges
}

export function displayEmptyMovieModal (target) {
  target.innerHTML = `
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <p class="modal-title" id="movieModalLabel"></p>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="w-100 d-flex justify-content-center align-items-center">
          <div class="spinner-grow text-light" role="status">
            <span class="visually-hidden">spinner</span>
          </div>
          <span class="m-3 text-light">Downloading...</span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-dark d-none d-md-inline-block" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>`
}

export function displayMovieModal (movieDetailObject, genresObject, target, pageStatus) {
  const badges = getGenresBadges(movieDetailObject, genresObject, pageStatus)
  target.innerHTML = `
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <p class="modal-title fs-5" id="movieModalLabel">${movieDetailObject.title}</p>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row row-movie-information mb-3 flex-column flex-md-row">
          <div class="col col-movie-poster mb-2 mb-md-0">
            <img src="https://raw.githubusercontent.com/ALPHACamp/movie-list-api/master/public/posters/${movieDetailObject.image}" class="w-100" alt="movie poster">
            <span class="poster-draggable-hint d-flex justify-content-center align-items-center">
              <i class="bi bi-arrows-move"></i>
            </span>
          </div>
          <div class="col col-movie-description h-100">
            <p>${movieDetailObject.description}</p>
            <span class="description-draggable-hint d-flex justify-content-center align-items-center">
              <i class="bi bi-arrow-down"></i>
            </span>
          </div>
        </div>
        <div class="row row-genres-badges mb-1">
          <div class="col">${badges}</div>
        </div>
        <div class="row justify-content-between movie-director-date">
          <p class="col-auto">Director: ${movieDetailObject.director}</p>
          <p class="col-auto">Release date: ${movieDetailObject.release_date}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-dark d-none d-md-inline-block" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>`
}

export function displayPagination (dataArray, target, itemPerPage, lastClickedPageNumber = 1) {
  target.innerHTML = ''
  const paginationLength = Math.ceil(dataArray.length / itemPerPage)
  for (let i = 1; i <= paginationLength; i++) {
    i === lastClickedPageNumber
      ? target.innerHTML += `
      <li class="page-item active"><a class="page-link">${lastClickedPageNumber}</a></li>`
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

export function hideDraggableHintIconWhenDrag (event) {
  document.querySelector('.row-movie-information').addEventListener('touchstart', event => {
    setOpacity(event.target.tagName, 0)
  })
  document.querySelector('.row-movie-information').addEventListener('touchend', event => {
    setOpacity(event.target.tagName, 1)
  })
}

function setOpacity (target, opacity) {
  switch (target) {
    case 'IMG':
      document.querySelector('.poster-draggable-hint').style.opacity = opacity
      break
    case 'P':
      document.querySelector('.description-draggable-hint').style.opacity = opacity
  }
}
