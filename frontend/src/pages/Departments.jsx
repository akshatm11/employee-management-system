import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import AddDepartmentForm from '../components/AddDepartmentForm';
import { getDepartments, deleteDepartment } from '../services/departmentService';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await getDepartments();
      setDepartments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchDepartments();
  };

  return (
    <Layout background="bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Department
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : departments.length === 0 ? (
        <p className="text-gray-500">No departments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept._id} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
                <button
                  onClick={() => handleDelete(dept._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">{dept.description || 'No description'}</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-600">
                  Employees: <span className="font-medium">{dept.employeeCount}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Department">
        <AddDepartmentForm onSuccess={handleAddSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </Layout>
  );
}

export default Departments;