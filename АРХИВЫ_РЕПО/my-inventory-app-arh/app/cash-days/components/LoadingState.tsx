// app/cash-days/components/LoadingState.tsx
export default function LoadingState() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}