/* eslint-disable react/prop-types */
import { FaAddressBook, FaEnvelope, FaKey } from 'react-icons/fa';
import { Form, Link } from 'react-router-dom';

const FormComp = ({ formType }) => {
  // login with google functionality
  // redirecting to backend api route and then backend take care of the rest
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };
  return (
    <div>
      <h1 className='text-4xl font-bold mb-8 text-accent'>
        {formType === 'login' ? 'Login' : 'Sign Up'}
      </h1>
      <div className='border-4 w-[30rem] border-accent rounded-md p-10'>
        {formType === 'login' ? (
          // login form using react router dom <Form> component
          <Form
            className=' flex flex-col gap-4 mb-8'
            method='POST'
            action='/login'
          >
            <label className='input input-bordered flex items-center gap-2 '>
              <FaEnvelope />
              <input
                type='email'
                name='email'
                placeholder='Email'
                className='grow'
              />
            </label>
            <label className='input input-bordered flex items-center gap-2 '>
              <FaKey />
              <input
                type='password'
                name='password'
                placeholder='Password'
                className='grow'
              />
            </label>

            <button
              type='submit'
              className='btn btn-wide btn-secondary self-center '
            >
              Login
            </button>
          </Form>
        ) : (
          // signup form using react router dom <Form> component
          <Form
            className=' flex flex-col gap-4 mb-8'
            method='POST'
            action='/signup'
          >
            <label className='input input-bordered flex items-center gap-2 '>
              <FaAddressBook />
              <input
                type='text'
                name='firstName'
                placeholder='First Name'
                className='grow'
              />
            </label>
            <label className='input input-bordered flex items-center gap-2 '>
              <FaAddressBook />
              <input
                type='text'
                name='lastName'
                placeholder='Last Name'
                className='grow'
              />
            </label>
            <label className='input input-bordered flex items-center gap-2 '>
              <FaEnvelope />
              <input
                type='email'
                name='email'
                placeholder='Email'
                className='grow'
              />
            </label>
            <label className='input input-bordered flex items-center gap-2 '>
              <FaKey />
              <input
                type='password'
                name='password'
                placeholder='Password'
                className='grow'
              />
            </label>

            <label className='input input-bordered flex items-center gap-2 '>
              <FaKey />
              <input
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                className='grow'
              />
            </label>

            <button
              type='submit'
              className='btn btn-wide btn-secondary self-center '
            >
              Sign Up
            </button>
          </Form>
        )}
        {formType === 'login' ? (
          <p className='text-center'>
            Don&apos;t have an account?{' '}
            <Link to='/signup' className='link link-primary font-semibold'>
              Sign Up
            </Link>
          </p>
        ) : (
          <p className='text-center'>
            Already have an account?{' '}
            <Link to='/login' className='link link-primary font-semibold'>
              Login
            </Link>
          </p>
        )}

        <button
          className=' block mx-auto btn btn-ghost mt-4'
          onClick={handleGoogleLogin}
        >
          {formType === 'login' ? 'Login with Google' : 'Sign up with Google'}
        </button>
      </div>
    </div>
  );
};
export default FormComp;
