import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const data = {
            username,
            email,
        };
        const url = "https://kidsflix-backend.onrender.com/api/login";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Login failed";
                setIsLoading(false);
                alert(errorMessage);
            } else {
                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during login");
        }
    };

    return (
        <>
            <p className="font-bold text-2xl text-center my-10">Login</p>

            <form
                className="flex flex-col justify-center items-center"
                onSubmit={submitForm}>
                <input
                    placeholder="Username"
                    className="border-black italic  border-2 rounded-sm px-5 py-2 w-[80%] my-2 "
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />

                <input
                    placeholder="Email"
                    className="border-black italic  border-2 rounded-sm px-5 py-2 w-[80%] my-2 "
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                <button
                    className="bg-[#373b69] w-[80%] py-2 rounded-sm hover:bg-[#22254b] text-white font-bold mt-2"
                    type="submit">
                    Login
                </button>
            </form>

            <p className="my-4 text-center">
                Don't have an account?
                <span className="text-[#373b69]">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
        </>
    );
};

export default LoginPage;
