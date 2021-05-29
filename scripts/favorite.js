import * as interaction from './modules/interaction.js'
import * as main from './generalData.js'

interaction.loadFavoritePageContents(300)

main.elementObject.movieCardsSection.addEventListener('click', interaction.movieCardInteraction)

main.elementObject.pagination.addEventListener('click', event => {
  interaction.paginationInteraction(event, main.config.pageStatus)
})
