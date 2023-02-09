const submitButton = document.querySelector("#submit") as HTMLElement;

const trendingTab = document.querySelector("#trending") as HTMLElement;
const maincontentArea = document.querySelector("#main-content") as HTMLElement;
const watchListArea = document.querySelector("#watchlist-tab") as HTMLElement;
const watchlistTab = document.querySelector("#watchlist") as HTMLElement;
const homeButton = document.querySelector("#home") as HTMLParagraphElement;
const topTVButton = document.querySelector("#top-tv") as HTMLParagraphElement;
const watchlistButton = document.querySelector(
    "#watchlist-button"
) as HTMLParagraphElement;

maincontentArea.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        if (
            watchListArea.style.display === "block" &&
            watchListButton.style.display === "none"
        ) {
            watchListArea.style.display = "none";
            watchListButton.style.display = "block";
        }
    }
});
function showWatchlist() {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        if (watchListArea.style.display === "none") {
            watchListButton.style.display = "none";
            watchListArea.style.display = "block";
        } else {
            watchListArea.style.display = "none";
            watchListButton.style.display = "block";
        }
    }
}

homeButton.addEventListener("click", (event) => {
    event.preventDefault();
    getNowPlayingMovies();
});

topTVButton.addEventListener("click", (event) => {
    event.preventDefault();
    getTopTvShows();
});

const watchListButton = document.querySelector(
    "#watchlist-button"
) as HTMLParagraphElement;
const topMoviesButton = document.querySelector(
    "#top-movies"
) as HTMLParagraphElement;

const topMoviesUrl = "https://api.themoviedb.org/3/movie/top_rated";
const topTvShowsUrl = "https://api.themoviedb.org/3/tv/top_rated";
const nowPlayingUrl = "https://api.themoviedb.org/3/movie/now_playing";
const searchMovieUrl = "https://api.themoviedb.org/3/search/movie";
const apiKey = "?api_key=aa5ee409d52ded21ba46b85a22480907";
const queryUrl = "&query=";
const imageUrl = "https://image.tmdb.org/t/p/w500//";
const trendingUrl = "https://api.themoviedb.org/3/trending/all/day";
const pageUrl = "&page=1";
const sortByUrl = "&sort_by=";
const discoverUrl = "https://api.themoviedb.org/3/discover/movie?";

type movie = {
    poster_path: string;
    title: string;
    rating: number;
    release?: number;
    overview?: string;
};

const searchedMovies: movie[] = [];
const topMovies: movie[] = [];
const tpTvShows: movie[] = [];
const trendingMovies: movie[] = [];
const userWatchList: movie[] = [];
const nowPlayingMovies: movie[] = [];
let moviePage: movie[] = [];

// function textColorByValue(value: movie["rating"]){

//     let textColor: string;
//     const rating =value;

//     if (rating > 7) {
//       textColor = 'green';
//     } else if (rating < 6) {
//       textColor = 'yellow';
//     } else {
//       textColor = 'red';
//     }

// }

async function getNowPlayingMovies() {
    const response = await fetch(nowPlayingUrl + apiKey);
    const data = await response.json();

    for (let i = 0; i < data.results.length; i++) {
        const checkNameVariant = data.results[i].title ?? data.results[i].name;
        const roundedNumber = data.results[i].vote_average;

        const newNowPlayingMovies: movie = {
            poster_path: data.results[i].poster_path,
            title: checkNameVariant,
            rating: roundedNumber.toFixed(1),
            release: data.results[i].release_date,
            overview: data.results[i].overview,
        };
        nowPlayingMovies.push(newNowPlayingMovies);
        printMovieNowPlayingMovies();
    }
}
getNowPlayingMovies();

