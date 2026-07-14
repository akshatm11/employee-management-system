import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import AddEmployeeForm from '../components/AddEmployeeForm';
import { getEmployees, deleteEmployee } from '../services/employeeService';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees({ search });
      setEmployees(response.data.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchEmployees();
  };

  return (
    <Layout background="bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Employee
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Employee ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Designation</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Salary</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{emp.employeeId}</td>
                  <td className="px-6 py-3">{emp.fullName}</td>
                  <td className="px-6 py-3">{emp.email}</td>
                  <td className="px-6 py-3">{emp.designation || '-'}</td>
                  <td className="px-6 py-3">{emp.department?.name || '-'}</td>
                  <td className="px-6 py-3">₹{emp.salary?.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
        <AddEmployeeForm onSuccess={handleAddSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </Layout>
  );
}

export default Employees;