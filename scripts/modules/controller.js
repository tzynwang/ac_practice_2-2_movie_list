import * as model from './model.js'

export function updatePageStatus (status) {
  model.config.pageStatus = status
}

export async function fetchData (url) {
  try {
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

export function saveToLocalStorage (localStorageKey, data) {
  // setItem only once
  if (window.localStorage.getItem(localStorageKey) === null) {
    window.localStorage.setItem(localStorageKey, JSON.stringify(data))
  }
}

export function updateLocalStorage (localStorageKey, data) {
  window.localStorage.setItem(localStorageKey, JSON.stringify(data))
}

export function retrieveFromLocalStorage (localStorageKey) {
  return JSON.parse(window.localStorage.getItem(localStorageKey))
}

export function addToFavorite (event, localStorageKey) {
  const movieId = Number(event.target.dataset.id)
  if (isNaN(movieId)) return

  const allMovies = retrieveFromLocalStorage(localStorageKey)
  allMovies.forEach(movie => {
    if (movie.id === movieId) {
      switch (movie.favorite) {
        case true:
          movie.favorite = false
          return
        default:
          movie.favorite = true
      }
    }
  })
  updateLocalStorage(localStorageKey, allMovies)
}

export function filterFavoriteMovies (dataArray) {
  return dataArray.filter(movie => movie.favorite === true)
}

export function returnSearchMovies (input, dataArray) {
  const searchKeyword = input.trim().toLowerCase()
  return dataArray.filter(data => data.title.toLowerCase().includes(searchKeyword))
}

export function uncheckedAllOptions (nodes) {
  nodes.forEach(node => {
    node.checked = false
  })
}
