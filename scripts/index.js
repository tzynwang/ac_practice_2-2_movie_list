import * as interaction from './modules/interaction.js'
import * as model from './model.js'

interaction.loadIndexPageContents(300)

model.elementObject.movieCardsSection.addEventListener('click', async event => {
  await interaction.movieCardInteraction(event)
  interaction.AddEventListenerToMovieModalBadge()
})

model.elementObject.pagination.addEventListener('click', event => {
  interaction.paginationInteraction(event, model.config.pageStatus)
})

model.elementObject.searchButton.addEventListener('click', () => {
  const userInput = model.elementObject.searchInput.value
  interaction.searchMovieByTitle(userInput)
})

model.elementObject.searchInput.addEventListener('keypress', event => {
  if (event.keyCode === 13) model.elementObject.searchButton.click()
})

model.elementObject.filter.addEventListener('change', interaction.filterMovies)
