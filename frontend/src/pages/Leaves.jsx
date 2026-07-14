import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getEmployees } from '../services/employeeService';
import { applyLeave, getLeaves, updateLeaveStatus, deleteLeave } from '../services/leaveService';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

function Leaves() {
  const { user } = useAuth();
  const isManager = user?.role === 'admin' || user?.role === 'hr';

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await getLeaves();
      setLeaves(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees().then((res) => setEmployees(res.data.data));
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await applyLeave(formData);
      setIsModalOpen(false);
      setFormData({ employeeId: '', leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try {
      await deleteLeave(id);
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <Layout background="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition"
        >
          + Apply Leave
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">From</th>
              <th className="px-6 py-3">To</th>
              <th className="px-6 py-3">Days</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No leave requests yet.</td>
              </tr>
            ) : (
              leaves.map((lv) => (
                <tr key={lv._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {lv.employee?.fullName} <span className="text-gray-400">({lv.employee?.employeeId})</span>
                  </td>
                  <td className="px-6 py-3">{lv.leaveType}</td>
                  <td className="px-6 py-3">{new Date(lv.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-3">{new Date(lv.endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-3">{lv.numberOfDays}</td>
                  <td className="px-6 py-3 max-w-[160px] truncate" title={lv.reason}>{lv.reason || '-'}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[lv.status]}`}>
                      {lv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {isManager && lv.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(lv._id, 'approved')}
                          className="text-emerald-600 hover:underline text-xs font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(lv._id, 'rejected')}
                          className="text-red-600 hover:underline text-xs font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(lv._id)}
                        className="text-gray-400 hover:text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Leave">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Paid Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Apply'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default Leaves;