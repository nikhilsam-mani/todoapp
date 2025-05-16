import React from 'react';

const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <div className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row">
      <div className="ms-2 me-auto">
        <div className="fw-bold">{task.title}</div>
        <small className="text-muted">{task.description}</small>
        <div>
          <span
            className={`badge ${
              task.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'
            } mt-1`}
          >
            {task.status}
          </span>
        </div>
      </div>
      <div className="btn-group mt-2 mt-md-0">
        <button className="btn btn-sm btn-outline-primary" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
