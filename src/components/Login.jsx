import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Signup successful! Please check your email for verification (if enabled) or login.');
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <img src="/logo.png" alt="Logo" className="login-logo" />
                    <h1>Support Hub</h1>
                </div>

                <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                <form onSubmit={handleAuth}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@scans.ai"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-toggle">
                    {mode === 'login' ? (
                        <p>
                            Don't have an account?{' '}
                            <button onClick={() => setMode('signup')}>Sign Up</button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button onClick={() => setMode('login')}>Sign In</button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
