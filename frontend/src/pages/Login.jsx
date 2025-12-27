import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Heart color="white" fill="white" size={30} />
                </div>
                <h1>Welcome Back</h1>
                <p style={{ color: 'var(--text-light)' }}>Sign in to continue tracking</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
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
                        Sign In
                    </button>
                </form>
            </div>

            <p className="text-center" style={{ marginTop: '1rem', color: 'var(--text-light)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
            </p>
        </div>
    );
};

export default Login;
