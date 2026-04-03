// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

export default function Dashboard() {
    const { user, accessToken, setUser, setAccessToken } = useAuth();

    const handleLogout = async () => {
        try {
            await apiFetch("/logout/", {
                method: "POST",
            });

            // чистим state-а
            setUser(null);
            setAccessToken(null);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <div className="bg-white p-4 rounded shadow">
                <p><strong>Token:</strong> {accessToken}</p>

                {user ? (
                    <div className="mt-3">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                    </div>
                ) : (
                    <p>No user loaded</p>
                )}
            </div>

            {/* 🔴 Logout бутон */}
            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}