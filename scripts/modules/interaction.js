import * as controller from './controller.js'
import * as view from './view.js'
import * as utility from './utilities.js'
import * as model from './model.js'

function setDefaultDisplaySetting (setting) {
  let currentDisplaySetting = controller.retrieveFromLocalStorage('displaySetting')
  if (!currentDisplaySetting) {
    controller.saveToLocalStorage('displaySetting', setting)
  }
  currentDisplaySetting = controller.retrieveFromLocalStorage('displaySetting')
  view.setDisplaySettingPanelClass(currentDisplaySetting)
}

export async function loadIndexPageContents (milliseconds) {
  setDefaultDisplaySetting(model.config.displayStatus)
  model.config.pageStatus = 'index'
  view.displayLoadingSpin(model.elementObject.moviesSection)
  let retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  // only fetch when localStorage key 'allMovies' has no value
  if (retrieveAllMovies === null) {
    const allMovies = await controller.fetchData(model.config.allMoviesApi)
    controller.saveToLocalStorage('allMovies', allMovies.data.results)
    retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  }
  view.displayFilterBadges(model.elementObject.filter, model.templateData.movieGenres)
  setTimeout(() => {
    displayByConfigStatus(retrieveAllMovies, model.elementObject.moviesSection, model.config.itemPerPage, model.config.lastClickedPageNumber)
    view.displayPagination(retrieveAllMovies, model.elementObject.pagination, model.config.itemPerPage, model.config.lastClickedPageNumber)
  }, milliseconds)
}

export function loadFavoritePageContents (milliseconds) {
  setDefaultDisplaySetting(model.config.displayStatus)
  model.config.pageStatus = 'favorite'
  view.displayLoadingSpin(model.elementObject.moviesSection)
  const allMovies = controller.retrieveFromLocalStorage('allMovies')
  const favoriteMovies = controller.filterFavoriteMovies(allMovies)
  setTimeout(() => {
    if (favoriteMovies.length === 0) {
      view.displayEmptyMessage('Hmm, have no favorite movie yet 😌', model.elementObject.moviesSection)
    } else {
      displayByConfigStatus(favoriteMovies, model.elementObject.moviesSection, model.config.itemPerPage, model.config.lastClickedPageNumber)
      view.displayPagination(favoriteMovies, model.elementObject.pagination, model.config.itemPerPage, model.config.lastClickedPageNumber)
    }
  }, milliseconds)
}

export function displaySettingInteraction (event) {
  const clickedDisplaySetting = event.target.dataset.display
  if (!clickedDisplaySetting) return

  const currentDisplaySetting = controller.retrieveFromLocalStorage('displaySetting')
  if (clickedDisplaySetting !== currentDisplaySetting) {
    controller.updateLocalStorage('displaySetting', clickedDisplaySetting)
    view.toggleDisplaySettingPanelClass()
    switch (model.config.pageStatus) {
      case 'index':
        loadIndexPageContents(250)
        break
      case 'search':
        loadSearchPageContents(model.templateData.userInput)
        break
      case 'filter':
        filterMovieByGenre()
        break
      case 'favorite':
        loadFavoritePageContents(250)
    }
  }
}

export async function movieCardInteraction (event) {
  const targetClass = event.target.dataset.class
  switch (targetClass) {
    case 'detail': {
      const movieIdClicked = event.target.dataset.id
      if (model.templateData.movieIdClicked === movieIdClicked) {
        // when click the movie same as last clicked
        view.displayMovieModal(model.templateData.movieModalDetail, model.templateData.movieGenres, model.elementObject.movieModal, model.config.pageStatus)
      } else {
        model.templateData.movieIdClicked = movieIdClicked
        view.displayEmptyMovieModal(model.elementObject.movieModal)
        const movieDetailApi = `${model.config.allMoviesApi}${event.target.dataset.id}`
        const movieDetailObject = await controller.fetchData(movieDetailApi)
        view.displayMovieModal(movieDetailObject.data.results, model.templateData.movieGenres, model.elementObject.movieModal, model.config.pageStatus)
        model.templateData.movieModalDetail = movieDetailObject.data.results
      }
      view.hideDraggableHintIconWhenDrag()
      break
    }
    case 'favorite':
      view.toggleFavoriteIcon(event)
      controller.addToFavorite(event, 'allMovies')
  }
}

export function paginationInteraction (event, pageStatus) {
  const pageNumber = Number(event.target.innerText)
  if (isNaN(pageNumber)) return

  const lastClickedPageNumber = model.config.lastClickedPageNumber
  if (lastClickedPageNumber === pageNumber) return

  model.config.lastClickedPageNumber = pageNumber

  view.updatePaginationActivePage(event)
  const retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  switch (pageStatus) {
    case 'index':
      displayByConfigStatus(retrieveAllMovies, model.elementObject.moviesSection, model.config.itemPerPage, pageNumber)
      break
    case 'favorite':
      displayByConfigStatus(controller.filterFavoriteMovies(retrieveAllMovies), model.elementObject.moviesSection, model.config.itemPerPage, pageNumber)
      break
    case 'search':
      displayByConfigStatus(model.templateData.searchResult, model.elementObject.moviesSection, model.config.itemPerPage, pageNumber, true, model.templateData.userInput)
      break
    case 'filter':
      displayByConfigStatus(model.templateData.searchResult, model.elementObject.moviesSection, model.config.itemPerPage, pageNumber)
  }
  window.scrollTo(0, 0)
}