async function getSearchedMovie() {
    searchedMovies.length = 0;
    const inputField = document.querySelector("#input") as HTMLInputElement;
    const searchedMovie = inputField.value;

    const response = await fetch(
        searchMovieUrl + apiKey + queryUrl + searchedMovie
    );

    const data = await response.json();
    for (let i = 0; i < data.results.length; i++) {
        const nameVariants = data.results[i].title ?? data.results[i].name;
        const releaseDateNameVariants =
            data.results[i].release_date ?? data.results[i].first_air_date;
        const roundedNumber = data.results[i].vote_average;

        const newSearchedMovies: movie = {
            poster_path: data.results[i].poster_path,
            title: nameVariants,
            rating: roundedNumber.toFixed(1),
            release: releaseDateNameVariants.toString(),
            overview: data.results[i].overview,
        };
        searchedMovies.push(newSearchedMovies);

        printSearchResults();
    }
}

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log(searchedMovies);
    getSearchedMovie();
});

async function getTrendingMovies() {
    const response = await fetch(trendingUrl + apiKey);
    const data = await response.json();

    for (let i = 0; i < data.results.length; i++) {
        const checkNameVariant = data.results[i].title ?? data.results[i].name;
        const roundedNumber = data.results[i].vote_average;

        const newTrendingMovie: movie = {
            poster_path: data.results[i].poster_path,
            title: checkNameVariant,
            rating: roundedNumber.toFixed(1),
        };
        trendingMovies.push(newTrendingMovie);
        printTrendingMovies();
    }
}

function printTrendingMovies() {
    const trendingCard = document.createElement("section") as HTMLElement;
    trendingCard.setAttribute("id", "trendingcard");
    trendingTab.innerHTML = "";
    for (let i = 0; i < trendingMovies.length; i++) {
        const posterCard = new Image();
        posterCard.setAttribute("class", "trending-poster");
        posterCard.src = imageUrl + trendingMovies[i].poster_path;
        const movieTitleCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        movieTitleCard.innerHTML = trendingMovies[i].title;
        const movieRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        movieRatingCard.innerHTML = `Rating:`;

        const ratingValue = document.createElement("p") as HTMLParagraphElement;
        ratingValue.innerHTML = trendingMovies[i].rating.toString();

        changeColorByValue(trendingMovies[i].rating.toString());

        const addToWatchlistButton = document.createElement(
            "input"
        ) as HTMLInputElement;

        addToWatchlistButton.setAttribute("type", "submit");
        addToWatchlistButton.setAttribute("value", "Add to Watchlist");
        addToWatchlistButton.setAttribute("class", "trending-buttons");
        addToWatchlistButton.setAttribute("id", "trending-add");

        trendingTab.appendChild(trendingCard);
        trendingCard.appendChild(posterCard);
        trendingCard.appendChild(movieTitleCard);
        trendingCard.appendChild(movieRatingCard);
        trendingCard.appendChild(ratingValue);

        trendingCard.appendChild(addToWatchlistButton);

        addToWatchlistButton.addEventListener("click", () => {
            const index = trendingMovies[i];
            addToWatchlistButton.setAttribute("value", "Added to Watchlist!");
            addToWatchlistButton.style.backgroundColor = "grey";
            addMovie(index);
        });

        function changeColorByValue(value: string) {
            if (parseInt(value) >= 6.5) {
                ratingValue.style.color = "Green";
            }
            if (parseInt(value) <= 6.4 && parseInt(value) >= 5.6) {
                ratingValue.style.color = "Yellow";
            }
            if (parseInt(value) <= 5.5) {
                ratingValue.style.color = "Red";
            }
        }
    }
}
getTrendingMovies();

function addMovie(addedWatchListMovie: movie) {
    if (
        userWatchList.find((movie) => movie.title === addedWatchListMovie.title)
    ) {
        alert(`${addedWatchListMovie.title} already exists in your watchlist!`);
        return;
    }
    userWatchList.push(addedWatchListMovie);
    printWatchList();
}

