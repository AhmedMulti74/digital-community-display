
import { Users } from "lucide-react";

export type Community = {
  id: string;
  title: string;
  image: string;
  language: string;
  members: number;
  price?: number;
  description: string;
  icon: React.ReactNode;
};

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <div className="community-card animate-fade-in">
      <div className="relative h-48 w-full">
        <img 
          src={community.image} 
          alt={community.title}
          className="h-full w-full object-cover"
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
          {community.price && (
            <>
              <span className="mx-1">•</span>
              <span className="text-creator-purple">${community.price}/شهر</span>
            </>
          )}
        </div>
        
        <p className="text-sm text-creator-textLight mb-4">
          {community.description}
        </p>
      </div>
    </div>
  );
};

export default CommunityCard;
