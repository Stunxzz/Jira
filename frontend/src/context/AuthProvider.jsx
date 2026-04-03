import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch, refreshToken } from "../api/client";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await refreshToken();
                const token = res.access;

                setAccessToken(token);

                // 2. Вземане на user profile с новия token
                const data = await apiFetch("/profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(data);
            } catch {
                // ако refresh fail → user не е логнат
                setUser(null);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                setAccessToken,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}