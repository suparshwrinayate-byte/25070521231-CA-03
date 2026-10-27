import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  Bell,
  Boxes,
  CalendarClock,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  User as UserIcon,
  X
} from 'lucide-react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const categories = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Other'];
const emptyForm = { name: '', brand: '', category: 'Tablet', batchNumber: '', quantity: '', minimumStock: '10', expiryDate: '', purchaseDate: '', supplier: '', notes: '' };
const fmtDate = value => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
function getStatus(m) { const today = new Date(); today.setHours(0,0,0,0); const exp = new Date(m.expiryDate); exp.setHours(0,0,0,0); const soon = new Date(today); soon.setDate(soon.getDate()+30); if (exp < today) return 'Expired'; if (exp <= soon) return 'Expiring soon'; if (m.quantity <= m.minimumStock) return 'Low stock'; return 'In stock'; }
function StatCard({ title, value, caption, icon: Icon, kind }) { return <article className={`stat-card ${kind}`}><div className="stat-top"><span>{title}</span><span className="stat-icon"><Icon size={19}/></span></div><div className="stat-value">{value ?? '—'}</div><div className="stat-caption">{caption}</div></article>; }

function Dashboard() {
  const { user, token, logout } = useAuth();

  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileNav, setMobileNav] = useState(false);

  // Helper for authenticated fetch
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      logout();
      throw new Error('Your session has expired. Please log in again.');
    }
    return res;
  }, [token, logout]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setApiError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category !== 'All') params.set('category', category);
      if (status !== 'All') params.set('status', ({ 'Expiring soon': 'expiring', 'Expired': 'expired', 'Low stock': 'low', 'In stock': 'healthy' })[status]);

      const [listRes, statsRes] = await Promise.all([
        authFetch(`${API}/medicines?${params}`),
        authFetch(`${API}/medicines/stats`)
      ]);

      const list = await listRes.json();
      const statData = await statsRes.json();

      if (!listRes.ok) throw new Error(list.message || 'Could not load medicines');
      if (!statsRes.ok) throw new Error(statData.message || 'Could not load dashboard stats');

      setMedicines(list.data || []);
      setStats(statData.data || {});
    } catch (err) {
      setApiError(err.message);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, status, token, authFetch]);

  useEffect(() => {
    if (token) {
      const t = setTimeout(fetchData, 250);
      return () => clearTimeout(t);
    }
  }, [fetchData, token]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3200);
    return () => clearTimeout(t);
  }, [notice]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = m => {
    setEditing(m._id);
    setForm({
      name: m.name || '',
      brand: m.brand || '',
      category: m.category || 'Tablet',
      batchNumber: m.batchNumber || '',
      quantity: String(m.quantity),
      minimumStock: String(m.minimumStock ?? 10),
      expiryDate: m.expiryDate?.slice(0, 10) || '',
      purchaseDate: m.purchaseDate?.slice(0, 10) || '',
      supplier: m.supplier || '',
      notes: m.notes || ''
    });
    setModal(true);
  };

  const updateForm = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submitForm = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        minimumStock: Number(form.minimumStock),
        purchaseDate: form.purchaseDate || undefined
      };
      const res = await authFetch(`${API}/medicines${editing ? `/${editing}` : ''}`, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to save medicine');
      setModal(false);
      setNotice(data.message);
      await fetchData();
    } catch (err) {
      setNotice(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteMedicine = async m => {
    if (!window.confirm(`Delete ${m.name} from inventory? This cannot be undone.`)) return;
    try {
      const res = await authFetch(`${API}/medicines/${m._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNotice(data.message);
      await fetchData();
    } catch (err) {
      setNotice(`Error: ${err.message}`);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Brand', 'Category', 'Batch number', 'Quantity', 'Minimum stock', 'Expiry date', 'Supplier', 'Status'];
    const rows = medicines.map(m => [
      m.name,
      m.brand,
      m.category,
      m.batchNumber,
      m.quantity,
      m.minimumStock,
      fmtDate(m.expiryDate),
      m.supplier,
      getStatus(m)
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meditrack-inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const expiring = useMemo(
    () => medicines.filter(m => ['Expired', 'Expiring soon'].includes(getStatus(m))).slice(0, 3),
    [medicines]
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'show' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Activity size={23} />
          </div>
          <div>
            <strong>MediTrack</strong>
            <small>INVENTORY, SIMPLIFIED</small>
          </div>
          <button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <button className="nav-item active" onClick={() => { setStatus('All'); setCategory('All'); setMobileNav(false); }}>
          <LayoutDashboard size={18} /> Overview <span className="nav-dot" />
        </button>
        <button className="nav-item" onClick={() => { document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' }); setMobileNav(false); }}>
          <Boxes size={18} /> Medicine inventory
        </button>
        <button className="nav-item" onClick={() => { setStatus('Expiring soon'); setMobileNav(false); }}>
          <CalendarClock size={18} /> Expiry tracker
        </button>
        <button className="nav-item" onClick={() => { setStatus('Low stock'); setMobileNav(false); }}>
          <AlertTriangle size={18} /> Low stock alerts
        </button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={19} />
            </div>
            <strong>Keep your stock healthy</strong>
            <p>Review expiry dates and low-stock alerts regularly.</p>
            <button onClick={() => setNotice('Tip: add accurate expiry dates and minimum stock levels to get useful alerts.')}>
              Quick tip <span>→</span>
            </button>
          </div>
          <div className="profile">
            <div className="avatar">{user?.name ? user.name.slice(0, 2).toUpperCase() : 'MT'}</div>
            <div className="profile-copy">
              <strong>{user?.name || 'Store Manager'}</strong>
              <span>{user?.email || 'Logged in'}</span>
            </div>
            <button className="logout-button" onClick={logout} title="Sign Out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {mobileNav && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <button className="mobile-menu icon-button" onClick={() => setMobileNav(true)} aria-label="Open menu">
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <span className="crumb-slash">/</span>
            <strong>Overview</strong>
          </div>
          <div className="top-actions">
            <span className="live-status"><span /> Live</span>
            <div className="user-menu-wrap">
              <div className="user-badge">
                <UserIcon size={14} />
                <span>{user?.name}</span>
              </div>
              <button className="logout-button" onClick={logout} aria-label="Log Out">
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><Sparkles size={14} /> YOUR INVENTORY, AT A GLANCE</div>
              <h1>Welcome back, {user?.name}</h1>
              <p>Here’s what’s happening with your medicine inventory today.</p>
            </div>
            <div className="welcome-date">
              <CalendarClock size={16} />
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </section>

          {apiError && (
            <div className="error-banner">
              <AlertTriangle size={18} />
              <div>
                <strong>Can't connect to MediTrack API</strong>
                <p>{apiError}</p>
              </div>
              <button onClick={fetchData}>Retry</button>
            </div>
          )}

          <section className="stats-grid">
            <StatCard title="Total Products" value={stats.totalProducts} caption="Active catalogue items" icon={Boxes} kind="total" />
            <StatCard title="Total Units" value={stats.totalUnits} caption="Units currently in store" icon={Activity} kind="units" />
            <StatCard title="Expiring Soon" value={stats.expiringSoon} caption="Within the next 30 days" icon={CalendarClock} kind="expiring" />
            <StatCard title="Low Stock" value={stats.lowStock} caption="At or below minimum limit" icon={AlertTriangle} kind="low" />
          </section>

          <section className="overview-cards-grid">
            {/* Attention Required / Expiry Watchlist Card */}
            <article className="overview-card watchlist-card">
              <div className="overview-card-header">
                <div>
                  <div className="eyebrow">ATTENTION REQUIRED</div>
                  <h3>Expiry Watchlist</h3>
                </div>
                <span className={`watchlist-count-badge ${expiring.length > 0 ? 'has-priority' : 'clean'}`}>
                  {expiring.length} {expiring.length === 1 ? 'priority' : 'priorities'}
                </span>
              </div>

              {expiring.length === 0 ? (
                <div className="watchlist-empty">
                  <div className="empty-dot">
                    <Check size={16} />
                  </div>
                  <div>
                    <strong>All good, nothing needs attention</strong>
                    <p>No medicines are currently expired or expiring within the next 30 days.</p>
                  </div>
                </div>
              ) : (
                <ul className="watchlist-items">
                  {expiring.map(m => {
                    const st = getStatus(m);
                    const isExp = st === 'Expired';
                    return (
                      <li key={m._id} className="watchlist-item">
                        <div className="watchlist-item-left">
                          <span className={`item-dot ${isExp ? 'dot-expired' : 'dot-expiring'}`} />
                          <div className="watchlist-item-info">
                            <strong className="item-name">{m.name}</strong>
                            <span className="item-meta">
                              {m.category} · Batch {m.batchNumber || '—'} · {m.quantity} units
                            </span>
                          </div>
                        </div>
                        <div className="watchlist-item-right">
                          <span className={`status-pill ${isExp ? 'status-pill-expired' : 'status-pill-expiring'}`}>
                            {isExp ? 'Expired' : 'Expiring soon'}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>

            {/* Quick Insight Card */}
            <article className="overview-card insight-panel-card">
              <div className="insight-panel-top">
                <div className="insight-panel-icon">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="eyebrow">QUICK INSIGHT</div>
                  <h3>Automated Stock & Expiry Health</h3>
                </div>
              </div>

              <p className="insight-panel-desc">
                Items reaching their minimum stock threshold or expiration date will trigger warnings automatically across your overview and medicines inventory.
              </p>

              <div className="insight-panel-pills">
                <span className="insight-pill">
                  <ShieldCheck size={14} />
                  <span>Safe storage</span>
                </span>
                <span className="insight-pill">
                  <Clock3 size={14} />
                  <span>Daily monitoring</span>
                </span>
              </div>
            </article>
          </section>

          <section className="inventory-section" id="inventory">
            <div className="section-heading">
              <div>
                <div className="eyebrow">INVENTORY MANAGEMENT</div>
                <h2>Medicine inventory <span className="count-pill">{medicines.length}</span></h2>
                <p>Manage products, stock levels and expiry dates in one place.</p>
              </div>
              <div className="heading-actions">
                <button className="secondary-button" onClick={exportCSV}>
                  <ArrowDownToLine size={16} /> Export CSV
                </button>
                <button className="primary-button" onClick={openAdd}>
                  <Plus size={17} /> Add medicine
                </button>
              </div>
            </div>

            <div className="filters">
              <label className="search-box">
                <Search size={17} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search medicine, brand or batch..."
                />
              </label>

              <label className="select-wrap">
                <span>Category</span>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option>All</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} />
              </label>

              <label className="select-wrap">
                <span>Status</span>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option>All</option>
                  <option>In stock</option>
                  <option>Low stock</option>
                  <option>Expiring soon</option>
                  <option>Expired</option>
                </select>
                <ChevronDown size={14} />
              </label>

              <button className="clear-filters" onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); }}>
                Reset
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>MEDICINE / BRAND</th>
                    <th>CATEGORY</th>
                    <th>BATCH NO.</th>
                    <th>QUANTITY</th>
                    <th>EXPIRY DATE</th>
                    <th>STATUS</th>
                    <th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <div className="spinner" />Loading inventory...
                      </td>
                    </tr>
                  ) : medicines.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <div className="empty-icon"><Boxes size={23} /></div>
                        <strong>{apiError ? 'Inventory unavailable' : 'No medicines found'}</strong>
                        <p>{apiError ? 'Please check your connection and retry.' : 'Try another search or add your first medicine.'}</p>
                        {!apiError && (
                          <button className="primary-button small" onClick={openAdd}>
                            <Plus size={15} /> Add medicine
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    medicines.map(m => {
                      const st = getStatus(m);
                      return (
                        <tr key={m._id}>
                          <td>
                            <div className="medicine-cell">
                              <div className={`medicine-avatar ${m.category.toLowerCase()}`}>
                                {m.category === 'Syrup' ? 'SY' : m.category === 'Capsule' ? 'CP' : m.category === 'Ointment' ? 'CR' : m.category === 'Drops' ? 'DR' : 'TB'}
                              </div>
                              <div>
                                <strong>{m.name}</strong>
                                <span>{m.brand || 'No brand specified'}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className="category-tag">{m.category}</span></td>
                          <td className="batch-cell">{m.batchNumber || '—'}</td>
                          <td>
                            <div className={`quantity ${m.quantity <= m.minimumStock ? 'quantity-low' : ''}`}>
                              {m.quantity}<span> units</span>
                            </div>
                            {m.quantity <= m.minimumStock && <small className="min-stock">Min. {m.minimumStock}</small>}
                          </td>
                          <td>
                            <div className="expiry-date">{fmtDate(m.expiryDate)}</div>
                            <small className="expiry-hint">
                              {st === 'Expired' ? 'Past expiry date' : st === 'Expiring soon' ? 'Within 30 days' : 'Expiry tracked'}
                            </small>
                          </td>
                          <td>
                            <span className={`status-badge ${st.toLowerCase().replaceAll(' ', '-')}`}>
                              <i />{st}
                            </span>
                          </td>
                          <td>
                            <div className="row-actions">
                              <button className="icon-button" title="Edit medicine" aria-label={`Edit ${m.name}`} onClick={() => openEdit(m)}>
                                <Pencil size={15} />
                              </button>
                              <button className="icon-button delete-action" title="Delete medicine" aria-label={`Delete ${m.name}`} onClick={() => deleteMedicine(m)}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>Showing <strong>{medicines.length}</strong> medicine {medicines.length === 1 ? 'product' : 'products'}</span>
              <span><span className="footer-dot" /> Authenticated session active</span>
            </div>
          </section>

          <footer className="footer">
            <span>© {new Date().getFullYear()} MediTrack — CA-3 Full Stack Project</span>
            <span>Built for better inventory visibility <TrendingUp size={14} /></span>
          </footer>
        </div>
      </main>

      {notice && (
        <div className={`toast ${notice.startsWith('Error:') ? 'toast-error' : ''}`}>
          <span className="toast-check">{notice.startsWith('Error:') ? <AlertTriangle size={16} /> : <Check size={16} />}</span>
          {notice}
          <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <section className="medicine-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <div>
                <div className="eyebrow">INVENTORY RECORD</div>
                <h2 id="modal-title">{editing ? 'Edit medicine' : 'Add a medicine'}</h2>
                <p>Enter accurate product and expiry information.</p>
              </div>
              <button className="icon-button" onClick={() => setModal(false)} aria-label="Close form"><X size={20} /></button>
            </div>
            <form onSubmit={submitForm}>
              <div className="form-grid">
                <label className="form-field full">
                  <span>Medicine name *</span>
                  <input name="name" value={form.name} onChange={updateForm} placeholder="e.g. Paracetamol 500mg" maxLength="100" required />
                </label>
                <label className="form-field">
                  <span>Brand</span>
                  <input name="brand" value={form.brand} onChange={updateForm} placeholder="Brand name" />
                </label>
                <label className="form-field">
                  <span>Category *</span>
                  <select name="category" value={form.category} onChange={updateForm} required>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="form-field">
                  <span>Batch number</span>
                  <input name="batchNumber" value={form.batchNumber} onChange={updateForm} placeholder="e.g. PCM-2401" />
                </label>
                <label className="form-field">
                  <span>Supplier</span>
                  <input name="supplier" value={form.supplier} onChange={updateForm} placeholder="Supplier / distributor" />
                </label>
                <label className="form-field">
                  <span>Quantity (units) *</span>
                  <input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={updateForm} placeholder="0" required />
                </label>
                <label className="form-field">
                  <span>Minimum stock *</span>
                  <input name="minimumStock" type="number" min="0" step="1" value={form.minimumStock} onChange={updateForm} required />
                </label>
                <label className="form-field">
                  <span>Expiry date *</span>
                  <input name="expiryDate" type="date" value={form.expiryDate} onChange={updateForm} required />
                </label>
                <label className="form-field">
                  <span>Purchase date</span>
                  <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={updateForm} />
                </label>
                <label className="form-field full">
                  <span>Notes</span>
                  <textarea name="notes" value={form.notes} onChange={updateForm} rows="2" placeholder="Optional notes..." maxLength="500" />
                </label>
              </div>
              <div className="form-note">
                <AlertTriangle size={15} /> Always verify expiry dates before use. This app is an inventory tracker, not medical advice.
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Save changes' : <><Plus size={16} /> Add medicine</>}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { user, token, loading } = useAuth();
  // 'landing' | 'login' | 'register'
  const [view, setView] = useState('landing');

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner" />
        <p>Loading MediTrack...</p>
      </div>
    );
  }

  // If user is authenticated, always go directly to Dashboard
  if (user && token) {
    return <Dashboard />;
  }

  // When not logged in:
  if (view === 'login') {
    return (
      <AuthPage
        initialMode="login"
        onBackHome={() => setView('landing')}
      />
    );
  }

  if (view === 'register') {
    return (
      <AuthPage
        initialMode="register"
        onBackHome={() => setView('landing')}
      />
    );
  }

  // Default for visitors is the Hero Landing Page
  return (
    <LandingPage
      onGoLogin={() => setView('login')}
      onGoRegister={() => setView('register')}
    />
  );
}

