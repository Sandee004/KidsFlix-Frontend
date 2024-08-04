import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Props {
    movieList: Movie[];
    addFavourite: (updatedMovieList: Movie[]) => void;
}

interface Movie {
    title: string;
    poster_path: string | null;
    overview: string;
    isLiked: boolean;
    id: number | string;
}

const MovieComponent = ({ movieList }: Props) => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [favorites, setFavorites] = useState<(number | string)[]>([]);
    const [localMovieList, setLocalMovieList] = useState(movieList);
    const API_BASE_URL = "https://kidsflix-backend.onrender.com/api";

    console.log(localMovieList);

    useEffect(() => {
        const fetchFavoritesAndUpdateMovies = async () => {
            const fetchedFavorites = await fetchFavorites();
            setFavorites(fetchedFavorites);
            updateMovieListWithFavorites(fetchedFavorites);
        };

        fetchFavoritesAndUpdateMovies();
    }, []);

    useEffect(() => {
        setLocalMovieList(movieList);
    }, [movieList]);

    const updateMovieListWithFavorites = (favs: (number | string)[]) => {
        setLocalMovieList((prevList) =>
            prevList.map((movie) => ({
                ...movie,
                isLiked: favs.includes(movie.id),
            }))
        );
    };

    const fetchWithAuth = async (
        url: string,
        options: RequestInit = {},
        showModalOnError: boolean = true
    ) => {
        const token = localStorage.getItem("token");
        if (!token) {
            if (showModalOnError) setShowLoginModal(true);
            throw new Error("No token found");
        }

        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401 || response.status === 422) {
            localStorage.removeItem("token");
            setShowLoginModal(true);
            throw new Error("Invalid token");
        }

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response;
    };

    const fetchFavorites = async (showModalOnError: boolean = false) => {
        try {
            const response = await fetchWithAuth(
                "/favourites",
                {},
                showModalOnError
            );
            const favoritesData = await response.json();
            return favoritesData.map((fav: any) => fav.movie_id);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            return [];
        }
    };

    const handleFavouriteClick = async (movie: Movie) => {
        setIsLoading(true);
        try {
            const result = await toogleFavourite(movie);
            const newFavorites =
                result.action === "added"
                    ? [...favorites, movie.id]
                    : favorites.filter((id) => id !== movie.id);

            setFavorites(newFavorites);

            setLocalMovieList((prevList) =>
                prevList.map((m) => ({
                    ...m,
                    isLiked:
                        m.id === movie.id
                            ? result.action === "added"
                            : m.isLiked,
                }))
            );
        } catch (error) {
            console.error("Error handling favourite: ", error);
            if (error instanceof Error && error.message === "No token found") {
                setShowLoginModal(true);
            } else if (
                error instanceof Error &&
                error.message === "Invalid token"
            ) {
                setShowLoginModal(true);
            } else {
                alert("Failed to add favourite. Please try again");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toogleFavourite = async (movie: Movie) => {
        const response = await fetchWithAuth(
            "/toogle_favourites",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movie_id: movie.id,
                    title: movie.title,
                }),
            },
            true
        );

        return await response.json();
    };
    /*   const updateMovieListWithFavorites = (favs: (number | string)[]) => {
        setLocalMovieList((prevList) =>
            prevList.map((movie) => ({
                ...movie,
                isLiked: favs.includes(movie.id),
            }))
        );
    };

    const fetchFavorites = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(
                "https://kidsflix-backend.onrender.com/api/favourites",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                setShowLoginModal(true);
                return;
            }

            if (!response.ok) throw new Error("Failed to fetch favorites");

            const favoritesData = await response.json();
            return favoritesData.map((fav: any) => fav.movie_id);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const handleFavouriteClick = async (movie: Movie) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setShowLoginModal(true);
            return;
        }

        try {
            await validateToken(token);
            const result = await toogleFavourite(movie);

            let newFavorites;
            if (result.action === "added") {
                newFavorites = [...favorites, movie.id];
            } else {
                newFavorites = favorites.filter((id) => id !== movie.id);
            }
            setFavorites(newFavorites);

            const updatedMovieList = movieList.map((m) =>
                m.id === movie.id
                    ? { ...m, isLiked: newFavorites.includes(m.id) }
                    : m
            );
            addFavourite(updatedMovieList);
        } catch (error) {
            console.error("Error handling favourite: ", error);
            if (error instanceof Response && error.status === 422) {
                setShowLoginModal(true);
            } else {
                alert("Failed to add favourite. Please try again");
            }
        }
    };

    const validateToken = async (token: string) => {
        const response = await fetch(
            "https://kidsflix-backend.onrender.com/api/check-token",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 401 || response.status === 422) {
            localStorage.removeItem("token");
            setShowLoginModal(true);
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to check token");
        }
    };

    const toogleFavourite = async (movie: Movie) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            "https://kidsflix-backend.onrender.com/api/toogle_favourites",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    movie_id: movie.id,
                    title: movie.title,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add favorite");
        }

        return await response.json();
    };

    */
    const heartPopAnimation = {
        scale: [1],
        transition: { duration: 0.2 },
    };

    return (
        <>
            <div className="flex flex-wrap mb-8 rounded-md text-white text-center px-5 flex-row justify-center mt-12">
                {movieList.map((movie) => (
                    <div
                        key={movie.title}
                        className="mx-5 bg-[#373b69] mb-5 w-[300px] h-[350px] hover:cursor-pointer hover:underline italic">
                        {movie.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-[270px]"
                            />
                        )}
                        <div className="flex justify-between items-center h-[80px]">
                            <h3
                                onClick={() => navigate(`/movies/${movie.id}`)}
                                className="text-[17px] font-bold text-white px-3">
                                {movie.title}
                            </h3>
                            <motion.button
                                animate={
                                    favorites.includes(movie.id)
                                        ? { scale: 1.3 }
                                        : heartPopAnimation
                                }
                                onClick={() => handleFavouriteClick(movie)}>
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className={`border-black text-xl mr-5 ${
                                        favorites.includes(movie.id)
                                            ? "text-red-500"
                                            : "text-white"
                                    }`}
                                />
                            </motion.button>
                        </div>
                    </div>
                ))}
            </div>

            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-51">
                    <div className="bg-white p-6 rounded-lg">
                        <p>Please sign up to add favorites.</p>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mr-2">
                            Sign Up
                        </button>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="bg-gray-300 px-4 py-2 rounded mt-4">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
        </>
    );
};

export default MovieComponent;
