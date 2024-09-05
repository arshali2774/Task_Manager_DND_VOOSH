import toast from 'react-hot-toast';
import axiosInstance from '../config/axiosInstance';
import { setUser } from '../features/user/userSlice';
import { store } from '../store';
import { redirect } from 'react-router-dom';

// These actions are part of react-router-dom and are used in combination with the <Form> component to handle form submissions.
// This action is used for the login form submission
export const loginAction = async ({ request }) => {
  // Extract the form data from the request
  const formData = await request.formData();
  // Convert the form data to an object
  const data = Object.fromEntries(formData.entries());
  // Make an API call to the login endpoint with the form data
  try {
    const response = await axiosInstance.post('/auth/login', data);
    // dispatch an action to set the user in the redux store
    store.dispatch(setUser(response.data.data));
    // Store the user in localStorage for future use
    localStorage.setItem('user', JSON.stringify(response.data.data));
    // Redirect to the tasks page after login
    toast.success('Login successful');
    return redirect('/tasks');
  } catch (error) {
    console.log(error);
    // Return an error message to the component so it can display it in toast
    toast.error(error.response?.data?.message || 'Login failed');
    return { error: error.response?.data?.message || 'Login failed' };
  }
};

// This action is used for the signup form submission
export const signupAction = async ({ request }) => {
  // Extract the form data from the request
  const formData = await request.formData();
  // Convert the form data to an object
  const data = Object.fromEntries(formData.entries());
  // Make an API call to the signup endpoint with the form data
  try {
    const response = await axiosInstance.post('/auth/register', data);
    // Redirect to the login page after signup
    toast.success(response.data.message);
    return redirect('/login');
  } catch (error) {
    // show an error toast message
    toast.error(error.response?.data?.message || 'Signup failed');
    // Return an error message as we must return an object from actions
    return { error: error.response?.data?.message || 'Signup failed' };
  }
};
