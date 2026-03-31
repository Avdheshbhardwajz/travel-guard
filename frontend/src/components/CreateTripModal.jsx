import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

function CreateTripModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Trip title is required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/trips', form);
      toast.success('Trip created!');
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Trip</h2>
          <button className="btn-icon btn-ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Trip Title *</label>
              <input
                name="title"
                className="form-input"
                placeholder="e.g., Goa Beach Vacation"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination</label>
              <input
                name="destination"
                className="form-input"
                placeholder="e.g., Goa, India"
                value={form.destination}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Describe your trip..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  name="startDate"
                  type="date"
                  className="form-input"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  name="endDate"
                  type="date"
                  className="form-input"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Budget (₹)</label>
              <input
                name="budget"
                type="number"
                className="form-input"
                placeholder="e.g., 25000"
                value={form.budget}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTripModal;
