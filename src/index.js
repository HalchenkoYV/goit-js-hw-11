import './sass/main.scss';
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox'; // Немогу поставить, пишет: Could not find a declaration file for module 'simplelightbox'. 'C:/Users/Egor/Desktop/GoIT/goit-js-hw-11/node_modules/simplelightbox/dist/simple-lightbox.js' implicitly has an 'any' type. Try `npm i --save-dev @types/simplelightbox` if it exists or add a new declaration (.d.ts) file containing `declare module 'simplelightbox';`
import PicturesService from './js/pictures-service';
import LoadMoreBtn from './js/loadMoreBtn';
import picturesTpl from './pictures-cards.hbs';

var lightbox = new SimpleLightbox('.gallery a', { captionsData:'alt', captionDelay:250 });

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-btn'),
  conteinerForContent: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};


const loadMoreBtn = new LoadMoreBtn({ selector:'.load-more', hidden : true});
const picturesService = new PicturesService();

let numberCurPic = 0;

refs.searchForm.addEventListener('submit', onSearch);             
refs.btnLoadMore.addEventListener('click', fetchPictures);
refs.conteinerForContent.addEventListener('click', function (e) { e.preventDefault(); });


// ///////////////////     SEARCH Pictures FIRST REQUEST    /////////////////////////
function onSearch(e) {
    e.preventDefault();
    console.log(e.currentTarget);
    picturesService.query = e.currentTarget.searchQuery.value;
    if (picturesService.query == '') {
      alert('Еnter something normal')
      return
    }
  loadMoreBtn.hide();

  ///reset for new page;
  picturesService.resetPage();
  numberCurPic = 0;
  clearArticlesContainer(); 
  
  fetchPictures()
    .then(() => {
      
      if (picturesService.totalMatches != 0) {
      Notiflix.Notify.success(`Hooray! We found ${picturesService.totalMatches} images`);
      }
      if(picturesService.totalMatches == 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }
    });
    
}

/////////////////////////////     LOAD MORE    /////////////////////////////////
async function fetchPictures() {
  await picturesService.fetchPictures()
    .then(pictures => {
      appendArticlesMurkup(pictures);
      numberCurPic += pictures.length;

      if (numberCurPic >= picturesService.totalMatches && picturesService.totalMatches !=0) {
        // alert('Were sorry, but you ve reached the end of search results.');
        Notiflix.Notify.warning('Were sorry, but you ve reached the end of search results.');
        loadMoreBtn.hide();
        return;
      }

      if (picturesService.totalMatches != 0) {
        loadMoreBtn.show();
      }
      lightbox.refresh()
    })
    
}


function appendArticlesMurkup(pictires) {
    refs.conteinerForContent.insertAdjacentHTML('beforeend', picturesTpl(pictires));
}

function clearArticlesContainer() {
  refs.conteinerForContent.innerHTML = '';
}