function printWatchList() {
    watchlistTab.innerHTML = "";

    //för varje film i listan
    for (let i = 0; i < userWatchList.length; i++) {
        const currentMovie = userWatchList[i];
        //skapa kort och sätt klass och id
        let watchListCard = document.createElement("section") as HTMLElement;
        watchListCard.setAttribute("class", "watchlist-card");
        watchListCard.id = "movie" + i;

        //skapa bild och sätt klass och src
        const watchListPosterCard = new Image();
        watchListPosterCard.setAttribute("class", "watchlist-poster");
        watchListPosterCard.src = imageUrl + currentMovie.poster_path;

        //skapa titel
        const watchListMovieTitle = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        watchListMovieTitle.innerHTML = currentMovie.title;
        const watchListRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        watchListRatingCard.innerHTML = `Rating: ${currentMovie.rating.toString()}`;
        const watchlistRemoveButton = document.createElement(
            "input"
        ) as HTMLInputElement;

        watchlistRemoveButton.setAttribute("value", "Remove");
        watchlistRemoveButton.setAttribute("type", "submit");
        watchlistRemoveButton.setAttribute("class", "remove-watchlist");

        watchlistTab.appendChild(watchListCard);
        watchListCard.appendChild(watchListPosterCard);
        watchListCard.appendChild(watchListMovieTitle);
        watchListCard.appendChild(watchListRatingCard);
        watchListCard.appendChild(watchlistRemoveButton);

        watchlistRemoveButton.addEventListener("click", (event) => {
            event.preventDefault();

            const movieIndex = userWatchList.findIndex(
                (movie) => movie.title === currentMovie.title
            );
            printSearchResults();
            printTopMovies();
            printMovieNowPlayingMovies();
            printTrendingMovies();
            userWatchList.splice(movieIndex, 1);
            watchlistTab.removeChild(watchListCard);
        });
    }
}

function printSearchResults() {
    const searchedMovieCard = document.createElement("section") as HTMLElement;
    maincontentArea.innerHTML = "";

    for (let i: number = 0; i < searchedMovies.length; i++) {
        searchedMovieCard.id = "searched-movie-id" + i;
        const searchedPosterCard = new Image();
        searchedPosterCard.setAttribute("class", "searched-movie-poster");
        searchedPosterCard.src = imageUrl + searchedMovies[i].poster_path;

        const movieTitleCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        movieTitleCard.setAttribute("class", "searched-movie-title");
        movieTitleCard.innerHTML = searchedMovies[i].title;
        const movieRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        movieRatingCard.innerHTML = `Rating: ${searchedMovies[
            i
        ].rating.toString()}`;

        maincontentArea.appendChild(searchedMovieCard);
        searchedMovieCard.appendChild(searchedPosterCard);
        searchedMovieCard.appendChild(movieTitleCard);
        searchedMovieCard.appendChild(movieRatingCard);

        searchedPosterCard.addEventListener("click", (event) => {
            event.preventDefault();
            moviePage.push(searchedMovies[i]);
            printMoviePage(searchedMovies[i]);
        });
    }
}

async function getTopMovies() {
    const response = await fetch(topMoviesUrl + apiKey);
    const data = await response.json();

    for (let i = 0; i < data.results.length; i++) {
        const nameVariants = data.results[i].title ?? data.results[i].name;

        const roundedNumber = data.results[i].vote_average;

        const releaseDateNameVariants =
            data.results[i].release_date ?? data.results[i].first_air_date;

        const newtopMovies: movie = {
            poster_path: data.results[i].poster_path,
            title: nameVariants,
            rating: roundedNumber.toFixed(1),
            release: releaseDateNameVariants,
            overview: data.results[i].overview,
        };
        topMovies.push(newtopMovies);
        printTopMovies();
    }
}
topMoviesButton.addEventListener("click", (event) => {
    event.preventDefault();
    getTopMovies();
});

