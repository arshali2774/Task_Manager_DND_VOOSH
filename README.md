# Task Manager App (client-side)

This is a task manager app built using React, Redux Toolkit, Tanstack Query, React Router Dom, Hello Pangea Drag and Drop, Tailwind CSS, and DaisyUI.

## Features

- User authentication using JWT
- CRUD operations for tasks
- Drag and drop functionality for reordering tasks
- Search functionality for tasks
- Sorting functionality for tasks
- Error handling for API requests

## Getting Started

To get started, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/arshali2774/Task_Manager_DND_VOOSH.git
```

2. Navigate to the project directory:

```bash
cd Task_Manager_DND_VOOSH
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`.

## Process Explanation

The project is divided into two main components: the client-side and the server-side. I will talk about the client-side only in this readme. I will cover the server-side in a separate readme on a different repository.

- The first thing i did was to create the UI like, Login, Signup, Tasks, Layout, Error pages.
- Once the routing was done i started working on the components.
- I created a custom hook for fetching tasks from the server, custom axios instance, redux store and slices.
- Integrating login and signup APIs was easy.
- Integrating the CRUD APIs for the tasks took some time but i got it done.
- The main challenge was to integrate the drag and drop functionality for reordering tasks.
- I used the @hello-pangea/dnd library for this.
- I have to use both the @tanstack/react-query (for backend and updating the database) and @reduxjs/toolkit (for frontend and client-side state) libraries for updating the task `status` and their `arrIndex` after dragging and dropping and reordering tasks.
- I have created seprate actions for reordering tasks in same column and moving tasks across columns maintaining the order.
- For reordering tasks in same column,
  1. Made an array of tasks in same column.
  2. Removed the task to be moved from its current position in the array.
  3. Inserted the task to be moved into its new position in the array.
  4. Updated the `arrIdx` of the all the tasks in the same column to reflect the new order.
  5. Created a new array of all the tasks and replacing the tasks in the affected column.
  6. Sorted the entire task array based on `arrIdx`.
  7. Updated the state with the new tasks array.
- For moving tasks across columns,
  1. Find the task to be moved based on its ID.
  2. If the task isn't found, exit the reducer early.
  3. Update the task's status to reflect its new column.
  4. Update the task's index to its new position within the destination column.
  5. Update indices of tasks in the source column, since the task is being moved so indices of all the other tasks after the moved task in the source column are decremented by 1.
  6. Update indices of tasks in the destination column, since the task is being moved so indices of all the other tasks after the moved task in the destination column are incremented by 1.
  7. Update the state by keeping all tasks that are not in the source or destination columns and sorted source and destination columns based on their indices.
- Integrating the 'Login with Google' functionality was easy, i just have to redirect to the route where backend was handling it and then i can get the user information from the backend.

## Conclusion

I learned a lot about React, Redux Toolkit, Tanstack Query, React Router Dom, Hello Pangea Drag and Drop, Tailwind CSS, and DaisyUI. I also learned how to use hooks effectively and how to integrate them with other libraries. I also learned how to handle errors and how to make API requests in React. Overall, I am very satisfied with the project and would recommend it to anyone who wants to learn React, Redux Toolkit, Tanstack Query, React Router Dom, Hello Pangea Drag and Drop, Tailwind CSS, and DaisyUI.
