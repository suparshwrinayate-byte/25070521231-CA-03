import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AuthPage({ initialMode = 'login', onBackHome }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {onBackHome && (
          <button type="button" className="auth-back-link" onClick={onBackHome}>
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </button>
        )}

        <div className="auth-brand">
          <div className="brand-mark">
            <Activity size={26} />
          </div>
          <h2>MediTrack</h2>
          <span className="auth-subtitle">Medicine Inventory & Expiry Tracker</span>
        </div>

        <div className="auth-header">
          <h3>{isRegister ? 'Create an Account' : 'Welcome Back'}</h3>
          <p>{isRegister ? 'Enter your details to register as an inventory manager.' : 'Sign in to access your pharmacy stock dashboard.'}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {isRegister && <small className="field-hint">Minimum 6 characters</small>}
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? (
              'Processing...'
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className="auth-switch">
          <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
          <button type="button" onClick={switchMode} className="switch-btn">
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
