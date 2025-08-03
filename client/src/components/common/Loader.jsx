export const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
};


