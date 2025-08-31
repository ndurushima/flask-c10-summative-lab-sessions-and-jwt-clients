import React, { useEffect, useState } from "react";
import {
  Container, Title, CreateForm, NoteInput, NoteTextarea, ErrorText,
  List, Card, NoteTitle, NoteContent, Actions, Pager, PageInfo,
  Spacer, PerPageSelect, PrimaryBtn, GhostBtn, DangerBtn, NavBtn
} from "../styles/NotesStyles";


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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { load(); }, [page, perPage]);


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


    async function saveNote(id, patch) {
    try {
      const res = await fetch(`/notes/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Update failed");
      setNotes((ns) => ns.map((n) => (n.id === id ? data.note : n)));
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

    const pages = Math.max(1, Math.ceil(total / perPage));

    return (
        <Container>
        <Title>Your Notes</Title>

        <CreateForm onSubmit={createNote}>
            <NoteInput
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
            />
            <NoteTextarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            />
            <div>
            <PrimaryBtn variant="fill" color="primary">Add Note</PrimaryBtn>
            </div>
        </CreateForm>

        {err && <ErrorText>{err}</ErrorText>}

        {loading ? (
            <div>Loading…</div>
        ) : notes.length === 0 ? (
            <div>No notes yet.</div>
        ) : (
            <List>
            {notes.map((n) => (
                <NoteItem key={n.id} note={n} onSave={saveNote} onDelete={removeNote} />
            ))}
            </List>
        )}

        <Pager>
            <NavBtn disabled={page <= 1} onClick={() => setPage(1)}>⏮</NavBtn>
            <NavBtn disabled={page <= 1} onClick={() => setPage(page - 1)}>◀</NavBtn>
            <PageInfo>Page {page} / {pages}</PageInfo>
            <NavBtn disabled={page >= pages} onClick={() => setPage(page + 1)}>▶</NavBtn>
            <NavBtn disabled={page >= pages} onClick={() => setPage(pages)}>⏭</NavBtn>
            <Spacer>
            Per page:
            <PerPageSelect
                value={perPage}
                onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}
            >
                {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </PerPageSelect>
            </Spacer>
        </Pager>
        </Container>
    );
    }

function NoteItem({ note, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  return (
    <Card>
      {editing ? (
        <>
          <NoteInput value={title} onChange={(e) => setTitle(e.target.value)} />
          <NoteTextarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
          <Actions>
            <PrimaryBtn variant="fill" color="primary"
              onClick={() => { onSave(note.id, { title: title.trim(), content: content.trim() }); setEditing(false); }}>
              Save
            </PrimaryBtn>
            <GhostBtn onClick={() => { setTitle(note.title); setContent(note.content); setEditing(false); }}>
              Cancel
            </GhostBtn>
          </Actions>
        </>
      ) : (
        <>
          <NoteTitle>{note.title}</NoteTitle>
          <NoteContent>{note.content}</NoteContent>
          <Actions>
            <GhostBtn onClick={() => setEditing(true)}>Edit</GhostBtn>
            <DangerBtn onClick={() => onDelete(note.id)}>Delete</DangerBtn>
          </Actions>
        </>
      )}
    </Card>
  );
}
