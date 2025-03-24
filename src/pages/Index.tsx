
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterSection from "@/components/FilterSection";
import Communities from "@/components/Communities";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="space-y-8">
          <Hero />
          
          <FilterSection />
          
          <Communities />
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-creator-textLight">
        <p>© {new Date().getFullYear()} CreatorHub. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default Index;
