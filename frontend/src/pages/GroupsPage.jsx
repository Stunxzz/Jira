import { useEffect, useState } from "react";
import { getGroups, createGroup } from "../api/groups";
import { apiFetch } from "../api/client";

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // ✅ functions first
    const loadGroups = async () => {
        const data = await getGroups();
        setGroups(data);
    };

    const loadPermissions = async () => {
        const data = await apiFetch("/permissions/");
        setPermissions(data);
    };

    // ✅ hooks
    useEffect(() => {
        loadGroups();
        loadPermissions();
    }, []);

    const togglePermission = (id) => {
        setSelectedPermissions((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!name) return;

        await createGroup({
            name,
            permissions: selectedPermissions,
        });

        setName("");
        setSelectedPermissions([]);
        setShowForm(false);

        loadGroups();
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Groups</h1>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Group
                </button>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="border p-4 rounded mb-6 bg-gray-50">
                    <h2 className="font-semibold mb-3">New Group</h2>

                    {/* Group name */}
                    <input
                        type="text"
                        placeholder="Group name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full mb-3 rounded"
                    />

                    {/* Permissions */}
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto border p-3 rounded bg-white">
                        {permissions.map((perm) => (
                            <label
                                key={perm.id}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPermissions.includes(perm.id)}
                                    onChange={() => togglePermission(perm.id)}
                                />
                                <span className="text-sm">{perm.name}</span>
                            </label>
                        ))}
                    </div>

                    {/* Save */}
                    <button
                        onClick={handleCreate}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Save Group
                    </button>
                </div>
            )}

            {/* Groups table */}
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Permissions</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group) => (
                        <tr key={group.id}>
                            <td className="border p-2">{group.name}</td>
                            <td className="border p-2 text-sm">
                                {group.permissions_display?.join(", ")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}