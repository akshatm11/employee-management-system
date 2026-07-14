import api from './api';

export const getDepartments = () => {
  return api.get('/departments');
};

export const createDepartment = (data) => {
  return api.post('/departments', data);
};

export const deleteDepartment = (id) => {
  return api.delete(`/departments/${id}`);
};