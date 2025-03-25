
import { useState } from "react";
import CommunityCard, { Community } from "./CommunityCard";
import { Music, Monitor, Heart, Briefcase, Users, Calendar } from "lucide-react";

const communitiesData: Community[] = [
  {
    id: "1",
    title: "عشاق الموسيقى",
    image: "/public/lovable-uploads/3b7bb45a-a281-4e2a-a79f-0a36f3bbb6d0.png",
    language: "ENGLISH",
    members: 345,
    price: 9.99,
    description: "تواصل مع عشاق الموسيقى وشارك مساراتك المفضلة",
    icon: <Music className="w-5 h-5" />,
  },
  {
    id: "2",
    title: "مبتكرو التقنية",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    language: "ENGLISH",
    members: 892,
    price: 19.99,
    description: "ناقش أحدث الاتجاهات في التكنولوجيا والابتكار",
    icon: <Monitor className="w-5 h-5" />,
  },
  {
    id: "3",
    title: "محور اللياقة",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    language: "ARABIC",
    members: 1204,
    description: "شارك روتين التمارين ونصائح الحياة الصحية",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    id: "4",
    title: "مؤسسو الشركات الناشئة",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    language: "ENGLISH",
    members: 567,
    description: "تواصل مع رواد الأعمال وناقش استراتيجيات الأعمال",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    id: "5",
    title: "اليقظة الذهنية",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    language: "ARABIC",
    members: 723,
    description: "استكشف التأمل وتقنيات النمو الروحي",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    id: "6",
    title: "مشجعو الرياضة",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    language: "ENGLISH",
    members: 1555,
    description: "ناقش فرقك المفضلة والأحداث الرياضية",
    icon: <Users className="w-5 h-5" />,
  },
];

const Communities = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const communitiesPerPage = 6;
  
  // Pagination logic
  const indexOfLastCommunity = currentPage * communitiesPerPage;
  const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage;
  const currentCommunities = communitiesData.slice(indexOfFirstCommunity, indexOfLastCommunity);
  const totalPages = Math.ceil(communitiesData.length / communitiesPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
