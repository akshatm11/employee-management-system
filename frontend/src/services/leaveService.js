import api from './api';

export const applyLeave = (data) => {
  return api.post('/leaves', data);
};

export const getLeaves = (params = {}) => {
  return api.get('/leaves', { params });
};

export const updateLeaveStatus = (id, status) => {
  return api.put(`/leaves/${id}/status`, { status });
};

export const deleteLeave = (id) => {
  return api.delete(`/leaves/${id}`);
};