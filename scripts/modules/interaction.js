import * as controller from './controller.js'
import * as view from './view.js'
import * as utility from './utilities.js'
import * as main from '../generalData.js'

export async function loadIndexPageContents (milliseconds) {
  controller.updatePageStatus('index')
  view.displayLoadingSpin(main.elementObject.movieCardsSection)
  let retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  // only fetch when localStorage key 'allMovies' has no value
  if (retrieveAllMovies === null) {
    const allMovies = await controller.fetchData(main.config.allMoviesApi)
    controller.saveToLocalStorage('allMovies', allMovies.data.results)
    retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  }
  view.displayFilterBadges(main.elementObject.filter, main.templateData.movieGenres)
  setTimeout(() => {
    view.displayMovieCard(
      retrieveAllMovies, main.elementObject.movieCardsSection, main.config.cardPerPage, main.config.startPage
    )
    view.displayPagination(retrieveAllMovies, main.elementObject.pagination, main.config.cardPerPage)
  }, milliseconds)
}

export function loadFavoritePageContents (milliseconds) {
  controller.updatePageStatus('favorite')
  view.displayLoadingSpin(main.elementObject.movieCardsSection)
  const allMovies = controller.retrieveFromLocalStorage('allMovies')
  const favoriteMovies = controller.filterFavoriteMovies(allMovies)
  setTimeout(() => {
    if (favoriteMovies.length === 0) {
      view.displayEmptyMessage('Hmm, have no favorite movie yet 😌', main.elementObject.movieCardsSection)
    } else {
      view.displayMovieCard(
        favoriteMovies, main.elementObject.movieCardsSection, main.config.cardPerPage, main.config.startPage
      )
      view.displayPagination(favoriteMovies, main.elementObject.pagination, main.config.cardPerPage)
    }
  }, milliseconds)
}

export async function movieCardInteraction (event) {
  const targetClass = event.target.dataset.class
  switch (targetClass) {
    case 'detail': {
      const movieIdClicked = event.target.dataset.id
      if (main.templateData.movieIdClicked === movieIdClicked) {
        view.displayMovieModal(main.templateData.movieModalDetail, main.templateData.movieGenres, main.elementObject.movieModal, main.config.pageStatus)
        return
      } else {
        main.templateData.movieIdClicked = movieIdClicked
        view.displayEmptyMovieModal(main.elementObject.movieModal)
        const movieDetailApi = `${main.config.allMoviesApi}${event.target.dataset.id}`
        const movieDetailObject = await controller.fetchData(movieDetailApi)
        view.displayMovieModal(movieDetailObject.data.results, main.templateData.movieGenres, main.elementObject.movieModal, main.config.pageStatus)
        main.templateData.movieModalDetail = movieDetailObject.data.results
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
      view.displayMovieCard(retrieveAllMovies, main.elementObject.movieCardsSection, main.config.cardPerPage, pageNumber)
      break
    case 'favorite':
      view.displayMovieCard(controller.filterFavoriteMovies(retrieveAllMovies), main.elementObject.movieCardsSection, main.config.cardPerPage, pageNumber)
      break
    case 'search':
      view.displayMovieCard(main.templateData.searchResult, main.elementObject.movieCardsSection, main.config.cardPerPage, pageNumber, true, main.templateData.userInput)
      break
    case 'filter':
      view.displayMovieCard(main.templateData.searchResult, main.elementObject.movieCardsSection, main.config.cardPerPage, pageNumber)
  }
  window.scrollTo(0, 0)
}

export function searchMovieByTitle (userInput) {
  if (utility.isEmptyString(userInput)) {
    main.elementObject.searchInput.classList.add('is-invalid')
    return
  }

  // (if filter) reset filter
  main.elementObject.filterContainer.classList.add('d-none')
  controller.uncheckedAllOptions(document.querySelectorAll('#movieGenres .accordion-body :checked'))
  view.collapseAccordion()

  controller.updatePageStatus('search')
  main.elementObject.searchInput.value = ''
  if (!document.querySelector('#clearButton')) {
    main.elementObject.searchButton.insertAdjacentHTML('beforebegin', `
    <button class="btn btn-warning" type="button" id="clearButton">Clear search result</button>
    `)
  }
  document.querySelector('#clearButton').addEventListener('click', clearSearchResult)
  main.elementObject.searchInput.classList.remove('is-invalid')
  main.templateData.userInput = userInput
  main.templateData.searchResult = controller.returnSearchMovies(main.templateData.userInput, controller.retrieveFromLocalStorage('allMovies'))

  if (main.templateData.searchResult.length === 0) {
    view.displayEmptyMessage(`No matching results of ${main.templateData.userInput} 😣`, main.elementObject.movieCardsSection)
  } else {
    view.displayMovieCard(main.templateData.searchResult, main.elementObject.movieCardsSection, main.config.cardPerPage, 1, true, main.templateData.userInput)
    main.elementObject.searchMessage.classList.add('mt-3')
    main.elementObject.searchMessage.textContent = `Search results of "${main.templateData.userInput}":`
  }
  view.displayPagination(main.templateData.searchResult, main.elementObject.pagination, main.config.cardPerPage)
  window.scrollTo(0, 0)
}

function clearSearchResult () {
  main.elementObject.searchInput.value = ''
  main.elementObject.searchMessage.textContent = ''
  main.elementObject.searchMessage.classList.remove('mt-3')
  document.querySelector('#clearButton').remove()
  main.elementObject.filterContainer.classList.remove('d-none')
  loadIndexPageContents(250)
}

export function filterMovies () {
  const checkedGenres = document.querySelectorAll('#movieGenres .accordion-body :checked')

  if (checkedGenres.length === 0) {
    controller.updatePageStatus('index')
    loadIndexPageContents(250)
    return
  }

  controller.updatePageStatus('filter')
  const checkedArray = []
  checkedGenres.forEach(checked => checkedArray.push(Number(checked.value)))

  const retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  main.templateData.searchResult = []
  retrieveAllMovies.forEach(movie => {
    if (checkedArray.every(checked => movie.genres.includes(checked))) {
      main.templateData.searchResult.push(movie)
    }
  })
  view.displayMovieCard(main.templateData.searchResult, main.elementObject.movieCardsSection, main.config.cardPerPage, 1)
  view.displayPagination(main.templateData.searchResult, main.elementObject.pagination, main.config.cardPerPage)
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
