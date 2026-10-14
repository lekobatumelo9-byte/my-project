import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'

const readSaved = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function useSavedState(key, initialValue) {
  const [value, setValue] = useState(() => readSaved(key, initialValue))
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue]
}

function Layout() {
  const [books, setBooks] = useSavedState('library-books', [])
  const [members, setMembers] = useSavedState('library-members', [])
  const [transactions, setTransactions] = useSavedState('library-transactions', [])
  const [session, setSession] = useSavedState('library-session', null)
  const navigate = useNavigate()

  useEffect(() => {
    setBooks(current => {
      if (!current.some(book => book.quantity == null || book.availableCopies == null)) return current
      return current.map(book => {
        if (book.quantity != null && book.availableCopies != null) return book
        const total = book.quantity ?? 1
        const available = book.availableCopies ?? (book.available === false ? 0 : total)
        return { ...book, quantity: total, availableCopies: available }
      })
    })
  }, [setBooks])

  function addTransaction(book, quantity, action, note = '') {
    const amount = Number(quantity)
    if (!Number.isInteger(amount) || amount < 1) return false
    const available = Number(book.availableCopies ?? book.quantity ?? 0)
    const total = Number(book.quantity ?? available)
    if (action === 'deduct' && amount > available) return false
    if (action === 'add' && note.trim().toLowerCase() !== 'returned') {
      setBooks(current => current.map(item => item.id === book.id
        ? { ...item, quantity: total + amount, availableCopies: available + amount }
        : item))
    } else if (action === 'add') {
      setBooks(current => current.map(item => item.id === book.id
        ? { ...item, availableCopies: Math.min(total, available + amount) }
        : item))
    } else {
      setBooks(current => current.map(item => item.id === book.id
        ? { ...item, availableCopies: available - amount }
        : item))
    }
    setTransactions(current => [{
      id: crypto.randomUUID(), bookId: book.id, title: book.title,
      action, quantity: amount, note: note.trim(), date: new Date().toISOString(),
      user: session?.name ?? 'Administrator',
    }, ...current])
    return true
  }

  function signOut() {
    setSession(null)
    navigate('/login')
  }

  const admin = session?.role === 'Admin' || session?.role === 'Librarian'

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">B</span><div><h1>Bookhaven</h1><p>Community Library</p></div></div>
        <nav aria-label="Main navigation">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          {admin && <NavLink to="/users">Users</NavLink>}
        </nav>
        <div className="account-area">
          {session ? <><span className="account-name">{session.name}<small>{session.role}</small></span><button className="button button-light button-small" onClick={signOut}>Sign out</button></> : <NavLink className="button button-light button-small" to="/login">Sign in</NavLink>}
        </div>
      </header>
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard books={books} transactions={transactions} />} />
          <Route path="/books" element={<Books books={books} setBooks={setBooks} addTransaction={addTransaction} admin={admin} />} />
          <Route path="/transactions" element={<Transactions books={books} transactions={transactions} addTransaction={addTransaction} />} />
          <Route path="/users" element={admin ? <Users members={members} setMembers={setMembers} /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login members={members} setMembers={setMembers} setSession={setSession} session={session} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <footer>Bookhaven Library <span>•</span> Inventory and lending made simple</footer>
    </div>
  )
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="muted">{description}</p></div>{action}</div>
}

function Dashboard({ books, transactions }) {
  const total = books.reduce((sum, book) => sum + Number(book.quantity ?? book.availableCopies ?? 0), 0)
  const available = books.reduce((sum, book) => sum + Number(book.availableCopies ?? book.quantity ?? 0), 0)
  const lowStock = books.filter(book => Number(book.availableCopies ?? book.quantity ?? 0) < 2)
  return <>
    <PageHeading eyebrow="OVERVIEW" title="Library dashboard" description="A quick view of your collection and recent activity." />
    <div className="stats-grid">
      <StatCard label="Book titles" value={books.length} icon="▤" />
      <StatCard label="Total copies" value={total} icon="▥" />
      <StatCard label="Available now" value={available} icon="✓" />
      <StatCard label="Low stock titles" value={lowStock.length} icon="!" alert={lowStock.length > 0} />
    </div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-heading"><div><h3>Low stock</h3><p className="muted">Fewer than 2 copies available</p></div><NavLink to="/books" className="text-link">Manage books →</NavLink></div>
        {lowStock.length ? <div className="table-wrap"><table><thead><tr><th>Book</th><th>Author</th><th>Available</th></tr></thead><tbody>{lowStock.map(book => <tr key={book.id}><td className="strong">{book.title}</td><td>{book.author}</td><td><span className="badge badge-warn">{book.availableCopies ?? book.quantity ?? 0} left</span></td></tr>)}</tbody></table></div> : <EmptyState title="Stock levels look good" text="Books with fewer than 2 copies will appear here." />}
      </section>
      <section className="panel"><div className="panel-heading"><div><h3>Recent activity</h3><p className="muted">Latest stock changes</p></div><NavLink to="/transactions" className="text-link">View all →</NavLink></div>
        {transactions.length ? <ul className="activity-list">{transactions.slice(0, 5).map(item => <li key={item.id}><span className={`activity-icon ${item.action === 'add' ? 'positive' : 'negative'}`}>{item.action === 'add' ? '+' : '−'}</span><div><strong>{item.action === 'add' ? 'Stock added' : 'Stock deducted'}</strong><p>{item.title} · {item.quantity} {item.quantity === 1 ? 'copy' : 'copies'}</p></div><time>{new Date(item.date).toLocaleDateString()}</time></li>)}</ul> : <EmptyState title="No activity yet" text="Stock transactions will show here." />}
      </section>
    </div>
  </>
}

