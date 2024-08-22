import toast from 'react-hot-toast';
import axiosInstance from '../config/axiosInstance';
import { redirect } from 'react-router-dom';

// This action is used for the add task form submission
export const addTaskAction = async ({ request }) => {
  // Extract the form data from the request
  const formData = await request.formData();
  // Convert the form data to an object
  const data = Object.fromEntries(formData.entries());
  // Make an API call to the add task endpoint with the form data
  try {
    const response = await axiosInstance.post('/tasks', data);
    // Show a success toast message
    toast.success('Task created successfully');
    // Return the response data to the component so it can display it in toast
    return { data: response.data };
  } catch (error) {
    // show an error toast message
    toast.error(error.response?.data?.message || 'Task creation failed');
    // Return an error message as we must return an object from actions
    return { error: error.response?.data?.message || 'Task creation failed' };
  }
};

// This action is used for the edit task form submission
export const editTaskAction = async ({ request, params }) => {
  // Extract the form data from the request
  const formData = await request.formData();
  // Convert the form data to an object
  const data = Object.fromEntries(formData.entries());
  // Make an API call to the edit task endpoint with the form data
  try {
    // eslint-disable-next-line no-unused-vars
    const response = await axiosInstance.put(`/tasks/${params.id}`, data);
    // Show a success toast message
    toast.success('Task updated successfully');
    // Redirect to the tasks page after successful update
    return redirect('/tasks');
  } catch (error) {
    // Show an error toast message
    toast.error(error.response?.data?.message || 'Task update failed');
    return { error: error.response?.data?.message || 'Task update failed' };
  }
};
