
import { Search } from "lucide-react";

const Hero = () => {
  return (
    <div className="w-full bg-creator-purple text-white p-8 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-300 text-2xl">★</span>
        <h1 className="text-3xl font-bold">مرحبًا بك في CreatorHub</h1>
      </div>
      
      <p className="text-lg mb-8 opacity-90">
        اكتشف مجتمعات مذهلة وتواصل مع المبدعين
      </p>
      
      <div className="relative w-full max-w-2xl">
        <input 
          type="text"
          placeholder="ابحث عن المجتمعات..."
          className="w-full py-3 px-10 rounded-full text-creator-text focus:outline-none focus:ring-2 focus:ring-white"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>
    </div>
  );
};

export default Hero;