function StatCard({ label, value, icon, alert }) {
  return <div className={`stat-card ${alert ? 'stat-alert' : ''}`}><span className="stat-icon">{icon}</span><div><p>{label}</p><strong>{value}</strong></div></div>
}

function Books({ books, setBooks, addTransaction, admin }) {
  const [form, setForm] = useState({ title: '', author: '', quantity: '1' })
  const [editing, setEditing] = useState(null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const filtered = useMemo(() => books.filter(book => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())), [books, query])

  function submit(event) {
    event.preventDefault()
    const title = form.title.trim(); const author = form.author.trim(); const quantity = Math.max(0, Number(form.quantity) || 0)
    if (editing) {
      setBooks(current => current.map(book => book.id === editing ? { ...book, title, author } : book))
      setEditing(null); setMessage('Book details updated.')
    } else {
      setBooks(current => [...current, { id: crypto.randomUUID(), title, author, quantity, availableCopies: quantity }])
      setMessage('Book added to the collection.')
    }
    setForm({ title: '', author: '', quantity: '1' })
  }

  function edit(book) {
    setEditing(book.id); setForm({ title: book.title, author: book.author, quantity: String(book.quantity ?? book.availableCopies ?? 0) }); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function remove(book) {
    if (Number(book.quantity ?? 0) !== Number(book.availableCopies ?? book.quantity ?? 0)) { setMessage('Return all borrowed copies before deleting this book.'); return }
    if (window.confirm(`Delete “${book.title}” from the library?`)) setBooks(current => current.filter(item => item.id !== book.id))
  }

  return <>
    <PageHeading eyebrow="COLLECTION" title="Book management" description="Add titles, keep stock accurate, and maintain your catalogue." />
    {admin && <section className="panel form-panel"><div className="panel-heading"><div><h3>{editing ? 'Update book' : 'Add a book'}</h3><p className="muted">Enter the book details and starting stock.</p></div></div>
      <form className="data-form" onSubmit={submit}><label>Book title<input required value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="e.g. Things Fall Apart" /></label><label>Author<input required value={form.author} onChange={event => setForm({ ...form, author: event.target.value })} placeholder="Author name" /></label>{!editing && <label>Copies in stock<input required type="number" min="0" value={form.quantity} onChange={event => setForm({ ...form, quantity: event.target.value })} /></label>}<div className="form-actions"><button className="button" type="submit">{editing ? 'Save changes' : 'Add book'}</button>{editing && <button className="button button-light" type="button" onClick={() => { setEditing(null); setForm({ title: '', author: '', quantity: '1' }) }}>Cancel</button>}</div></form>{message && <p className="form-message" role="status">{message}</p>}
    </section>}
    <section className="panel"><div className="panel-heading"><div><h3>Library catalogue <span className="count-pill">{books.length}</span></h3><p className="muted">Search and manage titles in your collection.</p></div><input className="search-input" aria-label="Search books" placeholder="Search books…" value={query} onChange={event => setQuery(event.target.value)} /></div>
      {filtered.length ? <div className="table-wrap"><table><thead><tr><th>Book title</th><th>Author</th><th>Total copies</th><th>Available</th><th>Status</th>{admin && <th>Actions</th>}</tr></thead><tbody>{filtered.map(book => { const totalCopies = Number(book.quantity ?? book.availableCopies ?? 0); const availableCopies = Number(book.availableCopies ?? totalCopies); return <tr key={book.id}><td className="strong">{book.title}</td><td>{book.author}</td><td>{totalCopies}</td><td>{availableCopies}</td><td><span className={`badge ${availableCopies < 2 ? 'badge-warn' : 'badge-ok'}`}>{availableCopies < 2 ? 'Low stock' : 'In stock'}</span></td>{admin && <td><div className="row-actions"><button className="link-button" onClick={() => edit(book)}>Update</button><button className="link-button danger-text" onClick={() => remove(book)}>Delete</button>{availableCopies > 0 && <button className="link-button" onClick={() => { addTransaction(book, 1, 'deduct', 'Borrowed'); setMessage('One copy marked as borrowed.') }}>Borrow</button>}{availableCopies < totalCopies && <button className="link-button" onClick={() => { addTransaction(book, 1, 'add', 'Returned'); setMessage('One copy marked as returned.') }}>Return</button>}</div></td>}</tr> })}</tbody></table></div> : <EmptyState title={query ? 'No books found' : 'Your catalogue is empty'} text={query ? 'Try another search term.' : 'Add your first book using the form above.'} />}
    </section>
  </>
}

function Transactions({ books, transactions, addTransaction }) {
  const [form, setForm] = useState({ bookId: '', action: 'add', quantity: '1', note: '' })
  const [message, setMessage] = useState('')
  function submit(event) {
    event.preventDefault()
    const book = books.find(item => item.id === form.bookId)
    if (!book) { setMessage('Choose a book first.'); return }
    if (!addTransaction(book, form.quantity, form.action, form.note)) { setMessage(form.action === 'deduct' ? 'There are not enough available copies.' : 'Enter a valid quantity.'); return }
    setMessage('Transaction recorded and stock updated.'); setForm({ ...form, quantity: '1', note: '' })
  }
  return <>
    <PageHeading eyebrow="INVENTORY" title="Stock transactions" description="Receive new copies, record borrowing and returns, and review the history." />
    <section className="panel form-panel"><div className="panel-heading"><div><h3>Record a stock change</h3><p className="muted">Every change is added to the transaction history.</p></div></div>
      <form className="data-form" onSubmit={submit}><label>Book<select required value={form.bookId} onChange={event => setForm({ ...form, bookId: event.target.value })}><option value="">Select a book</option>{books.map(book => <option value={book.id} key={book.id}>{book.title} ({book.availableCopies ?? book.quantity ?? 0} available)</option>)}</select></label><label>Transaction<select value={form.action} onChange={event => setForm({ ...form, action: event.target.value })}><option value="add">Add stock / return</option><option value="deduct">Deduct stock / borrow</option></select></label><label>Quantity<input required min="1" type="number" value={form.quantity} onChange={event => setForm({ ...form, quantity: event.target.value })} /></label><label>Note (optional)<input value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} placeholder="Supplier, member, or reason" /></label><div className="form-actions"><button className="button" type="submit">Record transaction</button></div></form>{message && <p className="form-message" role="status">{message}</p>}
    </section>
    <section className="panel"><div className="panel-heading"><div><h3>Transaction history</h3><p className="muted">A record of stock movements.</p></div><span className="count-pill">{transactions.length} entries</span></div>
      {transactions.length ? <div className="table-wrap"><table><thead><tr><th>Date</th><th>Book</th><th>Action</th><th>Quantity</th><th>Note</th><th>Recorded by</th></tr></thead><tbody>{transactions.map(item => <tr key={item.id}><td>{new Date(item.date).toLocaleString()}</td><td className="strong">{item.title}</td><td><span className={`badge ${item.action === 'add' ? 'badge-ok' : 'badge-neutral'}`}>{item.action === 'add' ? 'Stock added' : 'Stock deducted'}</span></td><td>{item.quantity}</td><td>{item.note || '—'}</td><td>{item.user || 'Administrator'}</td></tr>)}</tbody></table></div> : <EmptyState title="No transactions yet" text="Your stock changes will be recorded here." />}
    </section>
  </>
}

