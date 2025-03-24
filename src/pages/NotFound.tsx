
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-warm-yellow/20 px-4">
      <div className="text-center max-w-md glass rounded-2xl p-8 shadow-lg border border-white/50 animate-scale-in">
        <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
        <p className="text-xl text-gray-700 mb-6">We couldn't find the page you're looking for</p>
        
        <div className="w-16 h-1 bg-primary/20 mx-auto my-6 rounded-full"></div>
        
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-primary text-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:translate-y-[-2px] active:translate-y-0"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
