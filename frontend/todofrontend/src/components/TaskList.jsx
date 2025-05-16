import React, { useEffect, useState } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import DeleteModal from './DeleteModal';

const API_BASE = 'http://localhost:5000/api/todos';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const url = new URL(`${API_BASE}/all`);
      url.searchParams.append('page', page);
      if (filter !== 'all') url.searchParams.append('status', filter);

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();

      setTasks(data.todos);
      setTotalPages(data.totalPages);
    } catch (error) {
      alert('Error loading tasks: ' + error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, page]);

  // Add or update task in backend
  const saveTask = async (task) => {
    try {
      const isEdit = !!task._id;
      const url = isEdit
        ? `${API_BASE}/update/${task._id}`
        : `${API_BASE}/create`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save task');
      }

      setShowForm(false);
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      alert('Error saving task: ' + error.message);
    }
  };

  // Delete task in backend
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');

      setShowDeleteModal(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      alert('Error deleting task: ' + error.message);
    }
  };

  // Pagination controls
  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <>
      {/* Filter & Add */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>{' '}
          <button
            className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>{' '}
          <button
            className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>
          + Add Task
        </button>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="alert alert-info">No tasks found.</div>
      ) : (
        <div className="list-group mb-3">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={() => {
                setEditTask(task);
                setShowForm(true);
              }}
              onDelete={() => {
                setTaskToDelete(task);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <nav aria-label="Task pagination">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={goPrev}>
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {page} of {totalPages}
            </span>
          </li>
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={goNext}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          onClose={() => {
            setShowForm(false);
            setEditTask(null);
          }}
          onSave={saveTask}
          task={editTask}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => {
            setShowDeleteModal(false);
            setTaskToDelete(null);
          }}
          onConfirm={() => deleteTask(taskToDelete._id)}
          message={`Are you sure you want to delete "${taskToDelete.title}"?`}
        />
      )}
    </>
  );
};

export default TaskList;
