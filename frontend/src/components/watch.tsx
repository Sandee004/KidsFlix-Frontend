import React, { useState, useEffect } from "react";

interface WatchNowButtonProps {
    movieId: number | string;
    title: string;
}

const WatchNowButton: React.FC<WatchNowButtonProps> = ({ movieId, title }) => {
    const [streamingInfo, setStreamingInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const apiKey = "ceba03f56c18f997a242eb118d552605";

    useEffect(() => {
        const fetchStreamingInfo = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`
                );
                const data = await response.json();

                // For this example, we'll use the US provider. Adjust as needed.
                setStreamingInfo(data.results.US);
            } catch (error) {
                console.error("Error fetching streaming info:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStreamingInfo();
    }, [movieId]);

    const handleClick = () => {
        if (streamingInfo) {
            if (streamingInfo.flatrate) {
                const netflix = streamingInfo.flatrate.find(
                    (provider: any) => provider.provider_name === "Netflix"
                );
                const prime = streamingInfo.flatrate.find(
                    (provider: any) =>
                        provider.provider_name === "Amazon Prime Video"
                );

                if (netflix) {
                    window.open(
                        `https://www.netflix.com/search?q=${encodeURIComponent(
                            title
                        )}`,
                        "_blank"
                    );
                } else if (prime) {
                    window.open(
                        `https://www.amazon.com/s?k=${encodeURIComponent(
                            title
                        )}&i=instant-video`,
                        "_blank"
                    );
                } else {
                    // If neither Netflix nor Prime, open the TMDB page
                    window.open(
                        `https://www.themoviedb.org/movie/${movieId}/watch`,
                        "_blank"
                    );
                }
            } else {
                // If no flatrate options, open the TMDB page
                window.open(
                    `https://www.themoviedb.org/movie/${movieId}/watch`,
                    "_blank"
                );
            }
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
