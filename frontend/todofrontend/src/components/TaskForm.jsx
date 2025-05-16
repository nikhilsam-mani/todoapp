import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'pending');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required.');
      return;
    }
    onSave({
      _id: task?._id,
      title,
      description,
      status,
    });
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{task ? 'Edit Task' : 'Add New Task'}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
</div>
<div className="modal-body">
<div className="mb-3">
<label htmlFor="taskTitle" className="form-label">
Title
</label>
<input
id="taskTitle"
type="text"
className="form-control"
value={title}
onChange={(e) => setTitle(e.target.value)}
autoFocus
required
/>
</div>
<div className="mb-3">
<label htmlFor="taskDescription" className="form-label">
Description
</label>
<textarea
id="taskDescription"
className="form-control"
value={description}
onChange={(e) => setDescription(e.target.value)}
required
/>
</div>
<div className="mb-3">
<label htmlFor="taskStatus" className="form-label">
Status
</label>
<select
id="taskStatus"
className="form-select"
value={status}
onChange={(e) => setStatus(e.target.value)}
>
<option value="pending">Pending</option>
<option value="completed">Completed</option>
</select>
</div>
</div>
<div className="modal-footer">
<button type="submit" className="btn btn-primary">
Save
</button>
<button type="button" className="btn btn-secondary" onClick={onClose}>
Cancel
</button>
</div>
</form>
</div>
</div>
</div>
);
};

export default TaskForm;