function Users({ members, setMembers }) {
  const [form, setForm] = useState({ name: '', membershipId: '', email: '', role: 'Member' })
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')
  function submit(event) {
    event.preventDefault()
    const details = { ...form, name: form.name.trim(), membershipId: form.membershipId.trim(), email: form.email.trim() }
    if (members.some(member => member.membershipId === details.membershipId && member.id !== editing)) { setMessage('That membership ID is already in use.'); return }
    if (editing) setMembers(current => current.map(member => member.id === editing ? { ...member, ...details } : member))
    else setMembers(current => [...current, { id: crypto.randomUUID(), ...details }])
    setEditing(null); setForm({ name: '', membershipId: '', email: '', role: 'Member' }); setMessage(editing ? 'User details updated.' : 'User added.')
  }
  function edit(member) { setEditing(member.id); setForm({ name: member.name, membershipId: member.membershipId ?? '', email: member.email, role: member.role }) }
  function remove(member) { if (window.confirm(`Delete ${member.name}'s account?`)) setMembers(current => current.filter(item => item.id !== member.id)) }
  return <>
    <PageHeading eyebrow="ADMINISTRATION" title="User management" description="Create accounts and maintain membership details and roles." />
    <section className="panel form-panel"><div className="panel-heading"><div><h3>{editing ? 'Update user' : 'Add a user'}</h3><p className="muted">Membership IDs are used to sign in to this demo.</p></div></div>
      <form className="data-form" onSubmit={submit}><label>Full name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label><label>Membership ID<input required value={form.membershipId} onChange={event => setForm({ ...form, membershipId: event.target.value })} placeholder="e.g. LIB-001" /></label><label>Email<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label><label>Role<select value={form.role} onChange={event => setForm({ ...form, role: event.target.value })}><option>Member</option><option>Librarian</option><option>Admin</option></select></label><div className="form-actions"><button className="button" type="submit">{editing ? 'Save changes' : 'Add user'}</button>{editing && <button className="button button-light" type="button" onClick={() => { setEditing(null); setForm({ name: '', membershipId: '', email: '', role: 'Member' }) }}>Cancel</button>}</div></form>{message && <p className="form-message" role="status">{message}</p>}
    </section>
    <section className="panel"><div className="panel-heading"><div><h3>Library users</h3><p className="muted">Members, librarians, and administrators.</p></div><span className="count-pill">{members.length} users</span></div>
      {members.length ? <div className="table-wrap"><table><thead><tr><th>Name</th><th>Membership ID</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead><tbody>{members.map(member => <tr key={member.id}><td className="strong">{member.name}</td><td>{member.membershipId || '—'}</td><td>{member.email}</td><td><span className="badge badge-neutral">{member.role}</span></td><td><div className="row-actions"><button className="link-button" onClick={() => edit(member)}>Update</button><button className="link-button danger-text" onClick={() => remove(member)}>Delete</button></div></td></tr>)}</tbody></table></div> : <EmptyState title="No users yet" text="Add a member or staff account using the form above." />}
    </section>
  </>
}

