import React from 'react';
import {
  Activity,
  CalendarClock,
  AlertTriangle,
  Search,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function LandingPage({ onGoLogin, onGoRegister }) {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="brand-mark">
              <Activity size={24} />
            </div>
            <div className="brand-copy">
              <strong>MediTrack</strong>
              <small>INVENTORY, SIMPLIFIED</small>
            </div>
          </div>

          <div className="landing-nav-actions">
            <button className="landing-btn-secondary" onClick={onGoLogin}>
              <LogIn size={16} />
              <span>Login</span>
            </button>
            <button className="landing-btn-primary" onClick={onGoRegister}>
              <UserPlus size={16} />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">
            <Sparkles size={14} />
            <span>Smart Pharmacy & Medicine Stock Management</span>
          </div>

          <h1 className="landing-hero-title">
            Never let a medicine <span className="highlight-text">expire</span> again.
          </h1>

          <p className="landing-hero-subtitle">
            Track medicine inventory, monitor expiry dates in real time, and get instant low-stock
            alerts all in one unified, simple dashboard. Built for pharmacies, clinics, and health stores.
          </p>

          <div className="landing-hero-actions">
            <button className="landing-btn-hero-primary" onClick={onGoRegister}>
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </button>
            <button className="landing-btn-hero-secondary" onClick={onGoLogin}>
              <LogIn size={18} />
              <span>Sign In to Dashboard</span>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="landing-stats-row">
            <div className="landing-stat-item">
              <strong>100%</strong>
              <span>Expiry Visibility</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item">
              <strong>Real-Time</strong>
              <span>Stock Alerts</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item">
              <strong>JWT Secured</strong>
              <span>Protected Records</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="landing-features">
        <div className="landing-section-header">
          <div className="eyebrow">DESIGNED FOR PHARMACIES & STORES</div>
          <h2>Everything you need to manage your medicines</h2>
          <p>Streamlined inventory tools built to prevent waste, avoid shortages, and stay compliant.</p>
        </div>

        <div className="landing-features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-expiry">
              <CalendarClock size={24} />
            </div>
            <h3>Real-Time Expiry Tracker</h3>
            <p>
              Automatically identifies expired medicines and highlights products expiring within 30 days
              so you can cycle stock before it goes bad.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-stock">
              <AlertTriangle size={24} />
            </div>
            <h3>Low-Stock Warnings</h3>
            <p>
              Set customizable minimum stock thresholds. When quantities run low, MediTrack alerts you
              immediately so you never run out of essential supplies.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-search">
              <Search size={24} />
            </div>
            <h3>Instant Search & Category Filters</h3>
            <p>
              Quickly find medicines by name, brand, or batch number. Filter across categories like Tablets,
              Syrups, Capsules, and Injections with zero lag.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-crud">
              <PlusCircle size={24} />
            </div>
            <h3>Simple Inventory Management</h3>
            <p>
              Effortlessly add, edit, and remove products. Track batch numbers, suppliers, purchase dates,
              and export your records to CSV anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Trust / Callout Banner */}
      <section className="landing-callout">
        <div className="landing-callout-inner">
          <div className="callout-copy">
            <div className="inline-chip">
              <ShieldCheck size={14} /> Safe & Reliable
            </div>
            <h3>Ready to streamline your medicine stock?</h3>
            <p>Create an account today to take complete control of your store's inventory and expiration timeline.</p>
          </div>
          <div className="callout-actions">
            <button className="landing-btn-hero-primary" onClick={onGoRegister}>
              <span>Get Started Now</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-left">
            <div className="brand-mark small">
              <Activity size={18} />
            </div>
            <span>© {new Date().getFullYear()} MediTrack — CA-3 Full Stack Project</span>
          </div>
          <div className="footer-right">
            <span>Built for better inventory visibility</span>
            <TrendingUp size={15} />
          </div>
        </div>
      </footer>
    </div>
  );
}
