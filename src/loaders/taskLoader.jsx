import toast from 'react-hot-toast';
import axiosInstance from '../config/axiosInstance';
import { redirect } from 'react-router-dom';
import { store } from '../store';
import { setTasks } from '../features/task/taskSlice';

// Loaders are part of react-router-dom, used to load data before rendering a component
// This loader is used to fetch tasks from the server
export const taskLoader = async (queryClient) => {
  try {
    // Fetch the tasks using queryClient
    const data = await queryClient.fetchQuery({
      queryKey: ['tasks'],
      queryFn: async () => {
        const response = await axiosInstance.get('/tasks');
        return response.data;
      },
    });
    // setting the tasks state in the taskSlice,
    // here we cannot use dispatch as useDispatch can only be used in a component
    store.dispatch(setTasks(data.data));
    // returning the data and isLoading and isError states
    return { data, isLoading: false, isError: false };
  } catch (error) {
    // Handle errors
    console.error('Error fetching tasks:', error);
    toast.error(
      error.response?.status === 401 ? 'Unauthorized' : 'Something went wrong'
    );
    // Redirect to login on error

    return error.response?.status === 401 ? redirect('/login') : null;
  }
};
