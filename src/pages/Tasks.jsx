/* eslint-disable react/prop-types */
import { FaPlus } from 'react-icons/fa';
import axiosInstance from '../config/axiosInstance';
import { Form } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTasks } from '../hooks/useTasks';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  moveTaskAcrossColumns,
  reorderTasks,
} from '../features/task/taskSlice';
import { statusMapping } from '../utils/statusMapping';
import TaskCard from '../components/TaskCard';
import { useState } from 'react';
import SearchResult from '../components/SearchResult';
import { debounce } from 'lodash';

// This page requires many functionalities so it is bit complex
// I have divided the code into multiple components to make it more readable
// Since there was only one page accessing the components, I have not separated them into separate files
// Except for TaskCard and SearchResult.
// I built TaskCard seprately because i thought i can use it in SearchResult as well
// But i went on going in other direction.

// Each column is its own component.
const ColumnCard = ({ heading, tasks, columnId }) => {
  return (
    <div className='bg-base-300 rounded-lg shadow-lg w-full overflow-hidden'>
      <h3 className='bg-accent text-accent-content text-lg text-center font-semibold py-1'>
        {heading}
      </h3>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='flex flex-col px-2 my-2 gap-2 overflow-y-auto h-[calc(100%-55px)] scrollbar-thin scrollbar-thumb-neutral scrollbar-track-transparent'
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
// This is the main component for the Tasks page
const Tasks = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { tasks: tasksState } = useSelector((state) => state.task);
  const { isFetching } = useTasks();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('Recent');
  // Debounce the search term
  const handleSearchChange = (e) => {
    const value = e.target.value;
    debounceUpdateSearchTerm(value);
  };
  const debounceUpdateSearchTerm = debounce((value) => {
    setDebouncedSearchTerm(value);
  }, 500);
  // sort functionality
  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };
  // search functionality
  const {
    data,
    isFetching: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ['searchTasks', debouncedSearchTerm, selectedSort],
    queryFn: async () => {
      if (debouncedSearchTerm) {
        const response = await axiosInstance.get(
          `/tasks/search?title=${debouncedSearchTerm}&sort=${selectedSort}`
        );
        return response;
      }
      return [];
    },
    enabled: !!debouncedSearchTerm, // Only run the query if there is a search term
  });
  // updating the task status on backend after dragging and dropping
  const mutation = useMutation({
    mutationFn: async ({ id, status, arrIdx }) => {
      return await axiosInstance.put(`/tasks/${id}`, { status, arrIdx });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to move task');
    },
  });
  // onDragEnd function is used for updating the task status after dragging and dropping
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return; // Dropped outside the list
    // get the source and destination column id, source index, destination index, task id and new status
    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    const taskId = result.draggableId;
    const newStatus = statusMapping[destinationColumnId];
    // if the source and destination column id are the same, reorder the task
    if (sourceColumnId === destinationColumnId) {
      dispatch(
        reorderTasks({
          destinationIndex: destinationIndex,
          sourceIndex: sourceIndex,
          columnId: sourceColumnId,
        })
      );
    } else {
      // if the source and destination column id are different, move the task across columns
      dispatch(
        moveTaskAcrossColumns({
          taskId,
          sourceColumnId,
          destinationColumnId,
          sourceIndex,
          destinationIndex,
        })
      );
    }

    // Update the task status in the backend
    try {
      await mutation.mutateAsync({
        id: taskId,
        status: newStatus,
        arrIdx: destinationIndex,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update task status'
      );
    }
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Modal for adding a new task */}
      <button
        className='btn btn-primary text-primary-content btn-wide'
        onClick={() => document.getElementById('my_modal_1').showModal()}
      >
        <FaPlus />
        Add Task
      </button>
      <dialog id='my_modal_1' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Add Task</h3>
          <Form
            className='mt-4 flex flex-col gap-4'
            method='POST'
            action='/tasks'
          >
            <input
              type='text'
              name='title'
              placeholder='Title'
              className='input input-bordered w-full'
            />
            <textarea
              name='description'
              className='textarea textarea-bordered resize-none w-full'
              placeholder='Description'
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
      {/* search and sort functionality */}
      <div className='flex gap-12 items-center p-3 rounded-xl bg-base-200 shadow-lg'>
        <label className='input input-bordered flex items-center gap-2 grow'>
          <input
            type='text'
            className='grow'
            placeholder='Search'
            onChange={handleSearchChange}
          />
        </label>
        <label className=' flex items-center gap-2'>
          <span className='text-nowrap font-semibold'>Sort By:</span>
          <select
            className='select select-bordered w-48'
            onChange={handleSortChange}
          >
            <option>Recent</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </label>
      </div>
      {debouncedSearchTerm ? (
        // if there is a search term, display the search results
        <SearchResult
          tasks={data}
          error={searchError}
          isSearching={isSearching}
        />
      ) : (
        // if there is no search term, display the columns with tasks
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='flex justify-between grow gap-3 max-h-[79%]'>
            <ColumnCard
              heading={'To Do'}
              tasks={tasksState.filter((task) => task.status === 'To Do')}
              columnId='todo'
            />
            <ColumnCard
              heading={'In Progress'}
              tasks={tasksState.filter((task) => task.status === 'In Progress')}
              columnId='in-progress'
            />
            <ColumnCard
              heading={'Done'}
              tasks={tasksState.filter((task) => task.status === 'Done')}
              columnId='done'
            />
          </div>
        </DragDropContext>
      )}
    </div>
  );
};
export default Tasks;
