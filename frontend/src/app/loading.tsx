export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center relative overflow-hidden">
      {/* Optional blurred background elements for aesthetic */}
      <div className="absolute w-72 h-72 bg-pink-500 opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
      <div className="absolute w-72 h-72 bg-indigo-500 opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Gradient Spinner */}
        <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-white animate-spin bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 bg-[length:400%_400%] shadow-xl">
          <div className="w-full h-full bg-[#0a0b14] rounded-full m-1"></div>
        </div>

        {/* Floating Glowing Dot */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_2px_rgba(255,255,255,0.8)] animate-ping" />

        {/* Animated Loading Text */}
        <p className="text-white text-sm font-semibold tracking-widest animate-[pulse_2s_infinite]">
          Loading<span className="animate-bounce inline-block ml-1">.</span>
          <span className="animate-bounce inline-block ml-1 delay-200">.</span>
          <span className="animate-bounce inline-block ml-1 delay-400">.</span>
        </p>
      </div>
    </div>
  );
}
