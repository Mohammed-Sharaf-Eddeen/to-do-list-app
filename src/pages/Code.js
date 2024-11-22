import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CodeEntry = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/validate-code`, { code: code.toLowerCase() });

      if (res.data.redirect === 1) {
        window.location.href = 'https://protasker.vercel.app/login';
      } else if (res.data.redirect === 2) {
        sessionStorage.setItem('isCodeValidated', 'true');
        navigate('/comments');
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="code-entry-container">
      <form onSubmit={handleCodeSubmit} className="code-entry-form">
        <input
          type="text"
          placeholder="Enter your code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="code-input"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ProTasker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CodeEntry;
