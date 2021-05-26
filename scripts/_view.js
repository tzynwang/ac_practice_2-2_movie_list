export function displayLoadingSpin (target) {
  target.innerHTML = `
  <div class="w-100 d-flex justify-content-center align-items-center">
    <div class="spinner-grow text-light" role="status">
      <span class="visually-hidden">Movie Data Downloading...</span>
    </div>
    <span class="m-3 text-light">Movie Data Downloading...</span>
  </div>`
}

export function displayMovieCard (dataArray, target, cardPerPage, currentPage) {
  target.innerHTML = ''
  const sliceArray = dataArray.slice(cardPerPage * (currentPage - 1), cardPerPage * currentPage)
  sliceArray.forEach(data => {
    let favoriteIconClass = ''
    data.favorite === true
      ? favoriteIconClass = 'bi bi-star-fill'
      : favoriteIconClass = 'bi bi-star'
    target.innerHTML += `
    <div class="col">
      <div class="card h-100 justify-content-between">
        <img src="https://raw.githubusercontent.com/ALPHACamp/movie-list-api/master/public/posters/${data.image}" class="card-img-top" alt="movie poster">
        <p class="card-title h5 m-3">${data.title}</p>
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

export function displayMovieModal (movieDetailObject, target) {
  target.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <p class="modal-title h5" id="movieModalLabel">${movieDetailObject.title}</p>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body row">
        <div class="col">
          <img src="https://raw.githubusercontent.com/ALPHACamp/movie-list-api/master/public/posters/${movieDetailObject.image}" class="w-100" alt="movie poster">
        </div>
        <div class="col">
          <p>${movieDetailObject.description}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>`
}

export function displayPagination (dataArray, target, cardPerPage) {
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

export function scrollTo (x, y) {
  window.scrollTo(x, y)
}
