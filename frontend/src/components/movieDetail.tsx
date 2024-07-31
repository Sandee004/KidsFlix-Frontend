import { useEffect, useState } from "react";
import Navbar from "./navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Props {
    movieList?: Movie[];
    addFavourite: (updatedMovieList: Movie[]) => void;
}

interface Movie {
    title: string;
    poster_path: string | null;
    overview: string;
    isLiked: boolean;
    id: number | string;
}

const MovieDetail = ({ movieList, addFavourite }: Props) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const apiKey = "ceba03f56c18f997a242eb118d552605";
    const receivedID = id;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [favorites, setFavorites] = useState<(number | string)[]>([]);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${receivedID}?api_key=${apiKey}`
            );
            const data = await response.json();
            const isLiked = favorites.includes(data.id);
            setMovie({ ...data, isLiked });
        };
        fetchMovieDetail();
    }, [id, favorites]);

    if (!movie) {
        return <p>Loading movie details...</p>;
    }

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

            setMovie((prevMovie) =>
                prevMovie
                    ? {
                          ...prevMovie,
                          isLiked: newFavorites.includes(prevMovie.id),
                      }
                    : null
            );

            // Only update movieList if it exists
            if (movieList) {
                const updatedMovieList = movieList.map((m) =>
                    m.id === movie.id
                        ? { ...m, isLiked: newFavorites.includes(m.id) }
                        : m
                );
                addFavourite(updatedMovieList);
            }
        } catch (error) {
            console.error("Error handling favourite: ", error);
            alert("Failed to add favourite. Please try again");
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

        if (response.status === 401) {
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

    return (
        <>
            <Navbar />
            <div className="bg-white w-[85%] text-black mx-auto py-8 flex flex-col md:flex-row justify-center items-center px-8 gap-8 my-10">
                <div className="bg-red-400 w-[300px] h-[320px]">
                    <img
                        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                        alt={movie.title}
                        className="border-white border-4 w-full h-full"
                    />
                </div>
                <div className="md:w-2/3">
                    <p className="text-2xl font-bold sm:text-3xl">
                        {movie.title}
                    </p>
                    <p>{movie.overview}</p>
                    <div className="my-5">
                        <button className="hover:bg-red-600 bg-red-500 px-4 rounded-sm mr-5 py-1">
                            Watch Now
                        </button>
                        <button
                            onClick={() => handleFavouriteClick(movie)}
                            className="hover:bg-slate-400 bg-slate-300 rounded-sm px-2 py-1 text-black">
                            {movie.isLiked
                                ? "Remove from Favourites"
                                : "Add to Favourites"}
                        </button>
                    </div>
                </div>
            </div>

            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p>Please log in to add favorites.</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mr-2">
                            Log In
                        </button>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="bg-gray-300 px-4 py-2 rounded mt-4">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MovieDetail;
