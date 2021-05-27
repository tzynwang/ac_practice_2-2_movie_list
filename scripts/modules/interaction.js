import * as controller from './controller.js'
import * as view from './view.js'
import * as main from '../main.js'
import * as utility from './utilities.js'

export async function loadIndexPageContents (milliseconds) {
  controller.updatePageStatus('index')
  view.displayLoadingSpin(main.elementObject.movieCardsSection)
  let retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  // only fetch when localStorage key 'allMovies' has no value
  if (retrieveAllMovies === null) {
    const allMovies = await controller.fetchData(main.config.allMoviesApi)
    controller.saveToLocalStorage('allMovies', allMovies)
    retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  }
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

export async function movieCardInteract (event) {
  if (event.target.dataset.class === 'detail') {
    const movieDetailApi = `${main.config.allMoviesApi}${event.target.dataset.id}`
    const movieDetailObject = await controller.fetchData(movieDetailApi)
    view.displayMovieModal(movieDetailObject, main.elementObject.movieModal)
  }
  if (event.target.dataset.class === 'favorite') {
    view.toggleFavoriteIcon(event)
    controller.addToFavorite(event, 'allMovies')
  }
}

export function paginationInteract (event, status) {
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
  }
  window.scrollTo(0, 0)
}

export function searchMovieByTitle (userInput) {
  controller.updatePageStatus('search')
  if (utility.isEmptyString(userInput)) {
    main.elementObject.searchInput.classList.add('is-invalid')
    return
  }
  main.templateData.userInput = userInput
  main.elementObject.searchInput.classList.remove('is-invalid')
  main.templateData.searchResult = controller.returnSearchMovies(main.templateData.userInput, controller.retrieveFromLocalStorage('allMovies'))
  if (main.templateData.searchResult.length === 0) {
    view.displayEmptyMessage(`No matching results of ${main.templateData.userInput} 😣`, main.elementObject.movieCardsSection)
  } else {
    view.displayMovieCard(main.templateData.searchResult, main.elementObject.movieCardsSection, main.config.cardPerPage, 1, true, main.templateData.userInput)
    view.displaySearchMessage(`Search results of "${main.templateData.userInput}": `, main.elementObject.movieCardsSection)
  }
  view.displayPagination(main.templateData.searchResult, main.elementObject.pagination, main.config.cardPerPage)
}
