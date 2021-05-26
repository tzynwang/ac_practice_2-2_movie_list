import * as controller from './_controller.js'
import * as view from './_view.js'
import * as main from './_main.js'

// import * as index from './index.js'
// import { config } from './index.js'

view.displayLoadingSpin(main.elementObject.movieCardsSection)
const allMovies = controller.retrieveFromLocalStorage('allMovies')
const favoriteMovies = controller.filterFavoriteMovies(allMovies)
console.log(favoriteMovies)

view.displayMovieCard(
  favoriteMovies, main.elementObject.movieCardsSection, main.config.cardPerPage, main.config.startPage
)
view.displayPagination(favoriteMovies, main.elementObject.pagination, main.config.cardPerPage)

// document.querySelector('#movieCards').addEventListener('click', index.movieCardInteract)
// document.querySelector('#pagination').addEventListener('click', index.paginationInteract)
