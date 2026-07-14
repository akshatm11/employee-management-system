import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-gray-700 text-sm">
          {user?.name} <span className="text-gray-400">({user?.role})</span>
        </span>
        <button
          onClick={logout}
          className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;