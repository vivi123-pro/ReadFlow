import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";

const Header = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  // Mock authentication state - in real app, this would come from context/store
  const isAuthenticated = false; // TODO: Replace with actual auth state

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent1 to-accent2 rounded-lg flex items-center justify-center">
              <IoBookSharp className="text-white text-lg" />
            </div>
            <h1 className="text-2xl font-serif font-light text-text">Narrate</h1>
          </Link>

          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              // Authenticated user navigation
              <>
                <Link to="/library" className="text-text/70 hover:text-text transition-colors">
                  <button className="text-text/70 hover:text-text transition-colors">
                    Library
                  </button>
                </Link>
                <Link to="/progress" className="text-text/70 hover:text-text transition-colors">
                  <button className="text-text/70 hover:text-text transition-colors">
                    Progress
                  </button>
                </Link>
                <button className="w-8 h-8 bg-gradient-to-r from-accent1 to-accent2 rounded-lg flex items-center justify-center">
                  <FaUserCircle className="text-white text-lg" />
                </button>
              </>
            ) : !isAuthPage ? (
              // Public navigation (not on auth pages)
              <>
                <Link to="/login" className="text-text/70 hover:text-text transition-colors">
                  <button className="text-text/70 hover:text-text transition-colors">
                    Sign In
                  </button>
                </Link>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-accent1 to-accent2 text-text px-4 py-2 rounded-xl hover:shadow-lg transition-all text-sm font-medium"
                >
                  Get Started
                </button>
              </>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
