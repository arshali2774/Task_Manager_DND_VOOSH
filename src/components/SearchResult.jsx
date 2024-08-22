/* eslint-disable react/prop-types */
// Search Result Component
// Simply taking tasks, error and isSearching as props and rendering the component with necessary logic
// isSearching is used to show loading spinner or error message
// atlast checking if tasks is not null and the array length is greater than 0, we render the search results
const SearchResult = ({ tasks, error, isSearching }) => {
  return (
    <div className='bg-base-300 rounded-lg shadow-lg w-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral scrollbar-track-transparent grow max-h-[79%]'>
      {isSearching ? (
        <div className='flex justify-center items-center h-full'>
          <span className='loading loading-spinner loading-lg'></span>
        </div>
      ) : error ? (
        <div className='flex justify-center items-center h-full'>
          <span className='text-red-500'>{error.response?.data?.message}</span>
        </div>
      ) : tasks && tasks.data.data.length > 0 ? (
        <div className='p-4'>
          <h3 className='font-bold text-lg'>Search Results</h3>
          <div className='grid grid-cols-5 gap-4 py-3 overflow-y-auto'>
            {tasks.data.data.map((task) => (
              <div key={task._id} className='flex gap-2 items-center'>
                <div className='flex-1 flex flex-col gap-1 bg-neutral p-2 rounded-lg'>
                  {/* using the conditional rendering to distinguish between different task statuses by color and border */}
                  <p
                    className={`text-sm  border-b-2  pb-1 ${
                      task.status === 'To Do'
                        ? 'text-blue-400 border-blue-500'
                        : task.status === 'In Progress'
                        ? 'text-yellow-400 border-yellow-500'
                        : 'text-green-400 border-green-500'
                    }`}
                  >
                    {task.status}
                  </p>
                  <p className='font-semibold capitalize mt-2'>{task.title}</p>
                  <p className='text-sm'>{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center h-full'>
          <span className='text-gray-500'>No results found</span>
        </div>
      )}
    </div>
  );
};
export default SearchResult;
