import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

interface Movie {
    title: string;
    id: number | string;
}

const FavouritesPage = () => {
    const [favouriteMovies, setFavouriteMovies] = useState<Movie[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsLoggedIn(false);
                setIsLoading(false);
                return;
            }

            try {
                const validationResponse = await fetch(
                    "https://kidsflix-backend.onrender.com/api/check-token",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!validationResponse.ok) {
                    if (validationResponse.status === 401) {
                        localStorage.removeItem("token");
                        setIsLoggedIn(false);
                        setIsLoading(false);
                        return;
                    }
                    throw new Error("Failed to validate token");
                }

                setIsLoggedIn(true);
                await getFavourites();
            } catch (error) {
                console.error("Error:", error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkLogin();
    }, []);

    const getFavourites = async () => {
        const token = localStorage.getItem("token");

        try {
            const favouritesResponse = await fetch(
                "https://kidsflix-backend.onrender.com/api/favourites",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!favouritesResponse.ok) {
                throw new Error(
                    `Failed to fetch movies: ${favouritesResponse.statusText}`
                );
            }

            const data = await favouritesResponse.json();
            setFavouriteMovies(
                data.map((movie: { movie_id: any; title: any }) => ({
                    id: movie.movie_id,
                    title: movie.title,
                }))
            );
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const removeFav = async (movie: Movie) => {
        const token = localStorage.getItem("token");
        try {
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
                throw new Error("Failed to remove from favourites.");
            }
            const data = await response.json();
            if (data.action === "removed") {
                setFavouriteMovies((prevMovies) =>
                    prevMovies.filter(
                        (existingMovie) => existingMovie.id !== movie.id
                    )
                );
            } else {
                console.log("Unexpected response from server");
            }
        } catch (error) {
            console.error("Error removing movie: ", error);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="p-5 text-center">
                <p className="mb-4">
                    You are not logged in. Please log in to see your favourites.
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="bg-[#373b69] text-white px-4 py-2 rounded hover:bg-[#22254b]">
                    Log In
                </button>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <p className="font-bold my-5 text-2xl text-center">Favourites</p>
            {favouriteMovies.length > 0 ? (
                <div>
                    {favouriteMovies.map((movie) => (
                        <div
                            key={movie.id}
                            className="flex border-2 border-[#22254b] w-[90%] rounded-sm px-5 py-6 justify-between mb-5 mx-auto">
                            <div>
                                <h3 className="text-xl">{movie.title}</h3>
                            </div>
                            <button
                                onClick={() => removeFav(movie)}
                                className="hover:font-bold text-sm bg-red-500 text-black px-2 py-1 rounded">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="px-5 italic text-center">No favourites added.</p>
            )}
        </div>
    );
};

export default FavouritesPage;
