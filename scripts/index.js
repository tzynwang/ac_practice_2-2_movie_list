import * as controller from './_controller.js'
import * as view from './_view.js'
import * as main from './_main.js'

loadPageContents()
main.elementObject.movieCardsSection.addEventListener('click', movieCardInteract)
main.elementObject.pagination.addEventListener('click', paginationInteract)

async function loadPageContents () {
  view.displayLoadingSpin(main.elementObject.movieCardsSection)
  const allMovies = await controller.fetchData(main.config.allMoviesApi)
  controller.saveToLocalStorage('allMovies', allMovies)
  const retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  view.displayMovieCard(
    retrieveAllMovies, main.elementObject.movieCardsSection, main.config.cardPerPage, main.config.startPage
  )
  view.displayPagination(retrieveAllMovies, main.elementObject.pagination, main.config.cardPerPage)
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

export function paginationInteract (event) {
  const pageNumber = Number(event.target.innerText)
  if (isNaN(pageNumber)) return

  view.updatePaginationActivePage(event)
  const retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  view.displayMovieCard(retrieveAllMovies, main.elementObject.movieCardsSection, main.config.cardPerPage, pageNumber)
  view.scrollTo(0, 0)
}
