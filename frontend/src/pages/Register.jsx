import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Heart color="white" fill="white" size={30} />
                </div>
                <h1>Join the Journey</h1>
                <p style={{ color: 'var(--text-light)' }}>Create an account to start tracking</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                    <div className="input-group">
                        <label className="input-label">Your Name</label>
                        <input
                            className="input-field"
                            type="text"
                            value={name}
                            placeholder="e.g., Sarah"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            className="input-field"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            className="input-field"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Get Started
                    </button>
                </form>
            </div>

            <p className="text-center" style={{ marginTop: '1rem', color: 'var(--text-light)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
            </p>
        </div>
    );
};

export default Register;
