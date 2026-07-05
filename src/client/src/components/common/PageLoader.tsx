interface PageLoaderProps {
  message?: string;
}

export const PageLoader = ({ message }: PageLoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-400 animate-spin" />
          <img
            src="/logo.svg"
            alt="WalletUp"
            className="w-20 h-20 object-contain drop-shadow-lg"
          />
        </div>

        {message && (
          <p className="text-base font-medium text-white drop-shadow-lg">{message}</p>
        )}
      </div>
    </div>
  );
};
