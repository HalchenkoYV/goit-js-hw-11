import './sass/main.scss';
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import PicturesService from './js/pictures-service';
import LoadMoreBtn from './js/loadMoreBtn';
import picturesTpl from './pictures-cards.hbs';

// let gallery = new SimpleLightbox('.gallery a');
// gallery.refresh(); // Next Image
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

refs.searchForm.addEventListener('submit', onSearch);             ///// search articles
refs.btnLoadMore.addEventListener('click', fetchPictures);        ///// load more 

// ///////////////////     SEARCH ARTICLES FIRST REQUEST    /////////////////////////
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
  
  ///fetch
  fetchPictures()
    .then((e) => {
      if (picturesService.totalMatches != 0) {
      Notiflix.Notify.success(`Hooray! We found ${picturesService.totalMatches} images`);
      }
      if(picturesService.totalMatches == 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }
    });
    
}

// ///////////////////////////     LOAD MORE    /////////////////////////////////
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
    })
    
}


function appendArticlesMurkup(pictires) {
    refs.conteinerForContent.insertAdjacentHTML('beforeend', picturesTpl(pictires));
}

function clearArticlesContainer() {
  refs.conteinerForContent.innerHTML = '';
}