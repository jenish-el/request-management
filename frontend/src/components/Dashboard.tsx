import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { Request, UserRole } from '../types';
import CreateRequestModal from './CreateRequestModal';
import RequestCard from './RequestCard';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'assigned'>('all');

  useEffect(() => {
    loadRequests();
  }, [activeTab, user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      let data: Request[];
      if (activeTab === 'my') {
        data = await requestService.getMyRequests();
      } else if (activeTab === 'assigned') {
        data = await requestService.getAssignedRequests();
      } else {
        data = await requestService.getAllRequests();
      }
      setRequests(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCreated = () => {
    setShowCreateModal(false);
    loadRequests();
  };

  const handleRequestUpdated = () => {
    loadRequests();
  };



  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Employee Request Management</h1>
          <p>Welcome, {user?.name} ({user?.role})</p>
        </div>
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {user?.role === UserRole.EMPLOYEE && (
          <div className="dashboard-actions">
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              Create New Request
            </button>
          </div>
        )}

        <div className="tabs">
          <button
            className={activeTab === 'all' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('all')}
          >
            All Requests
          </button>
          <button
            className={activeTab === 'my' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('my')}
          >
            My Requests
          </button>
          {user?.role === UserRole.EMPLOYEE && (
            <button
              className={activeTab === 'assigned' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('assigned')}
            >
              Assigned to Me
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : (
          <div className="requests-grid">
            {requests.length === 0 ? (
              <div className="empty-state">No requests found</div>
            ) : (
              requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  currentUser={user!}
                  onUpdate={handleRequestUpdated}
                />
              ))
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleRequestCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;

