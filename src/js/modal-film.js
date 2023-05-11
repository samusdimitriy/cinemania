import APIService from './api-service-main';
import sprite from '../images/sprite.svg';
import BtnState from './btn-state';

const apiService = new APIService();

const catalog = document.getElementById('movie-list');
const myLibGallery = document.getElementById('my-lib-gallery-list');
const weeklyTrends = document.getElementById('weekly-trnds-list');
const modalWindow = document.querySelector('.modal-film');
const overlay = document.querySelector('.overlay');

addModalListener(catalog);
addModalListener(weeklyTrends);
addModalListener(myLibGallery);

function addModalListener(listRef) {
  if (!listRef) {
    return;
  }
  listRef.addEventListener('click', onMovieCardClick);
}

async function onMovieCardClick(e) {
  if (!e.target.closest('.cards__list-item')) {
    return;
  }

  try {
    const movieID = e.target
      .closest('.cards__list-item')
      .getAttribute('data-id');
    const movieData = await apiService.getMovieInfo(movieID);
    const markup = createMarkup(movieData);
    updateModal(markup);
    const btnModalClose = document.querySelector('.modal-film__close');
    btnModalClose.addEventListener('click', closeModalWindows);
    openModal();
    const toLibraryBtn = document.getElementById('mylibrary');
    const btnApi = new BtnState(toLibraryBtn, 'modal-btn-attr', movieData);
    btnApi.setBtnState();
  } catch (error) {
    console.log(error);
  }
}

function openModal() {
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function updateModal(markup) {
  modalWindow.innerHTML = markup;
}

function createMarkup({
  id,
  poster_path,
  title,
  overview,
  popularity,
  vote_average,
  vote_count,
  genres,
}) {
  return `<div class="modal-film__container" data-id=${id}>
  <button class="modal-film__close">
    <svg width="18" height="18" class="modal-film__close-icon">
    <use href="${sprite}#icon-cross-closed"></use>       
</svg>
  </button>
  <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="movie-poster" class="modal-film__img" />
  <div class="modal-film__card">
    <h2 class="modal-film__title">${title}</h2>
    <div class="modal-film__blok">
      <ul class="modal-film__list attribute">
        <li class="modal-film__link">Vote / Votes</li>
        <li class="modal-film__link">Popularity</li>
        <li class="modal-film__link">Genre</li>
      </ul>

      <ul class="modal-film__list">
        <li class="modal-film__link-item item-votes">
          <div class="vote">${vote_average}</div>
          &nbsp;/&nbsp;
          <div class="votes">${vote_count}</div>
        </li>
        <li class="modal-film__link-item popularity">${popularity}</li>
        <li class="modal-film__link-item genres">${genres
          .map(g => g.name)
          .join(', ')}</li>
      </ul>
    </div>
    <h3 class="modal-film__about">ABOUT</h3>
    <p class="modal-film__about-txt">${overview}
    </p>
    <button class="btn" id="mylibrary" data-action="add">Add to my library</button>`;
}

function closeModalWindows() {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

overlay.addEventListener('click', closeModalWindows);
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindows();
  }
});
