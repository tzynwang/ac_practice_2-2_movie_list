import * as controller from './controller.js'
import * as view from './view.js'
import * as main from '../main.js'

export async function loadIndexPageContents (milliseconds) {
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

export function paginationInteract (event, page) {
  const pageNumber = Number(event.target.innerText)
  if (isNaN(pageNumber)) return

  view.updatePaginationActivePage(event)
  const retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  switch (page) {
    case 'index':
      view.displayMovieCard(retrieveAllMovies, main.elementObject.movieCardsSection, main.config.cardPerPage, pageNumber)
      break
    case 'favorite':
      view.displayMovieCard(controller.filterFavoriteMovies(retrieveAllMovies), main.elementObject.movieCardsSection, main.config.cardPerPage, pageNumber)
  }
  view.scrollTo(0, 0)
}
