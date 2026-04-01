import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin, Calendar, IndianRupee, Clock, Navigation,
  Utensils, Car, Home, Package, ListChecks, Receipt,
  Wallet, Shield, User, Globe,
} from 'lucide-react';

const categoryIcons = {
  food: Utensils,
  transport: Car,
  accommodation: Home,
  other: Package,
};

const currencySymbols = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥',
  AUD: 'A$', CAD: 'C$', SGD: 'S$', THB: '฿', AED: 'د.إ',
};

function SharedTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');

  useEffect(() => {
    fetchSharedTrip();
  }, [token]);

  const fetchSharedTrip = async () => {
    try {
      const res = await fetch(`/api/shared/${token}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Trip not found');
      }
      const data = await res.json();
      setTrip(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'INR') => {
    const sym = currencySymbols[currency] || currency;
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

  const groupedItinerary = trip?.itineraries?.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {}) || {};

  const categoryBreakdown = trip?.expenses?.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {}) || {};

  if (loading) {
    return (
      <div className="shared-page">
        <div className="loader-container">
          <div>
            <div className="loader"></div>
            <p className="loader-text">Loading shared trip...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-page">
        <div className="shared-error">
          <div className="shared-error-icon">
            <Globe size={48} />
          </div>
          <h2>Trip Not Found</h2>
          <p>{error}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            This link may have expired or been revoked by the owner.
          </p>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="shared-page">
      {/* Branding Bar */}
      <div className="shared-brand">
        <div className="shared-brand-logo">
          <Shield size={20} />
          <span>TravelGuard</span>
        </div>
        <span className="shared-brand-badge">Shared Trip</span>
      </div>

      {/* Header */}
      <div className="shared-header">
        <h1>{trip.title}</h1>
        {trip.destination && (
          <div className="shared-destination">
            <MapPin size={16} />
            {trip.destination}
          </div>
        )}
        {trip.description && <p className="shared-description">{trip.description}</p>}
        <div className="shared-meta">
          <span className="shared-meta-item">
            <User size={14} />
            By {trip.ownerName}
          </span>
          {trip.startDate && (
            <span className="shared-meta-item">
              <Calendar size={14} />
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
          )}
          <span className={`badge ${trip.status === 'completed' ? 'badge-completed' : trip.status === 'active' ? 'badge-active' : 'badge-planning'}`}>
            {trip.status}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="shared-stats">
        <div className="shared-stat">
          <IndianRupee size={18} />
          <div>
            <div className="shared-stat-value">{formatCurrency(trip.totalSpent)}</div>
            <div className="shared-stat-label">Total Spent</div>
          </div>
        </div>
        {trip.budget && (
          <div className="shared-stat">
            <Wallet size={18} />
            <div>
              <div className="shared-stat-value">{formatCurrency(trip.budget)}</div>
              <div className="shared-stat-label">Budget</div>
            </div>
          </div>
        )}
        <div className="shared-stat">
          <ListChecks size={18} />
          <div>
            <div className="shared-stat-value">{trip.itineraries?.length || 0}</div>
            <div className="shared-stat-label">Activities</div>
          </div>
        </div>
        <div className="shared-stat">
          <Receipt size={18} />
          <div>
            <div className="shared-stat-value">{trip.expenses?.length || 0}</div>
            <div className="shared-stat-label">Expenses</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="trip-tabs">
        <button
          className={`trip-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          <ListChecks size={16} /> Itinerary
        </button>
        <button
          className={`trip-tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <Receipt size={16} /> Expenses
        </button>
      </div>

      {/* Content */}
      {activeTab === 'itinerary' && (
        <div>
          {Object.keys(groupedItinerary).length === 0 ? (
            <div className="empty-state">
              <h3>No itinerary added</h3>
            </div>
          ) : (
            <div className="itinerary-timeline">
              {Object.entries(groupedItinerary)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([day, items]) => (
                  <div key={day} className="itinerary-day-group">
                    <h3><span className="day-badge">Day {day}</span></h3>
                    <div className="itinerary-items">
                      {items.map((item) => (
                        <div key={item.id} className="itinerary-item">
                          <div className="itinerary-item-content">
                            <div className="itinerary-item-activity">{item.activity}</div>
                            {item.location && (
                              <div className="itinerary-item-location">
                                <Navigation size={12} /> {item.location}
                              </div>
                            )}
                          </div>
                          {item.time && (
                            <div className="itinerary-item-time">
                              <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                              {item.time}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'expenses' && (
        <div>
          {trip.expenses?.length === 0 ? (
            <div className="empty-state">
              <h3>No expenses tracked</h3>
            </div>
          ) : (
            <>
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
                        </div>
                      </div>
                      <div className="expense-amount">{formatCurrency(exp.amount, exp.currency)}</div>
                    </div>
                  );
                })}
              </div>

              {/* Category Breakdown */}
              {Object.keys(categoryBreakdown).length > 0 && (
                <div className="card" style={{ marginTop: '24px' }}>
                  <h3 className="card-title" style={{ marginBottom: '16px' }}>Spending Breakdown</h3>
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
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SharedTripPage;
