/*
            <button className="hover:bg-red-600 text-white bg-red-500 px-4 rounded-sm mb-3 mr-5 py-1">
                Watch Now
            </button>
*/
import React, { useState, useEffect } from "react";

interface WatchNowButtonProps {
    movieId: number | string;
}

const WatchNowButton: React.FC<WatchNowButtonProps> = ({ movieId }) => {
    const [streamingLink, setStreamingLink] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const apiKey = "ceba03f56c18f997a242eb118d552605";

    useEffect(() => {
        const fetchStreamingInfo = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`
                );
                const data = await response.json();

                // For this example, we'll use the US provider. You might want to adjust this based on the user's location.
                const usProvider = data.results.US;
                if (usProvider && usProvider.link) {
                    setStreamingLink(usProvider.link);
                }
            } catch (error) {
                console.error("Error fetching streaming info:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStreamingInfo();
    }, [movieId]);

    const handleClick = () => {
        if (streamingLink) {
            window.open(streamingLink, "_blank");
        } else {
            alert(
                "Sorry, no streaming information is available for this movie."
            );
        }
    };

    if (isLoading) {
        return (
            <button
                className="hover:bg-red-600 text-white bg-red-500 px-4 rounded-sm mb-3 mr-5 py-1"
                disabled>
                Loading...
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className="hover:bg-red-600 text-white bg-red-500 px-4 rounded-sm mb-3 mr-5 py-1">
            Watch Now
        </button>
    );
};

export default WatchNowButton;
