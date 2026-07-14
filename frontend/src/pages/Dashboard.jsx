import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout background="bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600">
        Welcome back, <span className="font-semibold">{user?.name}</span>!
      </p>
    </Layout>
  );
}

export default Dashboard;