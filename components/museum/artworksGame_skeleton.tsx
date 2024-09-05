export default function ArtworksGameSkeleton() {
  return (
    <div className="p-4 max-w-lg mx-auto text-sm space-x-4">
      <div className="flex space-x-8 mb-4">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-zinc-300 border border-zinc-600 rounded-xl"></div>
          <span className="mt-2 text-gray-600">Loading...</span>
        </div>
        <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-zinc-300 border border-zinc-600 rounded-xl"></div>
        <span className="mt-2 text-gray-600">Loading...</span>
        </div>
        <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-zinc-300 border border-zinc-600 rounded-xl"></div>
        <span className="mt-2 text-gray-600">Loading...</span>
        </div>
      </div>
    </div>
  );
}