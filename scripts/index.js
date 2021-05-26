import * as main from './main.js'
import * as interaction from './modules/interaction.js'

interaction.loadIndexPageContents(300)

main.elementObject.movieCardsSection.addEventListener('click', interaction.movieCardInteract)
main.elementObject.pagination.addEventListener('click', event => {
  interaction.paginationInteract(event, 'index')
})
