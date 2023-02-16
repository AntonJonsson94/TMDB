const submitButton = document.querySelector("#submit") as HTMLElement;
const mainContentHeader = document.querySelector(
    "#main-content-header"
) as HTMLHeadingElement;
const trendingTab = document.querySelector("#trending") as HTMLElement;
const maincontentArea = document.querySelector(
    "#main-content-area"
) as HTMLElement;
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
const searchUrl = "https://api.themoviedb.org/3/search/multi";
const apiKey = "?api_key=aa5ee409d52ded21ba46b85a22480907";
const queryUrl = "&query=";
const imageUrl = "https://image.tmdb.org/t/p/w500//";
const trendingUrl = "https://api.themoviedb.org/3/trending/all/day";
const pageUrl = "&page=1";
const sortByUrl = "&sort_by=";
const discoverUrl = "https://api.themoviedb.org/3/discover/movie?";
const movieUrl = "https://api.themoviedb.org/3/movie/";
const creditsUrl = "/credits";

type movie = {
    id?: number;
    poster_path: string;
    title: string;
    rating: number;
    release?: number;
    overview?: string;
};
type credits = {
    cast: string[];
    crew: string[];
};

const searchedMovies: movie[] = [];
const topMovies: movie[] = [];
const topTvShows: movie[] = [];
const trendingMovies: movie[] = [];
const userWatchList: movie[] = [];
const nowPlayingMovies: movie[] = [];

let moviePage: movie[] = [];
let tvShowPage: movie[] = [];
let movieCredits: credits[] = [];

async function getNowPlayingMovies() {
    const response = await fetch(nowPlayingUrl + apiKey);
    const data = await response.json();

    for (let i: number = 0; i < data.results.length; i++) {
        const checkNameVariant = data.results[i].title ?? data.results[i].name;
        const roundedNumber = data.results[i].vote_average;

        const newNowPlayingMovies: movie = {
            id: data.results[i].id,
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
    maincontentArea.innerHTML = "";
    const inputField = document.querySelector("#input") as HTMLInputElement;
    const searchedMovie = inputField.value;
    mainContentHeader.innerHTML = `Search results for "${searchedMovie}"`;
    const response = await fetch(searchUrl + apiKey + queryUrl + searchedMovie);
    const data = await response.json();

    for (let i: number = 0; i < data.results.length; i++) {
        const nameVariants = data.results[i].title ?? data.results[i].name;
        const releaseDateNameVariants =
            data.results[i].release_date ?? data.results[i].first_air_date;
        const roundedNumber = data.results[i].vote_average.toFixed(1);

        const newSearchedMovies: movie = {
            id: data.results[i].id,
            poster_path: data.results[i].poster_path,
            title: nameVariants,
            rating: roundedNumber,
            release: releaseDateNameVariants.toString(),
            overview: data.results[i].overview,
        };
        searchedMovies.push(newSearchedMovies);
        printSearchResults();
    }
}

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    getSearchedMovie();
});

