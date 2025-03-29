import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/users');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-100">
            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
            {error && <p className="text-red-500 text-center mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="email" className="font-medium">Email</label>
                <input 
                type="text" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="border border-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>
            <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="password" className="font-medium">Password</label>
                <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>
            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                Submit
            </button>
            </form>
        </div>
        </div>
    </>
  );
};

export default Login;
