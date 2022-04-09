import axios from "axios";

export default class PicturesService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.totalMatches = 1;
    }
    
    async fetchPictures(searchQuery) {
        
        const url = `https://pixabay.com/api/?key=21539739-826ad7071a5325d71a1052891&q=${this.searchQuery}&per_page=40&image_type=photo&page=${this.page}&orientation=horizontal&safesearch=true`
        
        const response = await axios.get(url)
            .then(pictures => {
                console.log(pictures);
                this.totalMatches = pictures.data.totalHits;
                console.log(this.totalMatches);
                this.page += 1;
                return pictures.data.hits;
            });
        return response;
    }


    resetPage() {
        this.page = 1;  
        this.totalMatches = 0;
    }

    get query(){
        return this.searchQuery
    }
    
    set query(newQuery){
        this.searchQuery = newQuery;
}
}


 