import { useState, useEffect } from "react";
import { login, register } from "../api/auth";
import { formatErrors } from "../../utils/formatErrors.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function Auth() {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [form, setForm] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        password2: ""
    });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { setAccessToken, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errors]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);
        setSuccess(false);

        try {
            if (isLoginMode) {
                const res = await login({
                    email: form.email,
                    password: form.password
                });

                const token = res.access;

                // ✅ 1. set token
                setAccessToken(token);

                // ✅ 2. fetch user immediately
                const profile = await apiFetch("/profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(profile);

            } else {
                await register(form);
            }

            setSuccess(true);
            navigate("/dashboard");

        } catch (err) {
            setErrors(formatErrors(err?.response));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid place-items-center h-screen bg-cyan-400 p-2">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">

                <h1 className="text-2xl font-bold text-center mb-6">
                    {isLoginMode ? "Welcome back" : "Create account"}
                </h1>

                {/* Tabs */}
                <div className="relative flex h-12 mb-6 border rounded-full overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setIsLoginMode(true)}
                        className={`w-1/2 z-10 font-medium ${
                            isLoginMode ? "text-white" : "text-gray-700"
                        }`}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsLoginMode(false)}
                        className={`w-1/2 z-10 font-medium ${
                            !isLoginMode ? "text-white" : "text-gray-700"
                        }`}
                    >
                        Signup
                    </button>

                    <div
                        className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all ${
                            isLoginMode ? "left-0" : "left-1/2"
                        }`}
                    />
                </div>

                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                        Success!
                    </div>
                )}

                {errors.length > 0 && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        <ul className="list-disc pl-5">
                            {errors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {!isLoginMode && (
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                name="first_name"
                                placeholder="First name"
                                value={form.first_name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                            <input
                                name="last_name"
                                placeholder="Last name"
                                value={form.last_name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>
                    )}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    {!isLoginMode && (
                        <input
                            name="password2"
                            type="password"
                            placeholder="Confirm password"
                            value={form.password2}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 transition"
                    >
                        {loading
                            ? "Loading..."
                            : isLoginMode
                                ? "Login"
                                : "Create account"}
                    </button>
                </form>

                <p className="text-center text-sm mt-5 text-gray-600">
                    {isLoginMode
                        ? "Don't have an account?"
                        : "Already have an account?"}{" "}
                    <button
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-indigo-500 hover:underline"
                    >
                        {isLoginMode ? "Sign up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}