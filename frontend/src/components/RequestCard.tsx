import React, { useState } from 'react';
import { Request, User, UserRole, RequestStatus } from '../types';
import { requestService } from '../services/requestService';

interface RequestCardProps {
  request: Request;
  currentUser: User;
  onUpdate: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, currentUser, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isManager = currentUser.role === UserRole.MANAGER;
  const isAssignedToMe = request.assigned_to === currentUser.id;

  // Manager can approve if: is manager, request hasn't been reviewed yet, and status is pending
  // The backend will validate that the request is assigned to the manager's employee
  const canApprove = isManager && request.manager_approval === null && request.status === RequestStatus.PENDING;
  // Employee can only update if:
  // 1. Request is assigned to them
  // 2. Manager has APPROVED it (manager_approval === true, not false or null)
  // 3. Status is APPROVED (can start work) or IN_PROGRESS (can close)
  // Note: Rejected requests (manager_approval === false) cannot be updated
  const canUpdate = isAssignedToMe && request.manager_approval === true &&
    (request.status === RequestStatus.APPROVED || request.status === RequestStatus.IN_PROGRESS);

  const handleApprove = async () => {
    setLoading(true);
    setError('');
    try {
      await requestService.approveRequest(request.id);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setError('');
    try {
      await requestService.rejectRequest(request.id);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: RequestStatus) => {
    setLoading(true);
    setError('');
    try {
      await requestService.updateRequest(request.id, { status: newStatus });
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    const statusClass = `status-badge status-${status.replace('_', '-')}`;
    return <span className={statusClass}>{status.toUpperCase().replace('_', ' ')}</span>;
  };

  return (
    <div className="request-card">
      <div className="request-header">
        <h3>{request.title}</h3>
        {getStatusBadge(request.status)}
      </div>
      <p className="request-description">{request.description}</p>
      <div className="request-meta">
        <div><strong>Created By:</strong> User ID {request.created_by}</div>
        <div><strong>Assigned To:</strong> User ID {request.assigned_to}</div>
        {request.manager_id && (
          <div><strong>Manager:</strong> User ID {request.manager_id}</div>
        )}
        <div><strong>Created:</strong> {new Date(request.created_at).toLocaleString()}</div>
        {request.closed_at && (
          <div><strong>Closed:</strong> {new Date(request.closed_at).toLocaleString()}</div>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="request-actions">
        {canApprove && (
          <>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="btn-success"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="btn-danger"
            >
              Reject
            </button>
          </>
        )}
        {canUpdate && (
          <>
            {request.status === RequestStatus.APPROVED && (
              <button
                onClick={() => handleStatusChange(RequestStatus.IN_PROGRESS)}
                disabled={loading}
                className="btn-primary"
              >
                Start Work
              </button>
            )}
            {request.status === RequestStatus.IN_PROGRESS && (
              <button
                onClick={() => handleStatusChange(RequestStatus.CLOSED)}
                disabled={loading}
                className="btn-success"
              >
                Close Request
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RequestCard;

