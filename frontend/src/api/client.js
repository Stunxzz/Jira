const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshPromise = null;

export async function apiFetch(url, options = {}, accessToken = null) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const makeRequest = () =>
        fetch(API_URL + url, {
            credentials: "include",
            headers,
            ...options,
        });

    let res = await makeRequest();

    // ако token е изтекъл → refresh
    if (res.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshToken();
        }

        try {
            const newToken = await refreshPromise;
            isRefreshing = false;

            headers["Authorization"] = `Bearer ${newToken.access}`;

            res = await makeRequest();
        } catch (err) {
            isRefreshing = false;
            throw err;
        }
    }

    let data = null;
    try {
        data = await res.json();
    } catch {}

    if (!res.ok) {
        const error = new Error("API Error");
        error.response = data;
        error.status = res.status;
        throw error;
    }

    return data;
}

export async function refreshToken() {
    const res = await fetch(API_URL + "/token/refresh/", {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Refresh failed");
    }

    return res.json();
}