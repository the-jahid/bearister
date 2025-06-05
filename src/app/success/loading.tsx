export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C0C1C] to-black text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl sm:text-2xl font-bold">Loading...</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">Please wait</p>
      </div>
    </div>
  )
}