async function getTrendingMovies() {
    const response = await fetch(trendingUrl + apiKey);
    const data = await response.json();

    for (let i: number = 0; i < data.results.length; i++) {
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
    for (let i: number = 0; i < trendingMovies.length; i++) {
        const posterCard = new Image();
        posterCard.setAttribute("class", "trending-poster");
        posterCard.src = imageUrl + trendingMovies[i].poster_path;
        const nowPlayingTitleCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        nowPlayingTitleCard.innerHTML = trendingMovies[i].title;
        const nowPlayingRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        nowPlayingRatingCard.innerHTML = `Rating:`;

        const ratingValue = document.createElement("p") as HTMLParagraphElement;
        ratingValue.innerHTML = trendingMovies[i].rating.toString();

        ratingValue.setAttribute("id", "rating");
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
        trendingCard.appendChild(nowPlayingTitleCard);
        trendingCard.appendChild(nowPlayingRatingCard);
        trendingCard.appendChild(ratingValue);

        trendingCard.appendChild(addToWatchlistButton);

        addToWatchlistButton.addEventListener("click", () => {
            const index = trendingMovies[i];
            addToWatchlistButton.setAttribute("value", "Added to Watchlist!");
            addToWatchlistButton.disabled = true;
            addToWatchlistButton.style.backgroundColor = "lightgreen";
            addMovie(index);
        });

        function changeColorByValue(value: string) {
            if (parseInt(value) >= 6.5) {
                ratingValue.style.color = "lightgreen";
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
    for (let i: number = 0; i < userWatchList.length; i++) {
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
        watchListRatingCard.innerHTML = "Rating";
        const ratingValue = document.createElement("p") as HTMLParagraphElement;
        ratingValue.innerHTML = currentMovie.rating.toString();

        changeColorByValue(currentMovie.rating.toString());
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
        watchListCard.appendChild(ratingValue);
        watchListCard.appendChild(watchlistRemoveButton);

        function changeColorByValue(value: string) {
            if (parseInt(value) >= 6.5) {
                ratingValue.style.color = "lightgreen";
            }
            if (parseInt(value) <= 6.4 && parseInt(value) >= 5.6) {
                ratingValue.style.color = "Yellow";
            }
            if (parseInt(value) <= 5.5) {
                ratingValue.style.color = "Red";
            }
        }

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

        const nowPlayingTitleCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        nowPlayingTitleCard.setAttribute("class", "searched-movie-title");
        nowPlayingTitleCard.innerHTML = searchedMovies[i].title;
        const nowPlayingRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        nowPlayingRatingCard.innerHTML = "Rating:";

        const ratingValue = document.createElement("p") as HTMLParagraphElement;
        ratingValue.innerHTML = searchedMovies[i].rating.toString();
        changeColorByValue(searchedMovies[i].rating.toString());

        function changeColorByValue(value: string) {
            if (parseInt(value) >= 6.5) {
                ratingValue.style.color = "lightgreen";
            }
            if (parseInt(value) <= 6.4 && parseInt(value) >= 5.6) {
                ratingValue.style.color = "yellow";
            }
            if (parseInt(value) <= 5.5) {
                ratingValue.style.color = "Red";
            }
        }

        maincontentArea.appendChild(searchedMovieCard);
        searchedMovieCard.appendChild(searchedPosterCard);
        searchedMovieCard.appendChild(nowPlayingTitleCard);
        searchedMovieCard.appendChild(nowPlayingRatingCard);
        searchedMovieCard.appendChild(ratingValue);

        searchedPosterCard.addEventListener("click", (event) => {
            event.preventDefault();
            const id = searchedMovies[i].id;
            const parsedId = Number(id);

            getCredits(parsedId);
            moviePage.push(searchedMovies[i]);
            printMoviePage(searchedMovies[i]);
        });
    }
}

async function getTopMovies() {
    const response = await fetch(topMoviesUrl + apiKey);
    const data = await response.json();

    for (let i: number = 0; i < data.results.length; i++) {
        const nameVariants = data.results[i].title ?? data.results[i].name;

        const roundedNumber = data.results[i].vote_average;

        const releaseDateNameVariants =
            data.results[i].release_date ?? data.results[i].first_air_date;

        const newtopMovies: movie = {
            id: data.results[i].id,
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
    mainContentHeader.innerHTML = "Top Movies";
    for (let i: number = 0; i < topMovies.length; i++) {
        const topMoviesCard = document.createElement("section") as HTMLElement;
        topMoviesCard.setAttribute("id", "top-movie-card");
        const topMoviesPosterCard = new Image();
        topMoviesPosterCard.src = imageUrl + topMovies[i].poster_path;
        topMoviesPosterCard.setAttribute("class", "top-movie-poster");

        const topMoviesTitle = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        topMoviesTitle.setAttribute("class", "searched-movie-title");
        topMoviesTitle.innerHTML = topMovies[i].title;
        const topMoviesRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        topMoviesRatingCard.innerHTML = "Rating:";

        const ratingValue = document.createElement("p") as HTMLParagraphElement;
        ratingValue.innerHTML = topMovies[i].rating.toString();

        changeColorByValue(topMovies[i].rating.toString());

        function changeColorByValue(value: string) {
            if (parseInt(value) >= 6.5) {
                ratingValue.style.color = "lightgreen";
            }
            if (parseInt(value) <= 6.4 && parseInt(value) >= 5.6) {
                ratingValue.style.color = "yellow";
            }
            if (parseInt(value) <= 5.5) {
                ratingValue.style.color = "Red";
            }
        }

        const addToWatchlistButton = document.createElement(
            "input"
        ) as HTMLInputElement;
        addToWatchlistButton.setAttribute("id", "add-to-watchlist");
        addToWatchlistButton.setAttribute("type", "submit");
        addToWatchlistButton.setAttribute("value", "Add to Watchlist");

        maincontentArea.appendChild(topMoviesCard);
        topMoviesCard.appendChild(topMoviesPosterCard);
        topMoviesCard.appendChild(topMoviesTitle);
        topMoviesCard.appendChild(topMoviesRatingCard);
        topMoviesCard.appendChild(ratingValue);
        topMoviesCard.appendChild(addToWatchlistButton);

        topMoviesPosterCard.addEventListener("click", (event) => {
            event.preventDefault();
            const id = nowPlayingMovies[i].id;
            const parsedId = Number(id);

            console.log(parsedId);

            getCredits(parsedId);
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
    const moviePageCard = document.createElement("section") as HTMLElement;
    moviePageCard.setAttribute("class", "moviePageCard");

    const movepagePosterCard = new Image();
    movepagePosterCard.src = imageUrl + moviePage.poster_path;
    movepagePosterCard.setAttribute("class", "page-movie-poster");
    const nowPlayingTitleCard = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    nowPlayingTitleCard.setAttribute("class", "top-movie-title");
    nowPlayingTitleCard.innerHTML = moviePage.title;
    const nowPlayingRatingCard = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    nowPlayingRatingCard.innerHTML = "Rating:";

    const ratingValue = document.createElement("p") as HTMLParagraphElement;
    ratingValue.innerHTML = moviePage.rating.toString();
    changeColorByValue(moviePage.rating.toString());

    function changeColorByValue(value: string) {
        if (parseInt(value) >= 6.5) {
            ratingValue.style.color = "lightgreen";
        }
        if (parseInt(value) <= 6.4 && parseInt(value) >= 5.6) {
            ratingValue.style.color = "yellow";
        }
        if (parseInt(value) <= 5.5) {
            ratingValue.style.color = "Red";
        }
    }

    const movieReleaseDate = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    movieReleaseDate.innerHTML = `Release Date: 
    ${moviePage.release?.toString() || ""}`;

    const movieOverviewHeader = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    movieOverviewHeader.innerHTML = `Story Overview`;
    const overview = document.createElement("p") as HTMLParagraphElement;
    overview.setAttribute("class", "overview");
    overview.innerHTML = moviePage.overview?.toString() || "";

    // const movieCast = document.createElement("p") as HTMLParagraphElement;
    // console.log(movieCredits);
    // movieCast.innerHTML = movieCredits[0].cast[0];

    const addToWatchlistButton = document.createElement(
        "input"
    ) as HTMLInputElement;

    addToWatchlistButton.setAttribute("id", "add-to-watchlist");
    addToWatchlistButton.setAttribute("type", "submit");
    addToWatchlistButton.setAttribute("value", "Add to Watchlist");

    maincontentArea.appendChild(moviePageCard);
    mainContentHeader.innerHTML = moviePage.title;
    moviePageCard.appendChild(movepagePosterCard);
    moviePageCard.appendChild(nowPlayingRatingCard);
    moviePageCard.appendChild(ratingValue);
    moviePageCard.appendChild(movieReleaseDate);
    moviePageCard.appendChild(movieOverviewHeader);
    moviePageCard.appendChild(overview);

    moviePageCard.appendChild(addToWatchlistButton);

    addToWatchlistButton.addEventListener("click", () => {
        const index = moviePage;
        addToWatchlistButton.setAttribute("value", "Added to Watchlist!");

        addToWatchlistButton.style.backgroundColor = "lightgreen";
        addMovie(index);
    });
}

function printMovieNowPlayingMovies() {
    maincontentArea.innerHTML = "";
    mainContentHeader.innerHTML = "Now Playing";

    for (let i: number = 0; i < nowPlayingMovies.length; i++) {
        const nowPlayingCard = document.createElement("section") as HTMLElement;
        nowPlayingCard.setAttribute("class", "now-playing-movie-card");
        const nowPlayingPosterCard = new Image();
        nowPlayingPosterCard.setAttribute("class", "now-playing-movie-poster");
        nowPlayingPosterCard.src = imageUrl + nowPlayingMovies[i].poster_path;

        const nowPlayingTitleCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        nowPlayingTitleCard.setAttribute("class", "movie-title");
        nowPlayingTitleCard.innerHTML = nowPlayingMovies[i].title;
        const nowPlayingRatingCard = document.createElement(
            "p"
        ) as HTMLParagraphElement;
        nowPlayingRatingCard.innerHTML = "Rating:";

        const ratingValue = document.createElement("p") as HTMLParagraphElement;
        ratingValue.innerHTML = nowPlayingMovies[i].rating.toString();
        changeColorByValue(nowPlayingMovies[i].rating.toString());

        function changeColorByValue(value: string) {
            if (parseInt(value) >= 6.5) {
                ratingValue.style.color = "lightgreen";
            }
            if (parseInt(value) <= 6.4 && parseInt(value) >= 5.6) {
                ratingValue.style.color = "yellow";
            }
            if (parseInt(value) <= 5.5) {
                ratingValue.style.color = "Red";
            }
        }

        const addToWatchlistButton = document.createElement(
            "input"
        ) as HTMLInputElement;
        addToWatchlistButton.setAttribute("id", "add-to-watchlist");
        addToWatchlistButton.setAttribute("type", "submit");
        addToWatchlistButton.setAttribute("value", "Add to Watchlist");

        maincontentArea.appendChild(nowPlayingCard);
        nowPlayingCard.appendChild(nowPlayingPosterCard);
        nowPlayingCard.appendChild(nowPlayingTitleCard);
        nowPlayingCard.appendChild(nowPlayingRatingCard);
        nowPlayingCard.appendChild(ratingValue);
        nowPlayingCard.appendChild(addToWatchlistButton);

        addToWatchlistButton.addEventListener("click", () => {
            const index = nowPlayingMovies[i];
            addMovie(index);
        });

        nowPlayingPosterCard.addEventListener("click", (event) => {
            event.preventDefault();
            const id = nowPlayingMovies[i].id;
            const parsedId = Number(id);
            getCredits(parsedId);
            moviePage.push(nowPlayingMovies[i]);
            printMoviePage(nowPlayingMovies[i]);
        });
    }
}

async function getTopTvShows() {
    const response = await fetch(topTvShowsUrl + apiKey);
    const data = await response.json();

    for (let i: number = 0; i < data.results.length; i++) {
        const nameVariants = data.results[i].title ?? data.results[i].name;

        const roundedNumber = data.results[i].vote_average;

        const releaseDateNameVariants =
            data.results[i].release ?? data.results[i].first_air_date;

        const newtopTvShows: movie = {
            poster_path: data.results[i].poster_path,
            title: nameVariants,
            rating: roundedNumber.toFixed(1),
            release: releaseDateNameVariants,
            overview: data.results[i].overview,
        };
        topTvShows.push(newtopTvShows);
        printTopTvShows();
    }

    function printTopTvShows() {
        maincontentArea.innerHTML = "";
        mainContentHeader.innerHTML = "Top TV Shows";
        for (let i: number = 0; i < topTvShows.length; i++) {
            const tvShowCard = document.createElement("section") as HTMLElement;
            tvShowCard.setAttribute("id", "movie-card");
            const tvShowsPosterCard = new Image();
            tvShowsPosterCard.src = imageUrl + topTvShows[i].poster_path;
            tvShowsPosterCard.setAttribute("class", "movie-poster");

            const tvShowTitleCard = document.createElement(
                "p"
            ) as HTMLParagraphElement;
            tvShowTitleCard.setAttribute("class", "movie-title");
            tvShowTitleCard.innerHTML = topTvShows[i].title;
            const tvShowRatingCard = document.createElement(
                "p"
            ) as HTMLParagraphElement;
            tvShowRatingCard.innerHTML = "Rating:";

            const ratingValue = document.createElement(
                "p"
            ) as HTMLParagraphElement;
            ratingValue.innerHTML = topTvShows[i].rating.toString();

            changeColorByValue(topTvShows[i].rating.toString());

            function changeColorByValue(value: string) {
                if (parseInt(value) >= 6.5) {
                    ratingValue.style.color = "lightgreen";
                }
                if (parseInt(value) <= 6.4 && parseInt(value) >= 5.6) {
                    ratingValue.style.color = "yellow";
                }
                if (parseInt(value) <= 5.5) {
                    ratingValue.style.color = "Red";
                }
            }
            const addToWatchlistButton = document.createElement(
                "input"
            ) as HTMLInputElement;
            addToWatchlistButton.setAttribute("id", "add-to-watchlist");
            addToWatchlistButton.setAttribute("type", "submit");
            addToWatchlistButton.setAttribute("value", "Add to Watchlist");

            maincontentArea.appendChild(tvShowCard);
            tvShowCard.appendChild(tvShowsPosterCard);
            tvShowCard.appendChild(tvShowTitleCard);
            tvShowCard.appendChild(tvShowRatingCard);
            tvShowCard.appendChild(ratingValue);
            tvShowCard.appendChild(addToWatchlistButton);

            tvShowsPosterCard.addEventListener("click", (event) => {
                event.preventDefault();
                tvShowPage.push(topTvShows[i]);
                printTvShowPage(topTvShows[i]);
            });

            addToWatchlistButton.addEventListener("click", () => {
                const index = topTvShows[i];
                addMovie(index);
            });
        }
    }
}

function printTvShowPage(tvShowPage: movie) {
    maincontentArea.innerHTML = "";
    const selectedTvShow = tvShowPage;

    const tvShowPageCard = document.createElement("section") as HTMLElement;
    tvShowPageCard.setAttribute("class", "moviePageCard");

    const tvShowPosterCard = new Image();
    tvShowPosterCard.src = imageUrl + selectedTvShow.poster_path;
    tvShowPosterCard.setAttribute("class", "page-movie-poster");
    const tvShowTitleCard = document.createElement("p") as HTMLParagraphElement;
    tvShowTitleCard.setAttribute("class", "top-movie-title");
    tvShowTitleCard.innerHTML = selectedTvShow.title;
    const tvShowRatingCard = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    tvShowRatingCard.innerHTML = "Rating:";

    const ratingValue = document.createElement("p") as HTMLParagraphElement;
    ratingValue.innerHTML = selectedTvShow.rating.toString();

    changeColorByValue(selectedTvShow.rating.toString());

    function changeColorByValue(value: string) {
        if (parseInt(value) >= 6.5) {
            ratingValue.style.color = "lightgreen";
        }
        if (parseInt(value) <= 6.4 && parseInt(value) >= 5.6) {
            ratingValue.style.color = "yellow";
        }
        if (parseInt(value) <= 5.5) {
            ratingValue.style.color = "Red";
        }
    }

    const tvShowReleaseDate = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    tvShowReleaseDate.innerHTML = `Release Date: 
    ${selectedTvShow.release?.toString() || ""}`;

    const tvShowOverviewHeader = document.createElement(
        "p"
    ) as HTMLParagraphElement;
    tvShowOverviewHeader.innerHTML = `Story Overview`;
    const overview = document.createElement("p") as HTMLParagraphElement;
    overview.innerHTML = selectedTvShow.overview?.toString() || "";

    const addToWatchlistButton = document.createElement(
        "input"
    ) as HTMLInputElement;
    addToWatchlistButton.setAttribute("id", "add-to-watchlist");
    addToWatchlistButton.setAttribute("type", "submit");
    addToWatchlistButton.setAttribute("value", "Add to Watchlist");

    maincontentArea.appendChild(tvShowPageCard);
    tvShowPageCard.appendChild(tvShowPosterCard);
    mainContentHeader.innerHTML = selectedTvShow.title;
    tvShowPageCard.appendChild(tvShowRatingCard);
    tvShowPageCard.appendChild(ratingValue);
    tvShowPageCard.appendChild(tvShowReleaseDate);
    tvShowPageCard.appendChild(tvShowOverviewHeader);
    tvShowPageCard.appendChild(overview);
    tvShowPageCard.appendChild(addToWatchlistButton);

    if (userWatchList.find((movie) => movie.title === selectedTvShow.title)) {
        addToWatchlistButton.setAttribute(
            "value",
            "Already in Your Watchlist!"
        );
        addToWatchlistButton.style.backgroundColor = "lightgreen";
    }

    addToWatchlistButton.addEventListener("click", () => {
        const index = selectedTvShow;
        addToWatchlistButton.setAttribute("value", "Added to Watchlist!");
        addToWatchlistButton.style.backgroundColor = "lightgreen";

        addMovie(index);
    });
}

async function getCredits(id: number) {
    movieCredits = [];

    const response = await fetch(movieUrl + id + creditsUrl + apiKey);
    const data = await response.json();
    const castMembers: string[] = [];
    const crewMembers: string[] = [];

    for (let i: number = 0; i < data.cast.length; i++) {
        castMembers.push(data.cast[i].name);
    }
    for (let j: number = 0; j < data.crew.length; j++) {
        crewMembers.push(
            `${data.crew[j].name} (${data.crew[j].known_for_department})`
        );
    }
    const newCredits = {
        cast: castMembers,
        crew: crewMembers,
    };
    movieCredits.push(newCredits);
}
