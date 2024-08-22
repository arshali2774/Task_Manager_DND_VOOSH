import { Link, useRouteError } from 'react-router-dom';
// error page for displaying errors
const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className='pt-20 text-center'>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i className='text-red-500'>
          {error ? error.statusText || error.message : 'No error information'}
        </i>
      </p>
      <Link to='/' className='btn btn-primary mt-5'>
        Go back to Home
      </Link>
    </div>
  );
};
export default Error;
