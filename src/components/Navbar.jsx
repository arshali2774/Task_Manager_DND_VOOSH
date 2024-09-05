import { FaTasks } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';
import { clearUser } from '../features/user/userSlice';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // logout functionality
  const handleLogout = async () => {
    try {
      // Make the POST request to the logout API
      await axiosInstance.get('/auth/logout');

      // Clear user from Redux state and localStorage
      dispatch(clearUser());
      // navigate to login page
      navigate('/login');
    } catch (error) {
      // Handle logout error
      toast.error('Logout failed. Please try again.');
      console.error('Logout failed:', error);
    }
  };
  return (
    <nav className='w-full flex justify-between items-center bg-base-200 text-base-200-content px-10 py-4 shadow-md'>
      <Link
        to='/tasks'
        className={
          location.pathname === '/tasks' ? 'btn btn-accent' : 'btn btn-ghost'
        }
      >
        <FaTasks fontSize={20} />
      </Link>
      {/* if there is a user logged in, display logout button */}
      {user ? (
        <button onClick={handleLogout} className='btn btn-secondary'>
          Logout
        </button>
      ) : (
        // if there is no user logged in, display login and signup buttons
        <div className='flex items-center gap-8'>
          <Link
            to='/'
            className={
              location.pathname === '/login'
                ? 'btn btn-accent'
                : 'btn btn-ghost'
            }
          >
            Login
          </Link>
          <Link
            to='/signup'
            className={
              location.pathname === '/signup'
                ? 'btn btn-accent'
                : 'btn btn-ghost'
            }
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
