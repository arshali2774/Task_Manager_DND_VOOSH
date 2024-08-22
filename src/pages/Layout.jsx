import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import axiosInstance from '../config/axiosInstance';
import { setUser } from '../features/user/userSlice';
import { useDispatch } from 'react-redux';

const Layout = () => {
  const dispatch = useDispatch();
  // if user signin or signup using google this useEffect will run to get the user information to access the protected routes
  useEffect(() => {
    // fetchUser function to fetch the user information
    const fetchUser = async () => {
      try {
        // Fetch the current user data
        const response = await axiosInstance.get('/auth/user');
        // dispatch the user information to the userSlice
        dispatch(setUser(response.data));
        // set the user information in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    };
    // check if the user information is stored in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      // if not, fetch the user information
      fetchUser();
    } else {
      // if yes, dispatch the user information to the userSlice
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);
  return (
    <div>
      <header className='fixed top-0 left-0 right-0 z-10'>
        <Navbar />
      </header>
      <main className='h-screen px-10 pt-28 pb-8 flex justify-center overflow-hidden '>
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
