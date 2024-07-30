import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root');

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`);
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response.data);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async task => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, task);
      setTasks([...tasks, res.data]);
      closeModal();
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const deleteTask = async id => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => (task._id === id ? res.data : task)));
      closeModal();
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const openModal = (task = null) => {
    setCurrentTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setCurrentTask(null);
    setModalIsOpen(false);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="tasks-container">
      <button onClick={() => openModal()} className="add-task-button">
        <FontAwesomeIcon icon={faPlus} /> Add Task
      </button>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <div className="task-details">
              <span className="task-title">{task.title}</span> - <span className="task-description">{task.description}</span>
            </div>
            <FontAwesomeIcon icon={faTrash} onClick={() => deleteTask(task._id)} className="delete-icon" />
            <FontAwesomeIcon icon={faEdit} onClick={() => openModal(task)} className="edit-icon" />
          </li>
        ))}
      </ul>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Task Form Modal" className="task-modal" overlayClassName="task-modal-overlay">
        <TaskForm addTask={addTask} task={currentTask} updateTask={updateTask} />
      </Modal>
    </div>
  );
};

export default Tasks;
