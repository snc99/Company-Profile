export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
        <div className="text-center text-lg font-medium text-blue-500 animate-pulse">
          Loading...
        </div>
        <div className="text-center text-sm text-gray-500">
          Please wait while we load the content.
        </div>
      </div>
    </div>
  );
}
