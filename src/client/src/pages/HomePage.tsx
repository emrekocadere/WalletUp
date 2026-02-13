import { Header } from '../components/home/Header';
import { Hero } from '../components/home/Hero';
import { CTASection } from '../components/home/CTASection';
import { Footer } from '../components/home/Footer';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="https://www.freeiconspng.com/uploads/euro-icon-24.png"
          alt=""
          aria-hidden="true"
          className="absolute top-16 -left-6 md:left-6 w-72 md:w-[420px] lg:w-[500px] opacity-25 blur-lg select-none"
          draggable={false}
        />
        <img
          src="https://www.freeiconspng.com/uploads/dollar-green-icon-5.png"
          alt=""
          aria-hidden="true"
          className="absolute top-44 -right-8 md:right-8 w-80 md:w-[460px] lg:w-[540px] opacity-25 blur-lg select-none"
          draggable={false}
        />
        <img
          src="/yen.png"
          alt=""
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-[320px] lg:w-[380px] opacity-20 blur-md select-none"
          draggable={false}
        />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-25"></div>

      <Header />
      <Hero />
 
      <CTASection />
      <Footer />
    </div>
  );
};
