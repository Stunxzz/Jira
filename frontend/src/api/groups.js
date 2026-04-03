import { apiFetch } from "./client";

export const getGroups = () => {
    return apiFetch("/groups/");
};

export const getGroup = (id) => {
    return apiFetch(`/groups/${id}/`);
};

export const createGroup = (data) => {
    return apiFetch("/groups/", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateGroup = (id, data) => {
    return apiFetch(`/groups/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

export const deleteGroup = (id) => {
    return apiFetch(`/groups/${id}/`, {
        method: "DELETE",
    });
};

export const addUserToGroup = (groupId, userId) => {
    return apiFetch(`/groups/${groupId}/add_user/`, {
        method: "POST",
        body: JSON.stringify({ user: userId }),
    });
};