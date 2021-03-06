import * as interaction from './modules/interaction.js'
import * as model from './modules/model.js'

interaction.loadFavoritePageContents(300)
interaction.makeDisplaySettingPanelDraggable()

model.elementObject.displaySettingPanel.addEventListener('click', interaction.displaySettingInteraction)

model.elementObject.moviesSection.addEventListener('click', interaction.movieCardInteraction)

model.elementObject.pagination.addEventListener('click', event => {
  interaction.paginationInteraction(event, model.config.pageStatus)
})