export function searchMovieByTitle (userInput) {
  if (utility.isEmptyString(userInput)) {
    model.elementObject.searchInput.classList.add('is-invalid')
    return
  }

  // (if filter) reset filter
  model.elementObject.filterContainer.classList.add('d-none')
  controller.uncheckedAllOptions(document.querySelectorAll('#movieGenres .accordion-body :checked'))
  view.collapseAccordion()

  model.config.pageStatus = 'search'
  model.elementObject.searchInput.value = ''
  if (!document.querySelector('#clearButton')) {
    model.elementObject.searchButton.insertAdjacentHTML('beforebegin', `
    <button class="btn btn-warning" type="button" id="clearButton"></button>
    `)
  }
  document.querySelector('#clearButton').addEventListener('click', clearSearchResult)
  model.elementObject.searchInput.classList.remove('is-invalid')

  model.templateData.userInput = userInput
  loadSearchPageContents(model.templateData.userInput)
}

function loadSearchPageContents (userInput) {
  model.templateData.searchResult = controller.returnSearchMovies(model.templateData.userInput, controller.retrieveFromLocalStorage('allMovies'))

  if (model.templateData.searchResult.length === 0) {
    model.elementObject.searchMessage.textContent = ''
    view.displayEmptyMessage(`No matching results of ${model.templateData.userInput} 😣`, model.elementObject.moviesSection)
  } else {
    displayByConfigStatus(model.templateData.searchResult, model.elementObject.moviesSection, model.config.itemPerPage, model.config.lastClickedPageNumber, true, model.templateData.userInput)
    model.elementObject.searchMessage.classList.add('mt-3')
    model.elementObject.searchMessage.textContent = `Search results of "${model.templateData.userInput}":`
  }
  view.displayPagination(model.templateData.searchResult, model.elementObject.pagination, model.config.itemPerPage, model.config.lastClickedPageNumber)
  window.scrollTo(0, 0)
}

function clearSearchResult () {
  model.elementObject.searchInput.value = ''
  model.elementObject.searchMessage.textContent = ''
  model.elementObject.searchMessage.classList.remove('mt-3')
  document.querySelector('#clearButton').remove()
  model.elementObject.filterContainer.classList.remove('d-none')
  loadIndexPageContents(250)
}

export function filterMovieByGenre () {
  const checkedGenres = document.querySelectorAll('#movieGenres .accordion-body :checked')

  if (checkedGenres.length === 0) {
    model.config.pageStatus = 'index'
    loadIndexPageContents(250)
    return
  }

  model.config.pageStatus = 'filter'
  const checkedArray = []
  checkedGenres.forEach(checked => checkedArray.push(Number(checked.value)))

  const retrieveAllMovies = controller.retrieveFromLocalStorage('allMovies')
  model.templateData.searchResult = []
  retrieveAllMovies.forEach(movie => {
    if (checkedArray.every(checked => movie.genres.includes(checked))) {
      model.templateData.searchResult.push(movie)
    }
  })
  displayByConfigStatus(model.templateData.searchResult, model.elementObject.moviesSection, model.config.itemPerPage, 1)
  view.displayPagination(model.templateData.searchResult, model.elementObject.pagination, model.config.itemPerPage)
  window.scrollTo(0, 0)
}

export function AddEventListenerToMovieModalBadge () {
  const movieModalBadgesSection = document.querySelector('.row-genres-badges .col')
  if (!movieModalBadgesSection) return
  movieModalBadgesSection.addEventListener('click', event => filterByMovieModalBadge(event))
}

function filterByMovieModalBadge (event) {
  if (event.target.dataset.genre) {
    const genre = event.target.dataset.genre
    document.querySelector('.modal-header .btn-close').click()
    // check genre accordingly
    document.querySelector(`#accordion input[value="${genre}"]`).checked = true
    filterMovieByGenre()
    view.expendAccordion()
  }
}

function displayByConfigStatus (dataArray, target, itemPerPage, currentPage, highlight = false, keyword) {
  const currentDisplaySetting = controller.retrieveFromLocalStorage('displaySetting')
  if (!currentDisplaySetting) return

  switch (currentDisplaySetting) {
    case 'grid':
      view.displayMovieCard(
        dataArray, target, itemPerPage, currentPage, highlight, keyword)
      break
    case 'list':
      view.displayMovieList(dataArray, target, itemPerPage, currentPage, highlight, keyword)
  }
}

export function makeDisplaySettingPanelDraggable () {
  document.querySelector('#displaySettingPanel').addEventListener('dragstart', event => {
    model.templateData.draggedItem = event.target
    view.setDraggedTargetAndDropZoneOpacity(0.2, 0.4, event)
  })
  document.querySelector('#displaySettingPanel').addEventListener('dragend', event => {
    view.setDraggedTargetAndDropZoneOpacity(1, 0, event)
  })

  document.querySelector('.drop-right-top').addEventListener('dragover', event => {
    event.preventDefault()
  })
  document.querySelector('.drop-right-bottom').addEventListener('dragover', event => {
    event.preventDefault()
  })
  document.querySelector('.drop-left-bottom').addEventListener('dragover', event => {
    event.preventDefault()
  })

  document.querySelector('.drop-right-top').addEventListener('drop', event => {
    // prevent default action (open as link)
    event.preventDefault()
    moveDraggableItem(event, 'drop-right-top')
  })
  document.querySelector('.drop-right-bottom').addEventListener('drop', event => {
    event.preventDefault()
    moveDraggableItem(event, 'drop-right-bottom')
  })
  document.querySelector('.drop-left-bottom').addEventListener('drop', event => {
    event.preventDefault()
    moveDraggableItem(event, 'drop-left-bottom')
  })
}

function moveDraggableItem (event, className) {
  if (event.target.className === className) {
    model.templateData.draggedItem.parentNode.removeChild(model.templateData.draggedItem)
    event.target.appendChild(model.templateData.draggedItem)
  }
}
