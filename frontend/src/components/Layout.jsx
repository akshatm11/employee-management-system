import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout({ children, background = 'bg-gray-50' }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className={`p-6 ${background} min-h-[calc(100vh-64px)]`}>{children}</main>
      </div>
    </div>
  );
}

export default Layout;