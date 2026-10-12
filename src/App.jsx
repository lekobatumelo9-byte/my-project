import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <header>
        <h1>Community Library</h1>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          {' | '}
          <NavLink to="/books">Books</NavLink>
          {' | '}
          <NavLink to="/members">Members</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </main>
    </div>
  )
}

function Dashboard() {
  return <section><h2>Dashboard</h2><p>Welcome to the community library.</p></section>
}

function Books() {
  const [books, setBooks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('library-books')) ?? []
    } catch {
      return []
    }
  })

  const [form, setForm] = useState({ title: '', author: '' })

  useEffect(() => {
    localStorage.setItem('library-books', JSON.stringify(books))
  }, [books])

  function handleSubmit(event) {
    event.preventDefault()

    const newBook = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      author: form.author.trim(),
      available: true,
    }

    setBooks(currentBooks => [...currentBooks, newBook])
    setForm({ title: '', author: '' })
  }

  function toggleAvailability(bookId) {
    setBooks(currentBooks =>
      currentBooks.map(book =>
        book.id === bookId
          ? { ...book, available: !book.available }
          : book,
      ),
    )
  }
  function removeBook(bookId) {
  setBooks(currentBooks =>
    currentBooks.filter(book => book.id !== bookId),
  )
}

  return (
    <section>
      <h2>Books</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Book title
          <input
            required
            value={form.title}
            onChange={event =>
              setForm({ ...form, title: event.target.value })
            }
          />
        </label>

        <label>
          Author
          <input
            required
            value={form.author}
            onChange={event =>
              setForm({ ...form, author: event.target.value })
            }
          />
        </label>

        <button type="submit">Add book</button>
      </form>

      {books.length === 0 ? (
        <p>No books have been added yet.</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author}
              {' — '}
              {book.available ? 'Available' : 'Borrowed'}
              {' '}
              <button
                type="button"
                onClick={() => toggleAvailability(book.id)}
              >
                {book.available ? 'Mark borrowed' : 'Mark returned'}
                <button
  type="button"
  onClick={() => removeBook(book.id)}
>
  Remove
</button>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Members() {
  const [members, setMembers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('library-members')) ?? []
    } catch {
      return []
    }
  })

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Member',
  })

  useEffect(() => {
    localStorage.setItem('library-members', JSON.stringify(members))
  }, [members])

  function handleSubmit(event) {
    event.preventDefault()

    const newMember = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    }

    setMembers(currentMembers => [...currentMembers, newMember])
    setForm({ name: '', email: '', role: 'Member' })
  }

  function removeMember(memberId) {
    setMembers(currentMembers =>
      currentMembers.filter(member => member.id !== memberId),
    )
  }

  return (
    <section>
      <h2>Members</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={event =>
              setForm({ ...form, name: event.target.value })
            }
          />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={event =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>

        <label>
          Account type
          <select
            value={form.role}
            onChange={event =>
              setForm({ ...form, role: event.target.value })
            }
          >
            <option>Member</option>
            <option>Librarian</option>
          </select>
        </label>

        <button type="submit">Add account</button>
      </form>

      {members.length === 0 ? (
        <p>No accounts have been added yet.</p>
      ) : (
        <ul>
          {members.map(member => (
            <li key={member.id}>
              <strong>{member.name}</strong> — {member.email} ({member.role})
              {' '}
              <button
                type="button"
                onClick={() => removeMember(member.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Layout