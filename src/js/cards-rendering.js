import { emptyStar, fullStar, halfStar } from './stars';
import comingSoonImg from '../images/coming_soon.jpg';
import APIService from './api-service-main';
const apiService = new APIService();

const axios = require('axios').default;
let genreList;

getGenresList();

async function getGenresList() {
  try {
    const response = await apiService.getGenresList();
    return (genreList = response);
  } catch (error) {
    console.log(error);
  }
}

export default async function renderMoviesCards(movies, selector) {
  // в каталоге рендерится в переданный селектор
  const movieList = document.querySelector(`${selector}`);
  let markup = '';
  for (const movie of movies) {
    const {
      genre_ids: id,
      poster_path: poster,
      title,
      release_date: date,
      vote_average: rating,
    } = movie;

    const movieSrc =  getImg(poster, title);
    const movieGenre = getGenre(id);
    const movieYear = getYear(date);
    const starRating =  createStarRating(rating);
    // Надо добавить классы
    markup += `<li class='cards__list-item' data-id='${id}'>
                    
    <img class='cards__list-img' loading="lazy" ${movieSrc} width='395' height='574'/>
    
                   <div class='weekly-trends__overlay'></div>
                    <div class='cards__list-search'>                       
                        <div class='cards__bloc-stars'>
                          <h3 class='cards__list-title'>${title}</h3>
                          <div class='cards__list-text'>${movieGenre}|${movieYear}<span class='cards__list-span'></span></div>
                        </div>  
                        
                        
                    </div>
                    <div class='cards__list-stars'>${starRating}</div>
                </li>`;
  }

  if (!movieList) {
    return;
  }
  movieList.innerHTML = markup;
}

// Получает год из даты
function getYear(data) {
  if (!data) {
    return 'There is no release date';
  }

  const year =  data.slice(0, 4);
  return year;
}

// Получает жанры фильма
function getGenre(id) {
  const movieGenresId = id.slice(0, 2);

  const filteredGenres = genreList.filter(genre =>
    movieGenresId.includes(genre.id)
  );

  const movieGenres = filteredGenres.map(genre => genre.name).join(', ');

  if (!movieGenres) {
    return 'There are no genres';
  }

  return movieGenres;
}

// Преобразует рейтинг в рейтинг из звезд
function createStarRating(data) {
  let ratingStars = '';

  if (!data) {
    ratingStars = `${emptyStar.repeat(5)}`;
    return `<div>${ratingStars}</div>`;
  }

  const rating = Math.round(data);

  switch (rating) {
    case 0:
      ratingStars = `${emptyStar.repeat(5)}`;
      break;
    case 1:
      ratingStars = `${halfStar}${emptyStar.repeat(4)}`;
      break;
    case 2:
      ratingStars = `${fullStar}${emptyStar.repeat(4)}`;
      break;
    case 3:
      ratingStars = `${fullStar}${halfStar}${emptyStar.repeat(3)}`;
      break;
    case 4:
      ratingStars = `${fullStar.repeat(2)}${emptyStar.repeat(3)}`;
      break;
    case 5:
      ratingStars = `${fullStar.repeat(2)}${halfStar}${emptyStar.repeat(2)}`;
      break;
    case 6:
      ratingStars = `${fullStar.repeat(3)}${emptyStar.repeat(2)}`;
      break;
    case 7:
      ratingStars = `${fullStar.repeat(3)}${halfStar}${emptyStar}`;
      break;
    case 8:
      ratingStars = `${fullStar.repeat(4)}${emptyStar}`;
      break;
    case 9:
      ratingStars = `${fullStar.repeat(4)}${halfStar}`;
      break;
    case 10:
      ratingStars = `${fullStar.repeat(5)}`;
      break;
    default:
      throw new Error('Invalid rating');
  }

  return `<div>${ratingStars}</div>`;
}

function getImg(poster, title) {
  if (poster === null || !poster) {
    return `src='${comingSoonImg}' alt='${title}'`;
  }

  return `
    srcset="
                https://image.tmdb.org/t/p/w500/${poster} 500w,
                https://image.tmdb.org/t/p/w300/${poster} 342w,
                https://image.tmdb.org/t/p/w185/${poster} 185w"
        src="https://image.tmdb.org/t/p/w500/${poster}"

        " sizes=" (min-width: 768px) 500px, (min-width: 480px) 342px, (min-width: 320px) 185px, 100vw"   
     alt='${title}'`;
}

export { createStarRating };
