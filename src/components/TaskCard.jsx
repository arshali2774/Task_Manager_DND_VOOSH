/* eslint-disable react/prop-types */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useDispatch } from 'react-redux';
import axiosInstance from '../config/axiosInstance';
import toast from 'react-hot-toast';
import { removeTask } from '../features/task/taskSlice';
import { Form } from 'react-router-dom';

const TaskCard = ({ task }) => {
  // modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // date formatting
  const date = new Date(task.createdAt);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();
  // query client for invalidating the query
  const queryClient = useQueryClient();
  // using isFetching to disable button while fetching
  const { isFetching } = useTasks();
  const dispatch = useDispatch();
  // mutation for deleting the task
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await axiosInstance.delete(`/tasks/${id}`);
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      // Update the Redux state to remove the deleted task
      dispatch(removeTask({ id: task._id }));
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });
  // handle delete functionality on button click
  const handleDelete = async (id) => {
    try {
      await mutation.mutateAsync(id);
    } catch (error) {
      console.error('Error during mutation:', error);
    }
  };

  return (
    <div className='bg-neutral text-neutral-content rounded-md px-3 py-2 flex flex-col gap-2'>
      <p className='text-lg font-semibold capitalize'>{task.title}</p>
      <p>{task.description}</p>
      <p className='text-sm italic'>
        Created At: {formattedDate}, {formattedTime}
      </p>
      <div className='join self-end mt-4'>
        <button
          className='btn btn-sm join-item btn-error'
          onClick={() => handleDelete(task._id)}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <span className='loading loading-spinner'></span>
          ) : (
            'Delete'
          )}
        </button>
        <button
          className='btn btn-sm join-item btn-info'
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit
        </button>
        {/* Edit Modal */}
        {isEditModalOpen && (
          // modal is created using daisyUI classes in combination with tailwind classes
          <dialog className='modal' open>
            <div className='modal-box'>
              <button
                className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                onClick={() => setIsEditModalOpen(false)}
              >
                ✕
              </button>
              <h3 className='font-bold text-lg'>Edit Task</h3>
              {/* form is created using react router dom <Form> component */}
              <Form
                className='mt-4 flex flex-col gap-4'
                method='POST'
                action={`/tasks/${task._id}/edit`}
              >
                <input
                  type='text'
                  name='title'
                  placeholder='Title'
                  className='input input-bordered w-full capitalize'
                  defaultValue={task.title}
                />
                <textarea
                  name='description'
                  className='textarea textarea-bordered resize-none w-full'
                  placeholder='Description'
                  defaultValue={task.description}
                ></textarea>
                <button
                  className='btn btn-primary'
                  type='submit'
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <>
                      <span className='loading loading-spinner'></span>
                      Saving
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </Form>
            </div>
          </dialog>
        )}
        <button
          className='btn btn-sm join-item btn-success'
          onClick={() => setIsViewModalOpen(true)}
        >
          View Details
        </button>
        {/* View Details Modal */}
        {isViewModalOpen && (
          <dialog className='modal' open>
            <div className='modal-box'>
              <button
                className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                onClick={() => setIsViewModalOpen(false)}
              >
                ✕
              </button>
              <h3 className='font-bold text-lg'>{task.status} Task</h3>
              <div className='mt-4 flex flex-col gap-1.5'>
                <h4 className='text-[1.1rem] font-semibold capitalize text-secondary'>
                  {task.title}
                </h4>
                <p className='text-md text-secondary'>{task.description}</p>
                <p className='text-sm italic self-end mt-4'>
                  Created At: {formattedDate}, {formattedTime}
                </p>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};
export default TaskCard;
