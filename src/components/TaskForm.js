import React, { useState, useEffect } from 'react';

const TaskForm = ({ addTask, task = {}, updateTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (task && task.title && task.description) {
      setFormData({
        title: task.title,
        description: task.description,
      });
    }
  }, [task]);

  const { title, description } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (task && task._id) {
      updateTask(task._id, formData);
    } else {
      addTask(formData);
    }
    setFormData({
      title: '',
      description: '',
    });
  };

  return (
    <form onSubmit={onSubmit} className="task-form">
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={title}
        onChange={onChange}
        required
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={description}
        onChange={onChange}
        required
      ></textarea>
      <button type="submit">{task && task._id ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
