import { useEffect, useState } from "react";
import MovieComponent from "./singleMovie";
import Navbar from "./navbar";
import SearchComponent from "./search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleChevronLeft,
    faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface Movie {
    title: string;
    poster_path: string | null;
    overview: string;
    isLiked: boolean;
    id: number | string;
}

const FetchComponent = () => {
    const apiKey = "ceba03f56c18f997a242eb118d552605";
    const [movieList, setMovieList] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const moviesPerPage = 12;

    useEffect(() => {
        if (!isSearching) {
            getAnimationMovies();
        }
    }, [isSearching]);

    const getAnimationMovies = async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=16`
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch movies: ${response.statusText}`
                );
            }
            const data = await response.json();
            const moviesWithLikedStatus = data.results.map((movie: Movie) => ({
                ...movie,
                isLiked: false,
            }));

            setMovieList(moviesWithLikedStatus);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const handleSearchResults = (results: Movie[]) => {
        setMovieList(results);
        setIsSearching(true);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setIsSearching(false);
        setCurrentPage(1);
        getAnimationMovies();
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movieList.slice(indexOfFirstMovie, indexOfLastMovie);

    const totalPages = Math.ceil(movieList.length / moviesPerPage);

    return (
        <>
            <Navbar />
            <div className="bg-white mx-auto py-10 mt-10 w-[95%] items-center justify-center">
                <div className="w-[98%] flex px-2 mx-auto justify-center items-center">
                    <p className="bg-[#22254b] px-2 py-1 flex items-center justify-center sm:w-1/3 text-white text-sm overflow-hidden">
                        {isSearching ? "SEARCH RESULTS" : "RECENTS"}
                    </p>
                    <div className="w-2/3">
                        <SearchComponent
                            onSearchResults={handleSearchResults}
                            onClearSearch={handleClearSearch}
                        />
                    </div>
                </div>
                <MovieComponent
                    movieList={currentMovies}
                    addFavourite={(updatedMovieList) =>
                        setMovieList(updatedMovieList)
                    }
                />
                {totalPages > 1 && (
                    <div className="mx-auto text-3xl text-[#22254b] flex flex-row justify-between items-center w-[60%] gap-5">
                        <button
                            disabled={currentPage === 1}
                            title="Previous Page"
                            className="hover:cursor-pointer"
                            onClick={() => handlePageChange(currentPage - 1)}>
                            <FontAwesomeIcon icon={faCircleChevronLeft} />
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            title="Next Page"
                            className="hover:cursor-pointer"
                            onClick={() => handlePageChange(currentPage + 1)}>
                            <FontAwesomeIcon icon={faCircleChevronRight} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default FetchComponent;
