import * as interaction from './modules/interaction.js'
import * as model from './model.js'

interaction.loadFavoritePageContents(300)

model.elementObject.movieCardsSection.addEventListener('click', interaction.movieCardInteraction)

model.elementObject.pagination.addEventListener('click', event => {
  interaction.paginationInteraction(event, model.config.pageStatus)
})
