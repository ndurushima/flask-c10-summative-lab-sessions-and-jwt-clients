import React, { useEffect, useState } from "react";

function authHeaders() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");


    async function load() {
        setLoading(true);
        setErr("");
        try {
            const res = await fetch(`/notes?page=${page}&per_page${perPage}`, {
                headers: authHeaders(),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Failed to load notes");
            setNotes(data.items);
            setTotal(data.total);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        load();
    }, [page, perPage]);


    async function createNote(e) {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        try {
            const res = await fetch("/notes", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ title: title.trim(), content: content.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Create failed");
            setTitle("");
            setContent("");
            setPage(1);
            await load();
        } catch (e) {
        setErr(e.message);
        }
    }


    async function removeNote(id) {
        try {
            const res = await fetch(`/notes/${id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.msg || "Delete failed");
            }
            setNotes((ns) => ns.filter((n) => n.id !== id));
            setTotal((t) => Math.max(0, t - 1));
        } catch (e) {
            setErr(e.message);
        }
    }


}