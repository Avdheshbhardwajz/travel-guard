import { useState, useEffect } from 'react';
import {
  AlertTriangle, Plus, Trash2, Phone, User, Heart,
  MapPin, Shield, Siren, X, Edit2, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const relationshipOptions = [
  { value: 'parent', label: 'Parent' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'relative', label: 'Relative' },
  { value: 'other', label: 'Other' },
];

const relationshipIcons = {
  parent: Heart,
  spouse: Heart,
  sibling: User,
  friend: User,
  relative: Heart,
  other: User,
};

function EmergencyPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', relationship: 'other' });
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // SOS state
  const [showSOS, setShowSOS] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/emergency-contacts');
      setContacts(res.data);
    } catch (err) {
      toast.error('Failed to load emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Name and phone are required');
      return;
    }
    setFormLoading(true);
    try {
      await api.post('/emergency-contacts', form);
      toast.success('Emergency contact added');
      setForm({ name: '', phone: '', relationship: 'other' });
      setShowForm(false);
      fetchContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add contact');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/emergency-contacts/${id}`);
      toast.success('Contact removed');
      fetchContacts();
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditForm({ name: contact.name, phone: contact.phone, relationship: contact.relationship });
  };

  const handleEdit = async (id) => {
    try {
      await api.put(`/emergency-contacts/${id}`, editForm);
      toast.success('Contact updated');
      setEditingId(null);
      fetchContacts();
    } catch (err) {
      toast.error('Failed to update contact');
    }
  };

  // SOS Functions
  const activateSOS = () => {
    setShowSOS(true);
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationLoading(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enable location services.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getGoogleMapsUrl = () => {
    if (!location) return '#';
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  };

  const getSMSBody = (contact) => {
    const locText = location
      ? `My location: https://www.google.com/maps?q=${location.lat},${location.lng}`
      : 'Location unavailable';
    return encodeURIComponent(`🆘 EMERGENCY! I need help! ${locText} - Sent via TravelGuard`);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div>
          <div className="loader"></div>
          <p className="loader-text">Loading emergency contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Emergency & Safety 🆘</h1>
          <p className="page-subtitle">Manage emergency contacts and access SOS features</p>
        </div>
        <button className="btn btn-danger btn-lg sos-trigger-btn" onClick={activateSOS}>
          <Siren size={20} />
          SOS Emergency
        </button>
      </div>

      {/* Quick SOS Card */}
      <div className="sos-quick-card animate-in delay-1">
        <div className="sos-quick-icon">
          <Shield size={28} />
        </div>
        <div className="sos-quick-info">
          <h3>Stay Safe While Traveling</h3>
          <p>
            Add your emergency contacts below. In an emergency, press the SOS button to quickly
            share your location and reach out to your contacts.
          </p>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="emergency-section">
        <div className="card-header">
          <h2 className="card-title">
            <Phone size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
            My Emergency Contacts
            <span className="trip-tab-count" style={{ marginLeft: '8px' }}>{contacts.length}/5</span>
          </h2>
          {contacts.length < 5 && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Add Contact
            </button>
          )}
        </div>

        {/* Add Contact Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    placeholder="e.g., Mom"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    className="form-input"
                    placeholder="e.g., +91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Relationship</label>
                <select
                  className="form-input"
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                >
                  {relationshipOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={formLoading}>
                  {formLoading ? 'Adding...' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contact List */}
        {contacts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Phone size={32} />
            </div>
            <h3>No emergency contacts yet</h3>
            <p>Add contacts who should be notified in case of emergency</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={18} /> Add Your First Contact
            </button>
          </div>
        ) : (
          <div className="emergency-contact-list">
            {contacts.map((c, idx) => {
              const RelIcon = relationshipIcons[c.relationship] || User;
              const isEditing = editingId === c.id;

              return (
                <div key={c.id} className="emergency-contact-card animate-in" style={{ animationDelay: `${idx * 60}ms` }}>
                  {isEditing ? (
                    <div className="emergency-contact-edit">
                      <input
                        className="form-input"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Name"
                      />
                      <input
                        className="form-input"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Phone"
                      />
                      <select
                        className="form-input"
                        value={editForm.relationship}
                        onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
                      >
                        {relationshipOptions.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(c.id)}>
                          <Check size={14} /> Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="emergency-contact-icon">
                        <RelIcon size={20} />
                      </div>
                      <div className="emergency-contact-info">
                        <div className="emergency-contact-name">{c.name}</div>
                        <div className="emergency-contact-phone">{c.phone}</div>
                        <span className="emergency-contact-rel">{c.relationship}</span>
                      </div>
                      <div className="emergency-contact-actions">
                        <a href={`tel:${c.phone}`} className="btn btn-primary btn-sm" title="Call">
                          <Phone size={14} /> Call
                        </a>
                        <button className="btn-icon btn-ghost" onClick={() => startEdit(c)} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn-icon btn-ghost" onClick={() => handleDelete(c.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div className="modal-overlay" onClick={() => setShowSOS(false)}>
          <div className="modal sos-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 style={{ color: 'var(--danger-400)' }}>
                <AlertTriangle size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
                SOS Emergency
              </h2>
              <button className="btn-icon btn-ghost" onClick={() => setShowSOS(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {/* Location Info */}
              <div className="sos-location-card">
                <div className="sos-location-header">
                  <MapPin size={18} />
                  <span>Your Current Location</span>
                </div>
                {locationLoading && (
                  <div className="sos-location-loading">
                    <div className="loader" style={{ width: '24px', height: '24px' }}></div>
                    <span>Detecting location...</span>
                  </div>
                )}
                {locationError && (
                  <div className="sos-location-error">{locationError}</div>
                )}
                {location && (
                  <div className="sos-location-coords">
                    <div>Latitude: <strong>{location.lat.toFixed(6)}</strong></div>
                    <div>Longitude: <strong>{location.lng.toFixed(6)}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Accuracy: ±{Math.round(location.accuracy)}m
                    </div>
                    <a
                      href={getGoogleMapsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '8px' }}
                    >
                      <MapPin size={14} /> Open in Google Maps
                    </a>
                  </div>
                )}
              </div>

              {/* Emergency Contacts in SOS */}
              <div className="sos-contacts-section">
                <h3>Contact Your Emergency Contacts</h3>
                {contacts.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    No emergency contacts added. Go back and add contacts first.
                  </p>
                ) : (
                  <div className="sos-contact-list">
                    {contacts.map((c) => (
                      <div key={c.id} className="sos-contact-item">
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{c.phone}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a href={`tel:${c.phone}`} className="btn btn-danger btn-sm">
                            <Phone size={14} /> Call
                          </a>
                          <a
                            href={`sms:${c.phone}?body=${getSMSBody(c)}`}
                            className="btn btn-secondary btn-sm"
                          >
                            SMS Location
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Universal Emergency Numbers */}
              <div className="sos-universal">
                <h3>Universal Emergency Numbers</h3>
                <div className="sos-universal-grid">
                  <a href="tel:112" className="sos-universal-btn">
                    <Siren size={16} />
                    <span>112</span>
                    <small>International</small>
                  </a>
                  <a href="tel:100" className="sos-universal-btn">
                    <Shield size={16} />
                    <span>100</span>
                    <small>Police (IN)</small>
                  </a>
                  <a href="tel:102" className="sos-universal-btn">
                    <Heart size={16} />
                    <span>102</span>
                    <small>Ambulance (IN)</small>
                  </a>
                  <a href="tel:101" className="sos-universal-btn">
                    <AlertTriangle size={16} />
                    <span>101</span>
                    <small>Fire (IN)</small>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmergencyPage;
