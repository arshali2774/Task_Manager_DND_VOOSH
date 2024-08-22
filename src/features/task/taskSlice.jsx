import { createSlice } from '@reduxjs/toolkit';
import { statusMapping } from '../../utils/statusMapping';

// initial state for the task slice
const initialState = {
  tasks: [],
  isLoading: false,
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // setIsLoading action
    setIsLoading: (state) => {
      state.isLoading = true;
    },
    // setIsNotLoading action
    setIsNotLoading: (state) => {
      state.isLoading = false;
    },
    // setTasks action used for setting the tasks in the task list
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    // reorderTasks action used for reordering tasks within a column
    reorderTasks(state, action) {
      // columnId is the id of the column the task is being moved to like: todo, in-progress, done
      // sourceIndex is the index of the task being moved provided by @hello-panega/dnd
      // destinationIndex is the new index of the task provided by @hello-panega/dnd
      const { columnId, sourceIndex, destinationIndex } = action.payload;
      // Filter tasks by the column ID
      const columnTasks = state.tasks.filter(
        // statusMapping is a mapping of columnId to task status, since the task status are as follows: To Do, In Progress, Done and columnId are as follows: todo, in-progress, done
        (task) => task.status === statusMapping[columnId]
      );

      // Remove the task being reordered from its current position
      const [movedTask] = columnTasks.splice(sourceIndex, 1);

      // Insert the task into its new position
      columnTasks.splice(destinationIndex, 0, movedTask);

      // Update `arrIdx` for each task in the column to reflect the new order
      columnTasks.forEach((task, index) => {
        task.arrIdx = index;
      });

      // Create a new array with all tasks, replacing tasks in the affected column
      const updatedTasks = state.tasks.map((task) =>
        task.status === columnId
          ? columnTasks.find((t) => t._id === task._id)
          : task
      );

      // Sort the entire task array based on arrIdx
      updatedTasks.sort((a, b) => a.arrIdx - b.arrIdx);

      // Update the state with the sorted tasks array
      state.tasks = updatedTasks;
    },
    // moveTaskAcrossColumns action used for moving a task across columns
    moveTaskAcrossColumns(state, action) {
      // taskId is the id of the task to be moved
      // sourceColumnId is the id of the column the task is currently in
      // sourceIndex is the index of the task in the source column
      // destinationColumnId is the id of the column the task is being moved to
      // destinationIndex is the index of the task in the destination column
      const {
        taskId,
        sourceColumnId,
        sourceIndex,
        destinationColumnId,
        destinationIndex,
      } = action.payload;

      // Find the task to be moved based on its ID
      const task = state.tasks.find((task) => task._id === taskId);

      // If the task isn't found, exit the reducer early
      if (!task) return;

      // Update the task's status to reflect its new column
      task.status = statusMapping[destinationColumnId];

      // Update the task's index to its new position within the destination column
      task.arrIdx = destinationIndex;

      // Update indices of tasks in the source column
      // 1. Filter tasks by the source column ID excluding the task being moved
      // 2. Map each task to its new index
      // 3. Sort the tasks by their new index
      const updatedSourceTasks = state.tasks
        .filter(
          (task) =>
            task.status === statusMapping[sourceColumnId] && task._id !== taskId
        )
        .map((task) => {
          // Decrement the index of tasks that were after the moved task in the source column
          if (task.arrIdx > sourceIndex) {
            return { ...task, arrIdx: task.arrIdx - 1 };
          }
          return task;
        });

      // Update indices of tasks in the destination column
      // 1. Filter tasks by the destination column ID or the task being moved
      // 2. Map each task to its new index
      // 3. Sort the tasks by their new index
      const updatedDestinationTasks = state.tasks
        .filter(
          (task) =>
            task.status === statusMapping[destinationColumnId] ||
            task._id === taskId
        )
        .map((task) => {
          // If the current task is the one being moved, set its index to the destinationIndex
          if (task._id === taskId) {
            return { ...task, arrIdx: destinationIndex };
          }

          // Increment the index of tasks that are after the new position in the destination column
          if (
            task.status === statusMapping[destinationColumnId] &&
            task.arrIdx >= destinationIndex
          ) {
            return { ...task, arrIdx: task.arrIdx + 1 };
          }

          return task;
        });

      // Update the state with the new tasks array:
      state.tasks = [
        // Keep all tasks that are not in the source or destination columns
        ...state.tasks.filter(
          (task) =>
            task.status !== statusMapping[sourceColumnId] &&
            task.status !== statusMapping[destinationColumnId]
        ),

        // Add the updated tasks in the source column, sorted by their updated indices
        ...updatedSourceTasks.sort((a, b) => a.arrIdx - b.arrIdx),

        // Add the updated tasks in the destination column, sorted by their updated indices
        ...updatedDestinationTasks.sort((a, b) => a.arrIdx - b.arrIdx),
      ];
    },
    // removeTask action used for removing a task from the task list
    removeTask: (state, action) => {
      const { id } = action.payload;
      state.tasks = state.tasks.filter((task) => task._id !== id);
    },
  },
});

export const {
  setIsLoading,
  setIsNotLoading,
  setTasks,
  reorderTasks,
  removeTask,
  updateTaskStatus,
  moveTaskAcrossColumns,
} = taskSlice.actions;

export default taskSlice.reducer;