function printTopMovies() {
    maincontentArea.innerHTML = "";

    for (let i: number = 0; i < topMovies.length; i++) {
        const topMoviesCard = document.createElement("section") as HTMLElement;
        topMoviesCard.setAttribute("id", "top-movie-card");
        const topMoviePosterCard = new Image();
        topMoviePosterCard.src = imageUrl + topMovies[i].poster_path;
        topMoviePosterCard.setAttribute("class", "top-movie-poster");

        const movieTitleCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        movieTitleCard.setAttribute("class", "searched-movie-title");
        movieTitleCard.innerHTML = topMovies[i].title;
        const movieRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        movieRatingCard.innerHTML = `Rating: ${topMovies[i].rating.toString()}`;

        const addToWatchlistButton = document.createElement(
            "input"
        ) as HTMLInputElement;
        addToWatchlistButton.setAttribute("id", "add-to-watchlist");
        addToWatchlistButton.setAttribute("type", "submit");
        addToWatchlistButton.setAttribute("value", "Add to Watchlist");

        maincontentArea.appendChild(topMoviesCard);
        topMoviesCard.appendChild(topMoviePosterCard);
        topMoviesCard.appendChild(movieTitleCard);
        topMoviesCard.appendChild(movieRatingCard);
        topMoviesCard.appendChild(addToWatchlistButton);

        topMoviePosterCard.addEventListener("click", (event) => {
            event.preventDefault();
            moviePage.push(topMovies[i]);
            printMoviePage(topMovies[i]);
        });

        addToWatchlistButton.addEventListener("click", () => {
            const index = topMovies[i];
            addMovie(index);
        });
    }
}

function printMoviePage(moviePage: movie) {
    maincontentArea.innerHTML = "";
    const selectedMovie = moviePage;

    const moviePageCard = document.createElement("section") as HTMLElement;
    moviePageCard.setAttribute("class", "moviePageCard");

    const movepagePosterCard = new Image();
    movepagePosterCard.src = imageUrl + selectedMovie.poster_path;
    movepagePosterCard.setAttribute("class", "page-movie-poster");
    const movieTitleCard = document.createElement("p") as HTMLParagraphElement;
    movieTitleCard.setAttribute("class", "top-movie-title");
    movieTitleCard.innerHTML = selectedMovie.title;
    const movieRatingCard = document.createElement("p") as HTMLParagraphElement;
    movieRatingCard.innerHTML = `Rating: ${selectedMovie.rating.toString()}`;

    const movieReleaseDate = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    movieReleaseDate.innerHTML = `Release Date: 
    ${selectedMovie.release?.toString() || ""}`;

    const movieOverviewHeader = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    movieOverviewHeader.innerHTML = `Story Overview`;
    const overview = document.createElement("p") as HTMLParagraphElement;
    overview.innerHTML = selectedMovie.overview?.toString() || "";

    const addToWatchlistButton = document.createElement(
        "input"
    ) as HTMLInputElement;
    addToWatchlistButton.setAttribute("id", "add-to-watchlist");
    addToWatchlistButton.setAttribute("type", "submit");
    addToWatchlistButton.setAttribute("value", "Add to Watchlist");

    maincontentArea.appendChild(moviePageCard);
    moviePageCard.appendChild(movepagePosterCard);
    moviePageCard.appendChild(movieTitleCard);
    moviePageCard.appendChild(movieRatingCard);
    moviePageCard.appendChild(movieReleaseDate);
    moviePageCard.appendChild(movieOverviewHeader);
    moviePageCard.appendChild(overview);
    moviePageCard.appendChild(addToWatchlistButton);

    addToWatchlistButton.addEventListener("click", () => {
        const index = selectedMovie;
        addMovie(index);
    });
}

