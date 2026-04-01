import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, IndianRupee, Edit2, Trash2,
  Plus, Clock, Navigation, Utensils, Car, Home, Package,
  ListChecks, Receipt, Wallet, TrendingDown, TrendingUp,
  Share2, Copy, Check, Link2, X, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const categoryIcons = {
  food: Utensils,
  transport: Car,
  accommodation: Home,
  other: Package,
};

const currencyOptions = [
  { value: 'INR', label: '₹ INR', symbol: '₹' },
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ EUR', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' },
  { value: 'JPY', label: '¥ JPY', symbol: '¥' },
  { value: 'AUD', label: 'A$ AUD', symbol: 'A$' },
  { value: 'CAD', label: 'C$ CAD', symbol: 'C$' },
  { value: 'SGD', label: 'S$ SGD', symbol: 'S$' },
  { value: 'THB', label: '฿ THB', symbol: '฿' },
  { value: 'AED', label: 'د.إ AED', symbol: 'د.إ' },
];

const currencySymbolMap = Object.fromEntries(currencyOptions.map(c => [c.value, c.symbol]));

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');

  // Form states
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [itineraryForm, setItineraryForm] = useState({ day: '', activity: '', location: '', time: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: 'other', currency: 'INR', date: '' });
  const [formLoading, setFormLoading] = useState(false);

  // Edit trip
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Delete confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Share
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareToken, setShareToken] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Currency conversion
  const [exchangeRates, setExchangeRates] = useState(null);
  const [showConversion, setShowConversion] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
      setShareToken(res.data.shareToken || null);
      setEditForm({
        title: res.data.title || '',
        destination: res.data.destination || '',
        description: res.data.description || '',
        startDate: res.data.startDate ? res.data.startDate.slice(0, 10) : '',
        endDate: res.data.endDate ? res.data.endDate.slice(0, 10) : '',
        budget: res.data.budget || '',
        status: res.data.status || 'planning',
      });
    } catch (err) {
      toast.error('Failed to load trip');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'INR') => {
    const sym = currencySymbolMap[currency] || currency;
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
      }).format(amount || 0);
    }
    return `${sym}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount || 0)}`;
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Itinerary grouped by day
  const groupedItinerary = trip?.itineraries?.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {}) || {};

  // Category breakdown
  const categoryBreakdown = trip?.expenses?.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {}) || {};

  const budgetPercent = trip?.budget ? Math.min((trip.totalSpent / trip.budget) * 100, 100) : 0;
  const budgetRemaining = trip?.budget ? trip.budget - trip.totalSpent : null;

  // Check if trip has multi-currency expenses
  const currencies = [...new Set(trip?.expenses?.map(e => e.currency) || [])];
  const isMultiCurrency = currencies.length > 1;

  // ----- Handlers -----

  const handleAddItinerary = async (e) => {
    e.preventDefault();
    if (!itineraryForm.activity || !itineraryForm.day) {
      toast.error('Day and activity are required');
      return;
    }
    setFormLoading(true);
    try {
      await api.post(`/trips/${id}/itinerary`, itineraryForm);
      toast.success('Itinerary item added');
      setItineraryForm({ day: '', activity: '', location: '', time: '' });
      setShowItineraryForm(false);
      fetchTrip();
    } catch (err) {
      toast.error('Failed to add itinerary');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteItinerary = async (itemId) => {
    try {
      await api.delete(`/itinerary/${itemId}`);
      toast.success('Itinerary item removed');
      fetchTrip();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) {
      toast.error('Title and amount are required');
      return;
    }
    setFormLoading(true);
    try {
      await api.post(`/trips/${id}/expenses`, expenseForm);
      toast.success('Expense added');
      setExpenseForm({ title: '', amount: '', category: 'other', currency: 'INR', date: '' });
      setShowExpenseForm(false);
      fetchTrip();
    } catch (err) {
      toast.error('Failed to add expense');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteExpense = async (expId) => {
    try {
      await api.delete(`/expenses/${expId}`);
      toast.success('Expense removed');
      fetchTrip();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/trips/${id}`, editForm);
      toast.success('Trip updated');
      setShowEditTrip(false);
      fetchTrip();
    } catch (err) {
      toast.error('Failed to update trip');
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await api.delete(`/trips/${id}`);
      toast.success('Trip deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete trip');
    }
  };

  // Share handlers
  const handleGenerateShare = async () => {
    setShareLoading(true);
    try {
      const res = await api.post(`/trips/${id}/share`);
      setShareToken(res.data.shareToken);
      toast.success('Share link generated!');
    } catch (err) {
      toast.error('Failed to generate share link');
    } finally {
      setShareLoading(false);
    }
  };

  const handleRevokeShare = async () => {
    try {
      await api.delete(`/trips/${id}/share`);
      setShareToken(null);
      toast.success('Share link revoked');
    } catch (err) {
      toast.error('Failed to revoke share link');
    }
  };

  const getShareUrl = () => {
    return `${window.location.origin}/shared/${shareToken}`;
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Currency conversion
  const fetchRates = async () => {
    try {
      const res = await api.get('/currency/rates?base=INR');
      setExchangeRates(res.data);
      setShowConversion(true);
    } catch (err) {
      toast.error('Failed to fetch exchange rates');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div>
          <div className="loader"></div>
          <p className="loader-text">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div>
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="trip-detail-header">
        <div className="trip-detail-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1>{trip.title}</h1>
            <span className={`badge ${trip.status === 'completed' ? 'badge-completed' : trip.status === 'active' ? 'badge-active' : 'badge-planning'}`}>
              {trip.status}
            </span>
          </div>
          {trip.destination && (
            <div className="destination">
              <MapPin size={16} />
              {trip.destination}
            </div>
          )}
          {trip.description && (
            <p className="description">{trip.description}</p>
          )}
        </div>
        <div className="trip-detail-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setShowShareModal(true)}>
            <Share2 size={16} />
            Share
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowEditTrip(true)}>
            <Edit2 size={16} />
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="trip-detail-stats">
        <div className="stat-card blue">
          <div className="stat-icon"><Calendar size={20} /></div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </div>
          <div className="stat-label">Travel Dates</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon"><IndianRupee size={20} /></div>
          <div className="stat-value">{formatCurrency(trip.totalSpent)}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><Wallet size={20} /></div>
          <div className="stat-value">{trip.budget ? formatCurrency(trip.budget) : '—'}</div>
          <div className="stat-label">Budget</div>
        </div>
        <div className={`stat-card ${budgetRemaining !== null && budgetRemaining < 0 ? 'red' : 'green'}`}>
          <div className="stat-icon">
            {budgetRemaining !== null && budgetRemaining < 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
          </div>
          <div className="stat-value">{budgetRemaining !== null ? formatCurrency(budgetRemaining) : '—'}</div>
          <div className="stat-label">Remaining</div>
        </div>
      </div>

      {/* Multi-currency indicator */}
      {isMultiCurrency && (
        <div className="multi-currency-banner">
          <RefreshCw size={16} />
          <span>This trip has expenses in multiple currencies: {currencies.join(', ')}</span>
          {!showConversion && (
            <button className="btn btn-secondary btn-sm" onClick={fetchRates} style={{ marginLeft: 'auto' }}>
              View Exchange Rates
            </button>
          )}
        </div>
      )}

      {/* Live Exchange Rates */}
      {showConversion && exchangeRates && (
        <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 className="card-title" style={{ fontSize: '0.95rem' }}>
              💱 Live Exchange Rates (Base: {exchangeRates.base})
            </h3>
            <button className="btn-icon btn-ghost" onClick={() => setShowConversion(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="exchange-rates-grid">
            {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'THB', 'AED'].map(cur => (
              exchangeRates.rates[cur] !== undefined && (
                <div key={cur} className="exchange-rate-chip">
                  <span className="exchange-rate-code">{cur}</span>
                  <span className="exchange-rate-value">{exchangeRates.rates[cur].toFixed(4)}</span>
                </div>
              )
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {exchangeRates.fallback ? 'Using approximate rates (API offline)' : `Rates as of ${exchangeRates.date}`}
          </div>
        </div>
      )}

      {/* Budget Bar */}
      {trip.budget && (
        <div className="card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
          <div className="budget-bar-header" style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>Budget Utilization</span>
            <span>{Math.round(budgetPercent)}%</span>
          </div>
          <div className="budget-bar-track" style={{ height: '8px' }}>
            <div
              className={`budget-bar-fill ${budgetPercent > 90 ? 'danger' : budgetPercent > 70 ? 'warning' : 'safe'}`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="trip-tabs">
        <button
          className={`trip-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          <ListChecks size={16} />
          Itinerary
          <span className="trip-tab-count">{trip.itineraries?.length || 0}</span>
        </button>
        <button
          className={`trip-tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <Receipt size={16} />
          Expenses
          <span className="trip-tab-count">{trip.expenses?.length || 0}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="trip-detail-grid">
        <div>
          {activeTab === 'itinerary' && (
            <>
              <div className="card-header">
                <h2 className="card-title">Day-by-Day Itinerary</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setShowItineraryForm(true)}>
                  <Plus size={16} /> Add Item
                </button>
              </div>

              {/* Add Itinerary Form */}
              {showItineraryForm && (
                <div className="card" style={{ marginBottom: '20px' }}>
                  <form onSubmit={handleAddItinerary} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Day Number *</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="e.g., 1"
                          value={itineraryForm.day}
                          onChange={(e) => setItineraryForm({ ...itineraryForm, day: e.target.value })}
                          min="1"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Time</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g., 9:00 AM"
                          value={itineraryForm.time}
                          onChange={(e) => setItineraryForm({ ...itineraryForm, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Activity *</label>
                      <input
                        className="form-input"
                        placeholder="What are you doing?"
                        value={itineraryForm.activity}
                        onChange={(e) => setItineraryForm({ ...itineraryForm, activity: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        className="form-input"
                        placeholder="Where?"
                        value={itineraryForm.location}
                        onChange={(e) => setItineraryForm({ ...itineraryForm, location: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowItineraryForm(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={formLoading}>
                        {formLoading ? 'Adding...' : 'Add Item'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {Object.keys(groupedItinerary).length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><ListChecks size={32} /></div>
                  <h3>No itinerary yet</h3>
                  <p>Plan your trip day-by-day by adding activities</p>
                </div>
              ) : (
                <div className="itinerary-timeline">
                  {Object.entries(groupedItinerary)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([day, items]) => (
                      <div key={day} className="itinerary-day-group">
                        <h3>
                          <span className="day-badge">Day {day}</span>
                        </h3>
                        <div className="itinerary-items">
                          {items.map((item) => (
                            <div key={item.id} className="itinerary-item">
                              <div className="itinerary-item-content">
                                <div className="itinerary-item-activity">{item.activity}</div>
                                {item.location && (
                                  <div className="itinerary-item-location">
                                    <Navigation size={12} />
                                    {item.location}
                                  </div>
                                )}
                              </div>
                              {item.time && (
                                <div className="itinerary-item-time">
                                  <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                  {item.time}
                                </div>
                              )}
                              <div className="itinerary-item-actions">
                                <button
                                  className="btn-icon btn-ghost"
                                  onClick={() => handleDeleteItinerary(item.id)}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'expenses' && (
            <>
              <div className="card-header">
                <h2 className="card-title">Expense History</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setShowExpenseForm(true)}>
                  <Plus size={16} /> Add Expense
                </button>
              </div>

              {/* Add Expense Form */}
              {showExpenseForm && (
                <div className="card" style={{ marginBottom: '20px' }}>
                  <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                          className="form-input"
                          placeholder="What was it for?"
                          value={expenseForm.title}
                          onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Amount *</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="0"
                          value={expenseForm.amount}
                          onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          className="form-input"
                          value={expenseForm.category}
                          onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        >
                          <option value="food">Food & Dining</option>
                          <option value="transport">Transport</option>
                          <option value="accommodation">Accommodation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Currency</label>
                        <select
                          className="form-input"
                          value={expenseForm.currency}
                          onChange={(e) => setExpenseForm({ ...expenseForm, currency: e.target.value })}
                        >
                          {currencyOptions.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={expenseForm.date}
                          onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowExpenseForm(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={formLoading}>
                        {formLoading ? 'Adding...' : 'Add Expense'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {trip.expenses?.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><Receipt size={32} /></div>
                  <h3>No expenses yet</h3>
                  <p>Track your spending by adding expenses</p>
                </div>
              ) : (
                <div className="expense-list">
                  {trip.expenses.map((exp) => {
                    const CategoryIcon = categoryIcons[exp.category] || Package;
                    return (
                      <div key={exp.id} className="expense-item">
                        <div className={`expense-category-icon ${exp.category}`}>
                          <CategoryIcon size={18} />
                        </div>
                        <div className="expense-info">
                          <div className="expense-title">{exp.title}</div>
                          <div className="expense-date">
                            {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <span className={`category-badge ${exp.category}`} style={{ marginLeft: '8px' }}>{exp.category}</span>
                            {exp.currency && exp.currency !== 'INR' && (
                              <span className="currency-tag" style={{ marginLeft: '6px' }}>{exp.currency}</span>
                            )}
                          </div>
                        </div>
                        <div className="expense-amount">{formatCurrency(exp.amount, exp.currency)}</div>
                        <div className="expense-item-actions">
                          <button
                            className="btn-icon btn-ghost"
                            onClick={() => handleDeleteExpense(exp.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar - Category Breakdown */}
        <div>
          {trip.expenses?.length > 0 && (
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '20px' }}>Spending Breakdown</h3>
              <div className="budget-breakdown">
                {Object.entries(categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amount]) => (
                    <div key={cat} className="budget-category-item">
                      <div className={`budget-category-dot ${cat}`} />
                      <span className="budget-category-name">{cat}</span>
                      <span className="budget-category-amount">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '8px' }}>
                  <div className="budget-category-item" style={{ fontWeight: 700 }}>
                    <div style={{ width: '10px' }} />
                    <span className="budget-category-name" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Total</span>
                    <span className="budget-category-amount">{formatCurrency(trip.totalSpent)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Trip Modal */}
      {showEditTrip && (
        <div className="modal-overlay" onClick={() => setShowEditTrip(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Trip</h2>
              <button className="btn-icon btn-ghost" onClick={() => setShowEditTrip(false)}>
                <span style={{ fontSize: '20px' }}>×</span>
              </button>
            </div>
            <form onSubmit={handleUpdateTrip}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <input className="form-input" value={editForm.destination} onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-input" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="date" className="form-input" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Budget (₹)</label>
                    <input type="number" className="form-input" value={editForm.budget} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditTrip(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h2>Delete Trip</h2>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Are you sure you want to delete "<strong>{trip.title}</strong>"? This will permanently remove the trip along with all its itinerary items and expenses. This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteTrip}>Delete Trip</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2>
                <Share2 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
                Share Trip
              </h2>
              <button className="btn-icon btn-ghost" onClick={() => setShowShareModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {shareToken ? (
                <div className="share-active">
                  <div className="share-link-box">
                    <Link2 size={16} />
                    <input
                      className="form-input share-link-input"
                      value={getShareUrl()}
                      readOnly
                      onClick={(e) => e.target.select()}
                    />
                    <button className="btn btn-primary btn-sm" onClick={copyShareLink}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="share-note">
                    Anyone with this link can view this trip's itinerary and expenses (read-only).
                  </p>
                  <button className="btn btn-danger btn-sm" onClick={handleRevokeShare} style={{ marginTop: '12px' }}>
                    Revoke Link
                  </button>
                </div>
              ) : (
                <div className="share-inactive">
                  <div className="share-inactive-icon">
                    <Share2 size={32} />
                  </div>
                  <h3>Share this trip with others</h3>
                  <p>Generate a public link that lets anyone view this trip's itinerary and expenses.</p>
                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateShare}
                    disabled={shareLoading}
                  >
                    {shareLoading ? 'Generating...' : 'Generate Share Link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetails;
