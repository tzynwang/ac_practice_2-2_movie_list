import * as controller from './controller.js'
import * as view from './view.js'
import * as utility from './utilities.js'
import * as model from './model.js'

export async function loadIndexPageContents (milliseconds) {
  model.config.pageStatus = 'index'
  view.displayLoadingSpin(model.elementObject.movieCardsSection)
  let retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  // only fetch when localStorage key 'allMovies' has no value
  if (retrieveAllMovies === null) {
    const allMovies = await controller.fetchData(model.config.allMoviesApi)
    controller.saveToLocalStorage('allMovies', allMovies.data.results)
    retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  }
  view.displayFilterBadges(model.elementObject.filter, model.templateData.movieGenres)
  setTimeout(() => {
    view.displayMovieCard(
      retrieveAllMovies, model.elementObject.movieCardsSection, model.config.itemPerPage, model.config.startPage
    )
    view.displayPagination(retrieveAllMovies, model.elementObject.pagination, model.config.itemPerPage)
  }, milliseconds)
}

export function loadFavoritePageContents (milliseconds) {
  model.config.pageStatus = 'favorite'
  view.displayLoadingSpin(model.elementObject.movieCardsSection)
  const allMovies = controller.retrieveFromLocalStorage('allMovies')
  const favoriteMovies = controller.filterFavoriteMovies(allMovies)
  setTimeout(() => {
    if (favoriteMovies.length === 0) {
      view.displayEmptyMessage('Hmm, have no favorite movie yet 😌', model.elementObject.movieCardsSection)
    } else {
      view.displayMovieCard(
        favoriteMovies, model.elementObject.movieCardsSection, model.config.itemPerPage, model.config.startPage
      )
      view.displayPagination(favoriteMovies, model.elementObject.pagination, model.config.itemPerPage)
    }
  }, milliseconds)
}

export async function movieCardInteraction (event) {
  const targetClass = event.target.dataset.class
  switch (targetClass) {
    case 'detail': {
      const movieIdClicked = event.target.dataset.id
      if (model.templateData.movieIdClicked === movieIdClicked) {
        view.displayMovieModal(model.templateData.movieModalDetail, model.templateData.movieGenres, model.elementObject.movieModal, model.config.pageStatus)
        return
      } else {
        model.templateData.movieIdClicked = movieIdClicked
        view.displayEmptyMovieModal(model.elementObject.movieModal)
        const movieDetailApi = `${model.config.allMoviesApi}${event.target.dataset.id}`
        const movieDetailObject = await controller.fetchData(movieDetailApi)
        view.displayMovieModal(movieDetailObject.data.results, model.templateData.movieGenres, model.elementObject.movieModal, model.config.pageStatus)
        model.templateData.movieModalDetail = movieDetailObject.data.results
        return
      }
    }
    case 'favorite':
      view.toggleFavoriteIcon(event)
      controller.addToFavorite(event, 'allMovies')
  }
}

export function paginationInteraction (event, status) {
  const pageNumber = Number(event.target.innerText)
  if (isNaN(pageNumber)) return

  view.updatePaginationActivePage(event)
  const retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  switch (status) {
    case 'index':
      view.displayMovieCard(retrieveAllMovies, model.elementObject.movieCardsSection, model.config.itemPerPage, pageNumber)
      break
    case 'favorite':
      view.displayMovieCard(controller.filterFavoriteMovies(retrieveAllMovies), model.elementObject.movieCardsSection, model.config.itemPerPage, pageNumber)
      break
    case 'search':
      view.displayMovieCard(model.templateData.searchResult, model.elementObject.movieCardsSection, model.config.itemPerPage, pageNumber, true, model.templateData.userInput)
      break
    case 'filter':
      view.displayMovieCard(model.templateData.searchResult, model.elementObject.movieCardsSection, model.config.itemPerPage, pageNumber)
  }
  window.scrollTo(0, 0)
}

export function searchMovieByTitle (userInput) {
  if (utility.isEmptyString(userInput)) {
    model.elementObject.searchInput.classList.add('is-invalid')
    return
  }

  // (if filter) reset filter
  model.elementObject.filterContainer.classList.add('d-none')
  controller.uncheckedAllOptions(document.querySelectorAll('#movieGenres .accordion-body :checked'))
  view.collapseAccordion()

  model.config.pageStatus = 'search'
  model.elementObject.searchInput.value = ''
  if (!document.querySelector('#clearButton')) {
    model.elementObject.searchButton.insertAdjacentHTML('beforebegin', `
    <button class="btn btn-warning" type="button" id="clearButton">Clear search result</button>
    `)
  }
  document.querySelector('#clearButton').addEventListener('click', clearSearchResult)
  model.elementObject.searchInput.classList.remove('is-invalid')
  model.templateData.userInput = userInput
  model.templateData.searchResult = controller.returnSearchMovies(model.templateData.userInput, controller.retrieveFromLocalStorage('allMovies'))

  if (model.templateData.searchResult.length === 0) {
    model.elementObject.searchMessage.textContent = ''
    view.displayEmptyMessage(`No matching results of ${model.templateData.userInput} 😣`, model.elementObject.movieCardsSection)
  } else {
    view.displayMovieCard(model.templateData.searchResult, model.elementObject.movieCardsSection, model.config.itemPerPage, 1, true, model.templateData.userInput)
    model.elementObject.searchMessage.classList.add('mt-3')
    model.elementObject.searchMessage.textContent = `Search results of "${model.templateData.userInput}":`
  }
  view.displayPagination(model.templateData.searchResult, model.elementObject.pagination, model.config.itemPerPage)
  window.scrollTo(0, 0)
}

function clearSearchResult () {
  model.elementObject.searchInput.value = ''
  model.elementObject.searchMessage.textContent = ''
  model.elementObject.searchMessage.classList.remove('mt-3')
  document.querySelector('#clearButton').remove()
  model.elementObject.filterContainer.classList.remove('d-none')
  loadIndexPageContents(250)
}

export function filterMovies () {
  const checkedGenres = document.querySelectorAll('#movieGenres .accordion-body :checked')

  if (checkedGenres.length === 0) {
    model.config.pageStatus = 'index'
    loadIndexPageContents(250)
    return
  }

  model.config.pageStatus = 'filter'
  const checkedArray = []
  checkedGenres.forEach(checked => checkedArray.push(Number(checked.value)))

  const retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  model.templateData.searchResult = []
  retrieveAllMovies.forEach(movie => {
    if (checkedArray.every(checked => movie.genres.includes(checked))) {
      model.templateData.searchResult.push(movie)
    }
  })
  view.displayMovieCard(model.templateData.searchResult, model.elementObject.movieCardsSection, model.config.itemPerPage, 1)
  view.displayPagination(model.templateData.searchResult, model.elementObject.pagination, model.config.itemPerPage)
  window.scrollTo(0, 0)
}

export function AddEventListenerToMovieModalBadge () {
  const movieModalBadgesSection = document.querySelector('.row-genres-badges .col')
  movieModalBadgesSection.addEventListener('click', event => filterByMovieModalBadge(event))
}

function filterByMovieModalBadge (event) {
  if (event.target.dataset.genre) {
    const genre = event.target.dataset.genre
    document.querySelector('.modal-header .btn-close').click()
    // check genre accordingly
    document.querySelector(`#accordion input[value="${genre}"]`).checked = true
    filterMovies()
    view.expendAccordion()
  }
}