function Login({ members, setMembers, setSession, session }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', membershipId: '', email: '' })
  const [message, setMessage] = useState('')
  const [setupMode, setSetupMode] = useState(false)
  const hasAdmin = members.some(member => member.role === 'Admin' || member.role === 'Librarian')
  function submit(event) {
    event.preventDefault()
    if (setupMode && !hasAdmin) {
      const member = { id: crypto.randomUUID(), name: form.name.trim(), membershipId: form.membershipId.trim(), email: form.email.trim(), role: 'Admin' }
      setMembers(current => [...current, member])
      setSession(member)
      navigate('/dashboard')
      return
    }
    const member = members.find(item => (item.membershipId ?? '').toLowerCase() === form.membershipId.trim().toLowerCase() && item.email.toLowerCase() === form.email.trim().toLowerCase())
    if (!member) { setMessage('We couldn’t find a matching account. Check your details or ask a librarian to add you.'); return }
    setSession({ id: member.id, name: member.name, role: member.role }); navigate('/dashboard')
  }
  if (session) return <Navigate to="/dashboard" replace />
  return <div className="login-wrap"><section className="panel login-card"><span className="login-mark">B</span><p className="eyebrow">{setupMode ? 'GETTING STARTED' : 'WELCOME BACK'}</p><h2>{setupMode ? 'Set up your library' : 'Sign in to your library'}</h2><p className="muted">{setupMode ? 'Create the first administrator account to manage this library.' : 'Use your membership ID and registered email address.'}</p><form className="login-form" onSubmit={submit}>{setupMode && <label>Full name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>}<label>Membership ID<input required value={form.membershipId} onChange={event => setForm({ ...form, membershipId: event.target.value })} placeholder="e.g. LIB-001" /></label><label>Email address<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><button className="button" type="submit">{setupMode ? 'Create administrator' : 'Sign in'}</button></form>{message && <p className="error-message" role="alert">{message}</p>}{!hasAdmin && <button className="link-button setup-link" onClick={() => { setSetupMode(!setupMode); setMessage('') }}>{setupMode ? 'Back to sign in' : 'First time here? Set up the administrator account'}</button>}<p className="login-note">Sign-in for this demo uses saved account details in this browser.</p></section></div>
}

function EmptyState({ title, text }) {
  return <div className="empty-state"><span>▤</span><strong>{title}</strong><p>{text}</p></div>
}

export default Layout
