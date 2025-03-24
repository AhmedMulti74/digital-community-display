
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-sm z-10">
      <Link 
        to="/" 
        className="text-creator-purple text-2xl font-bold transition-all duration-300 hover:opacity-90"
      >
        CreatorHub
      </Link>
      
      <div className="flex items-center gap-4">
        <Link 
          to="/login" 
          className="text-creator-text hover:text-creator-purple transition-colors"
        >
          تسجيل الدخول
        </Link>
        
        <Button
          className="bg-creator-purple text-white hover:bg-creator-lightpurple transition-colors"
        >
          إنشاء حساب
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