function printMovieNowPlayingMovies() {
    maincontentArea.innerHTML = "";
    const nowPlayingHeading = document.createElement(
        "h4"
    ) as HTMLHeadingElement;
    nowPlayingHeading.innerHTML = "Now Playing";
    nowPlayingHeading.setAttribute("class", "header-now-playing");
    for (let i: number = 0; i < nowPlayingMovies.length; i++) {
        const moviesCard = document.createElement("section") as HTMLElement;
        moviesCard.setAttribute("class", "now-playing-movie-card");
        const moviePosterCard = new Image();
        moviePosterCard.setAttribute("class", "now-playing-movie-poster");
        moviePosterCard.src = imageUrl + nowPlayingMovies[i].poster_path;

        const movieTitleCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        movieTitleCard.setAttribute("class", "movie-title");
        movieTitleCard.innerHTML = nowPlayingMovies[i].title;
        const movieRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        movieRatingCard.innerHTML = `Rating: ${nowPlayingMovies[
            i
        ].rating.toString()}`;

        const addToWatchlistButton = document.createElement(
            "input"
        ) as HTMLInputElement;
        addToWatchlistButton.setAttribute("id", "add-to-watchlist");
        addToWatchlistButton.setAttribute("type", "submit");
        addToWatchlistButton.setAttribute("value", "Add to Watchlist");

        maincontentArea.appendChild(nowPlayingHeading);
        maincontentArea.appendChild(moviesCard);
        moviesCard.appendChild(moviePosterCard);
        moviesCard.appendChild(movieTitleCard);
        moviesCard.appendChild(movieRatingCard);
        moviesCard.appendChild(addToWatchlistButton);

        addToWatchlistButton.addEventListener("click", () => {
            const index = nowPlayingMovies[i];
            addMovie(index);
        });

        moviePosterCard.addEventListener("click", (event) => {
            event.preventDefault();
            moviePage.push(nowPlayingMovies[i]);
            printMoviePage(nowPlayingMovies[i]);
        });
    }
}

async function getTopTvShows() {
    const response = await fetch(topTvShowsUrl + apiKey);
    const data = await response.json();

    for (let i = 0; i < data.results.length; i++) {
        const nameVariants = data.results[i].title ?? data.results[i].name;

        const roundedNumber = data.results[i].vote_average;

        const newtopTvShows: movie = {
            poster_path: data.results[i].poster_path,
            title: nameVariants,
            rating: roundedNumber.toFixed(1),
            release: data.results[i].release,
            overview: data.results[i].overview,
        };
        tpTvShows.push(newtopTvShows);
        printMovie(newtopTvShows);
    }

    function printMovie(data: movie) {
        maincontentArea.innerHTML = "";
        for (let i: number = 0; i < tpTvShows.length; i++) {
            const moviesCard = document.createElement("section") as HTMLElement;
            moviesCard.setAttribute("id", "movie-card");
            const moviePosterCard = new Image();
            moviePosterCard.src = imageUrl + tpTvShows[i].poster_path;
            moviePosterCard.setAttribute("class", "movie-poster");

            const movieTitleCard = document.createElement(
                "p"
            ) as HTMLParagraphElement;
            movieTitleCard.setAttribute("class", "movie-title");
            movieTitleCard.innerHTML = tpTvShows[i].title;
            const movieRatingCard = document.createElement(
                "p"
            ) as HTMLParagraphElement;
            movieRatingCard.innerHTML = `Rating: ${tpTvShows[
                i
            ].rating.toString()}`;

            const addToWatchlistButton = document.createElement(
                "input"
            ) as HTMLInputElement;
            addToWatchlistButton.setAttribute("id", "add-to-watchlist");
            addToWatchlistButton.setAttribute("type", "submit");
            addToWatchlistButton.setAttribute("value", "Add to Watchlist");

            maincontentArea.appendChild(moviesCard);
            moviesCard.appendChild(moviePosterCard);
            moviesCard.appendChild(movieTitleCard);
            moviesCard.appendChild(movieRatingCard);
            moviesCard.appendChild(addToWatchlistButton);

            addToWatchlistButton.addEventListener("click", () => {
                const index = tpTvShows[i];
                addMovie(index);
            });
        }
    }
}
