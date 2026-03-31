import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, MapPin, Calendar, Wallet, Compass,
  TrendingUp, CheckCircle2, Plane, IndianRupee,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import CreateTripModal from '../components/CreateTripModal';

const gradients = [
  'trip-gradient-1', 'trip-gradient-2', 'trip-gradient-3',
  'trip-gradient-4', 'trip-gradient-5',
];

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('tg_user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tripsRes, statsRes] = await Promise.all([
        api.get('/trips'),
        api.get('/trips/stats'),
      ]);
      setTrips(tripsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTripCreated = () => {
    setShowCreate(false);
    fetchData();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getBudgetPercent = (spent, budget) => {
    if (!budget) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  const getBudgetClass = (percent) => {
    if (percent > 90) return 'danger';
    if (percent > 70) return 'warning';
    return 'safe';
  };

  const getStatusBadge = (status) => {
    const map = {
      planning: 'badge-planning',
      active: 'badge-active',
      completed: 'badge-completed',
    };
    return map[status] || 'badge-planning';
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div>
          <div className="loader"></div>
          <p className="loader-text">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user.name?.split(' ')[0] || 'Traveler'} 👋
          </h1>
          <p className="page-subtitle">Here's an overview of your travel plans</p>
        </div>
        <button
          id="create-trip-btn"
          className="btn btn-primary"
          onClick={() => setShowCreate(true)}
        >
          <Plus size={18} />
          New Trip
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card blue animate-in delay-1">
            <div className="stat-icon">
              <Compass size={22} />
            </div>
            <div className="stat-value">{stats.totalTrips}</div>
            <div className="stat-label">Total Trips</div>
          </div>
          <div className="stat-card orange animate-in delay-2">
            <div className="stat-icon">
              <Plane size={22} />
            </div>
            <div className="stat-value">{stats.activeTrips}</div>
            <div className="stat-label">Active Trips</div>
          </div>
          <div className="stat-card green animate-in delay-3">
            <div className="stat-icon">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-value">{stats.completedTrips}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card red animate-in delay-4">
            <div className="stat-icon">
              <IndianRupee size={22} />
            </div>
            <div className="stat-value">{formatCurrency(stats.totalSpent)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
      )}

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Compass size={36} />
          </div>
          <h3>No trips yet</h3>
          <p>Create your first trip and start planning your adventure!</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} />
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip, index) => {
            const percent = getBudgetPercent(trip.totalSpent, trip.budget);
            return (
              <div
                key={trip.id}
                className="trip-card animate-in"
                style={{ animationDelay: `${index * 80}ms` }}
                onClick={() => navigate(`/trip/${trip.id}`)}
              >
                <div className={`trip-card-banner ${gradients[index % gradients.length]}`}>
                  <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                    <span className={`badge ${getStatusBadge(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>
                </div>
                <div className="trip-card-body">
                  <h3 className="trip-card-title">{trip.title}</h3>
                  {trip.destination && (
                    <div className="trip-card-destination">
                      <MapPin size={14} />
                      {trip.destination}
                    </div>
                  )}
                  <div className="trip-card-meta">
                    {trip.startDate && (
                      <div className="trip-meta-item">
                        <Calendar size={14} />
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </div>
                    )}
                    <div className="trip-meta-item">
                      <Wallet size={14} />
                      {formatCurrency(trip.totalSpent)} spent
                    </div>
                  </div>
                  {trip.budget && (
                    <div className="trip-card-budget-bar">
                      <div className="budget-bar-header">
                        <span>{Math.round(percent)}% used</span>
                        <span>Budget: {formatCurrency(trip.budget)}</span>
                      </div>
                      <div className="budget-bar-track">
                        <div
                          className={`budget-bar-fill ${getBudgetClass(percent)}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Trip Modal */}
      {showCreate && (
        <CreateTripModal
          onClose={() => setShowCreate(false)}
          onCreated={handleTripCreated}
        />
      )}
    </div>
  );
}

export default Dashboard;
