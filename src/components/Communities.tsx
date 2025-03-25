
import { useState, useEffect } from "react";
import CommunityCard, { Community } from "./CommunityCard";
import { Music, Monitor, Heart, Briefcase, Users, Calendar, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Communities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const communitiesPerPage = 6;

  // These states will be controlled by the FilterSection component
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLanguage, setActiveLanguage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const getIconForCategory = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case "music":
        return <Music className="w-5 h-5" />;
      case "tech":
        return <Monitor className="w-5 h-5" />;
      case "health":
        return <Heart className="w-5 h-5" />;
      case "business":
        return <Briefcase className="w-5 h-5" />;
      case "sports":
        return <Users className="w-5 h-5" />;
      case "spirituality":
        return <Calendar className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  // Fetch communities from Supabase
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("communities")
          .select("*");

        if (error) {
          throw error;
        }

        // Transform data to match Community type
        const transformedData: Community[] = data.map(item => ({
          id: item.id,
          title: item.name,
          image: item.banner_url || "/public/lovable-uploads/3b7bb45a-a281-4e2a-a79f-0a36f3bbb6d0.png", // Fallback image
          language: (item.language || "ENGLISH").toUpperCase(),
          members: 0, // We'll update this with actual count
          price: null,
          description: item.description || "No description available",
          icon: getIconForCategory(item.category),
          category: item.category || "general",
          membership_fee: item.membership_fee || 5 // Default to 5 if not set
        }));

        // Get member counts for each community
        for (const community of transformedData) {
          const { count } = await supabase
            .from("community_members")
            .select("*", { count: "exact", head: true })
            .eq("community_id", community.id);
          
          community.members = count || 0;
        }

        setCommunities(transformedData);
        setFilteredCommunities(transformedData);
      } catch (error) {
        console.error("Error fetching communities:", error);
        setError("Failed to load communities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    let result = [...communities];
    
    // Apply category filter
    if (activeCategory !== "all") {
      result = result.filter(
        community => community.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Apply language filter
    if (activeLanguage !== "all") {
      result = result.filter(
        community => community.language.toLowerCase() === activeLanguage.toUpperCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        community => 
          community.title.toLowerCase().includes(query) || 
          community.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredCommunities(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeCategory, activeLanguage, searchQuery, communities]);

  // Expose filter methods for FilterSection to use
  window.communityFilters = {
    setCategory: setActiveCategory,
    setLanguage: setActiveLanguage,
    setSearchQuery: setSearchQuery
  };
  
  // Pagination logic
  const indexOfLastCommunity = currentPage * communitiesPerPage;
  const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage;
  const currentCommunities = filteredCommunities.slice(indexOfFirstCommunity, indexOfLastCommunity);
  const totalPages = Math.ceil(filteredCommunities.length / communitiesPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <Loader className="animate-spin text-creator-purple" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-creator-purple text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredCommunities.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-creator-textLight text-lg">لا توجد مجتمعات تطابق معايير البحث الخاصة بك</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCommunities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 gap-2">
          <button
            className="pagination-button pagination-inactive"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`pagination-button ${
                currentPage === index + 1 ? "pagination-active" : "pagination-inactive"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            className="pagination-button pagination-inactive"
            onClick={() => 
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Communities;
