import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api/todos';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTodos = async () => {
    const res = await fetch(`${API_BASE}/all${statusFilter ? `?status=${statusFilter}` : ''}`);
    const data = await res.json();
    setTodos(data.todos || []);
  };

  useEffect(() => {
    fetchTodos();
  }, [statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `${API_BASE}/update/${editingId}` : `${API_BASE}/create`;
    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', description: '', status: 'pending' });
    setEditingId(null);
    fetchTodos();
  };

  const handleEdit = (todo) => {
    setForm({ title: todo.title, description: todo.description, status: todo.status });
    setEditingId(todo._id);
  };

  const confirmDelete = (id) => setDeleteId(id);

  const handleDelete = async () => {
    await fetch(`${API_BASE}/delete/${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    fetchTodos();
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📝 Todo Manager</h2>

      <form className="card p-3 mb-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-4">
            <input className="form-control" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </form>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Tasks</h5>
        <select className="form-select w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="row g-3">
        {todos.map((todo) => (
          <div key={todo._id} className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{todo.title}</h5>
                <p className="card-text">{todo.description}</p>
                <span className={`badge ${todo.status === 'completed' ? 'bg-success' : 'bg-warning'} mb-2`}>
                  {todo.status}
                </span>
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(todo)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => confirmDelete(todo._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">Are you sure you want to delete this task?</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
