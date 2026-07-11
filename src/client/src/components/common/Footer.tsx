export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6 py-6 px-4 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
        <p>{currentYear} WalletUp · Developed by Salih Emre Kocadere</p>
        <a href="#" className="hover:text-gray-400 transition-colors">GitHub</a>
      </div>
    </footer>
  );
};
