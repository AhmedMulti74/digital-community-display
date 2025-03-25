
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

export type Community = {
  id: string;
  title: string;
  image: string;
  language: string;
  members: number;
  price?: number | null;
  description: string;
  icon: React.ReactNode;
  category?: string;
  membership_fee: number;
};

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <Link to={`/community/${community.id}`} className="block hover:opacity-95 transition-opacity">
      <div className="community-card animate-fade-in">
        <div className="relative h-48 w-full">
          <img 
            src={community.image} 
            alt={community.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback image if the main one fails to load
              (e.target as HTMLImageElement).src = "/public/lovable-uploads/3b7bb45a-a281-4e2a-a79f-0a36f3bbb6d0.png";
            }}
          />
          <div className="language-badge">{community.language}</div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-creator-purple">{community.icon}</span>
            <h3 className="font-bold text-lg">{community.title}</h3>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-creator-textLight mb-3">
            <Users size={16} />
            <span>{community.members} عضو</span>
            <span className="mx-1">•</span>
            <span className="text-creator-purple">${community.membership_fee}/شهر</span>
          </div>
          
          <p className="text-sm text-creator-textLight mb-4 line-clamp-2">
            {community.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
