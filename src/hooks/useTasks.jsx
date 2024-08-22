import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axiosInstance';

// custom hook for fetching tasks from the server
export const useTasks = () => {
  const { data: tasks, isFetching } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axiosInstance.get('/tasks');
      return response.data;
    },
  });

  return { tasks, isFetching };
};
