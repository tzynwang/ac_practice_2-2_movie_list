import * as main from './main.js'
import * as interaction from './modules/interaction.js'

interaction.loadIndexPageContents(300)

main.elementObject.movieCardsSection.addEventListener('click', interaction.movieCardInteract)

main.elementObject.pagination.addEventListener('click', event => {
  interaction.paginationInteract(event, main.config.pageStatus)
})

main.elementObject.searchButton.addEventListener('click', () => {
  const userInput = main.elementObject.searchInput.value
  interaction.searchMovieByTitle(userInput)
})

main.elementObject.searchInput.addEventListener('keypress', event => {
  if (event.keyCode === 13) main.elementObject.searchButton.click()
})

main.elementObject.filter.addEventListener('change', interaction.filterMovies)
