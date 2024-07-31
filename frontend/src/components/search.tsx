import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";

interface Movie {
    id: number | string;
    title: string;
    poster_path: string | null;
    overview: string;
    isLiked: boolean;
}

interface SearchComponentProps {
    onSearchResults: (results: Movie[]) => void;
    onClearSearch: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
    onSearchResults,
    onClearSearch,
}) => {
    const apiKey = "ceba03f56c18f997a242eb118d552605";
    const [searchTerm, setSearchTerm] = useState("");
    //const [searchResults, setSearchResults] = useState<Movie[]>([]);
    //const [showPopup, setShowPopup] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value);
    };

    const performSearch = useCallback(async () => {
        if (!searchTerm) return;

        setIsSearching(true);
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}&with_genres=16`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const moviesWithLikedStatus: Movie[] = data.results.map(
                (movie: any) => ({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    overview: movie.overview,
                    isLiked: false,
                })
            );

            //setSearchResults(moviesWithLikedStatus);
            //setShowPopup(true);
            onSearchResults(moviesWithLikedStatus);
        } catch (error) {
            console.error(error);
            //setSearchResults([]);
            onSearchResults([]);
        }
    }, [searchTerm, apiKey, onSearchResults]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch();
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        //setSearchResults([]);
        //setShowPopup(false);
        setIsSearching(false);
        onClearSearch();
    };

    useEffect(() => {
        if (!searchTerm) {
            //setSearchResults([]);
            //setShowPopup(false);
        }
    }, [searchTerm]);

    return (
        <div className="relative">
            <form onSubmit={handleSubmit}>
                <div className="bg-green-400 flex flex-row justify-between items-center">
                    <input
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="bg-gray-300 h-[28px] px-2 italic text-black focus:outline-none w-full"
                        placeholder="Search"
                    />
                    <button
                        type="button"
                        onClick={
                            isSearching ? handleClearSearch : performSearch
                        }
                        className="bg-gray-300 px-4 py-[2px]">
                        <FontAwesomeIcon
                            icon={isSearching ? faTimes : faMagnifyingGlass}
                        />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchComponent;
/*
{showPopup && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 shadow-lg z-10 max-h-96 overflow-y-auto">
                    <ul>
                        {searchResults.map((movie) => (
                            <li
                                key={movie.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectMovie(movie)}>
                                {movie.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
                */
