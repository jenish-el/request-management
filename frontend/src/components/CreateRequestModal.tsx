import React, { useState } from 'react';
import { requestService } from '../services/requestService';
import { CreateRequestDto } from '../types';

interface CreateRequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateRequestDto>({
    title: '',
    description: '',
    assigned_to: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.assigned_to || formData.assigned_to <= 0) {
      setError('Please enter a valid user ID to assign the request to');
      return;
    }

    setLoading(true);
    try {
      await requestService.createRequest(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Request</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              minLength={3}
              placeholder="Enter request title"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              minLength={10}
              rows={4}
              placeholder="Enter request description (min 10 characters)"
            />
          </div>
          <div className="form-group">
            <label>Assign To (User ID)</label>
            <input
              type="number"
              value={formData.assigned_to || ''}
              onChange={(e) => setFormData({ ...formData, assigned_to: parseInt(e.target.value) || 0 })}
              required
              min={1}
              placeholder="Enter user ID to assign this request"
            />
            <small>Enter the ID of the user you want to assign this request to</small>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;

