import api from './api';

export const checkIn = (employeeId) => {
  return api.post('/attendance/checkin', { employeeId });
};

export const checkOut = (employeeId) => {
  return api.post('/attendance/checkout', { employeeId });
};

export const getAttendance = (params = {}) => {
  return api.get('/attendance', { params });
};

export const getTodayStatus = (employeeId) => {
  return api.get(`/attendance/today/${employeeId}`);
};