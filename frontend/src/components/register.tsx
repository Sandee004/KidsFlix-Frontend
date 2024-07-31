import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            username,
            email,
        };
        const url = "https://kidsflix-backend.onrender.com/api/register";
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
                const error = await response.json();
                const errorMessage = error.message || "Signup failed";
                alert(errorMessage);
                return;
            }

            const loginResponse = await fetch(
                "https://kidsflix-backend.onrender.com/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, email }),
                }
            );

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                localStorage.setItem("token", loginData.access_token);
                navigate("/");
            } else {
                alert(
                    "Signup successful, but auto-login failed. Please log in manually."
                );
                navigate("/login");
            }
        } catch (error) {
            console.error("Error submitting signup:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    };
    return (
        <>
            <p className="font-bold text-2xl text-center my-10">Register</p>

            <form
                className="flex flex-col justify-center items-center"
                onSubmit={submitForm}>
                <input
                    placeholder="Username"
                    className="border-black italic  border-2 rounded-sm px-5 py-2 w-[80%] my-2 sm:w-[60%]"
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />

                <input
                    placeholder="Email"
                    className="border-black italic  border-2 rounded-sm px-5 py-2 w-[80%] my-2 sm:w-[60%]"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                <button
                    className="bg-[#373b69] text-white w-[80%] sm:w-[60%] py-2 rounded-sm hover:bg-[#22254b] font-bold mt-2"
                    type="submit">
                    SignUp
                </button>
            </form>

            <p className="mx-10 my-4">
                Already have an account?
                <span className="text-[#373b69]">
                    <Link to="/login">Login</Link>
                </span>
            </p>
        </>
    );
};

export default RegisterPage;
