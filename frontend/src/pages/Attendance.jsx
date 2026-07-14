import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getEmployees } from '../services/employeeService';
import { checkIn, checkOut, getAttendance, getTodayStatus } from '../services/attendanceService';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [todayStatus, setTodayStatus] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getEmployees().then((res) => setEmployees(res.data.data));
  }, []);

  useEffect(() => {
    if (!selectedEmployee) return;
    fetchTodayStatus();
    fetchHistory();
  }, [selectedEmployee]);

  const fetchTodayStatus = async () => {
    try {
      const res = await getTodayStatus(selectedEmployee);
      setTodayStatus(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getAttendance({ employeeId: selectedEmployee });
      setRecords(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    setMessage('');
    setLoading(true);
    try {
      await checkIn(selectedEmployee);
      setMessage('Checked in successfully!');
      fetchTodayStatus();
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setMessage('');
    setLoading(true);
    try {
      await checkOut(selectedEmployee);
      setMessage('Checked out successfully!');
      fetchTodayStatus();
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout background="bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.fullName} ({emp.employeeId})
            </option>
          ))}
        </select>

        {selectedEmployee && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Today's status:{' '}
              {todayStatus?.checkIn ? (
                <span className="text-green-600 font-medium">
                  Checked in at {new Date(todayStatus.checkIn).toLocaleTimeString()}
                  {todayStatus.checkOut &&
                    ` — Checked out at ${new Date(todayStatus.checkOut).toLocaleTimeString()}`}
                </span>
              ) : (
                <span className="text-gray-400">Not checked in yet</span>
              )}
            </p>

            {message && <p className="text-sm text-blue-600 mb-3">{message}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleCheckIn}
                disabled={loading || todayStatus?.checkIn}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                Check In
              </button>
              <button
                onClick={handleCheckOut}
                disabled={loading || !todayStatus?.checkIn || todayStatus?.checkOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
              >
                Check Out
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedEmployee && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Check In</th>
                <th className="px-6 py-3">Check Out</th>
                <th className="px-6 py-3">Working Hours</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No attendance records yet.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{new Date(rec.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-3">
                      {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-3">{rec.workingHours} hrs</td>
                    <td className="px-6 py-3 capitalize">{rec.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default Attendance;