export const elementObject = {
  searchInput: document.querySelector('#search'),
  searchButton: document.querySelector('#searchButton'),
  searchMessage: document.querySelector('#searchMessage'),
  filterContainer: document.querySelector('#accordion'),
  filter: document.querySelector('#movieGenres .accordion-body'),
  displaySettingPanel: document.querySelector('#displaySettingPanel'),
  moviesSection: document.querySelector('#movies'),
  movieModal: document.querySelector('#movieModal'),
  pagination: document.querySelector('#pagination')
}

export const config = {
  itemPerPage: 12,
  startPage: 1,
  allMoviesApi: 'https://movie-list.alphacamp.io/api/v1/movies/',
  pageStatus: undefined,
  displayStatus: 'grid', // 'grid' || 'list'
  lastClickedPageNumber: 1
}

export const templateData = {
  userInput: undefined,
  searchResult: undefined,
  movieIdClicked: undefined,
  movieModalDetail: undefined,
  movieGenres: {
    1: 'Action',
    2: 'Adventure',
    3: 'Animation',
    4: 'Comedy',
    5: 'Crime',
    6: 'Documentary',
    7: 'Drama',
    8: 'Family',
    9: 'Fantasy',
    10: 'History',
    11: 'Horror',
    12: 'Music',
    13: 'Mystery',
    14: 'Romance',
    15: 'Science Fiction',
    16: 'TV Movie',
    17: 'Thriller',
    18: 'War',
    19: 'Western'
  }
}
