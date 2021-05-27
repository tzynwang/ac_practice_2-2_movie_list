export const elementObject = {
  searchInput: document.querySelector('#search'),
  searchButton: document.querySelector('#searchButton'),
  movieCardsSection: document.querySelector('#movieCards'),
  movieModal: document.querySelector('#movieModal'),
  pagination: document.querySelector('#pagination')
}

export const config = {
  cardPerPage: 12,
  startPage: 1,
  allMoviesApi: 'https://movie-list.alphacamp.io/api/v1/movies/',
  pageStatus: undefined
}

export const templateData = {
  searchResult: undefined
}
