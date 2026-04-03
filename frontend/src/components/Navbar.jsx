import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

export default function Navbar() {
    const { user, setUser, setAccessToken } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiFetch("/logout/", {
                method: "POST",
            });

            setUser(null);
            setAccessToken(null);
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

                {/* Logo */}
                <div className="text-xl font-bold">
                    <Link to="/">MyApp</Link>
                </div>

                {/* Desktop menu */}
                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/dashboard" className="hover:text-blue-500">
                        Dashboard
                    </Link>

                    <Link to="/profile" className="hover:text-blue-500">
                        Profile
                    </Link>

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile button */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                        Dashboard
                    </Link>

                    <Link to="/profile" onClick={() => setOpen(false)}>
                        Profile
                    </Link>

                    {user && (
                        <button
                            onClick={() => {
                                setOpen(false);
                                handleLogout();
                            }}
                            className="text-left text-red-500"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}