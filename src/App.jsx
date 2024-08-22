/* eslint-disable react/prop-types */
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { Error, Layout, Login, Signup, Tasks } from './pages';
import { loginAction, signupAction } from './actions/authAction';
import { taskLoader } from './loaders/taskLoader';
import { addTaskAction, editTaskAction } from './actions/taskAction';
import { useSelector } from 'react-redux';
// protected route for authenticated users
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  if (!user) {
    return <Navigate to='/login' replace />;
  }
  return <>{children}</>;
};

const App = ({ queryClient }) => {
  const user = useSelector((state) => state.user.user);
  // router for the app
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Navigate to='login' replace />,
        },
        {
          path: '*',
          element: <Navigate to='/' replace />,
        },
        {
          path: 'login',
          element: user ? <Navigate to='/tasks' replace /> : <Login />,
          action: loginAction,
        },
        {
          path: 'signup',
          element: user ? <Navigate to='/tasks' replace /> : <Signup />,
          action: signupAction,
        },
        {
          path: 'tasks',
          element: (
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          ),
          loader: () => taskLoader(queryClient),
          action: addTaskAction,
          children: [
            {
              path: '/tasks/:id/edit',
              action: editTaskAction,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};
export default App;
