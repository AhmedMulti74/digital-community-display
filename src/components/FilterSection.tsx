
import { useState } from "react";
import { Music, Heart, Book, Users, Calendar, MessageCircle, DollarSign, Star } from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

type Language = {
  id: string;
  name: string;
  flag: string;
};

const categories: Category[] = [
  { id: "all", name: "الكل", icon: <Star className="w-4 h-4" /> },
  { id: "hobbies", name: "الهوايات", icon: <Heart className="w-4 h-4" /> },
  { id: "music", name: "الموسيقى", icon: <Music className="w-4 h-4" /> },
  { id: "money", name: "المال", icon: <DollarSign className="w-4 h-4" /> },
  { id: "spirituality", name: "الروحانية", icon: <Star className="w-4 h-4" /> },
  { id: "tech", name: "التكنولوجيا", icon: <Star className="w-4 h-4" /> },
  { id: "health", name: "الصحة", icon: <Heart className="w-4 h-4" /> },
  { id: "sports", name: "الرياضة", icon: <Star className="w-4 h-4" /> },
  { id: "self-improvement", name: "تطوير الذات", icon: <Star className="w-4 h-4" /> },
];

const languages: Language[] = [
  { id: "all", name: "الكل", flag: "🌐" },
  { id: "english", name: "الإنجليزية", flag: "🇺🇸" },
  { id: "arabic", name: "العربية", flag: "🇸🇦" },
  { id: "spanish", name: "الإسبانية", flag: "🇪🇸" },
  { id: "french", name: "الفرنسية", flag: "🇫🇷" },
  { id: "german", name: "الألمانية", flag: "🇩🇪" },
  { id: "chinese", name: "الصينية", flag: "🇨🇳" },
  { id: "japanese", name: "اليابانية", flag: "🇯🇵" },
  { id: "korean", name: "الكورية", flag: "🇰🇷" },
  { id: "russian", name: "الروسية", flag: "🇷🇺" },
];

const FilterSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLanguage, setActiveLanguage] = useState("all");

  return (
    <div className="w-full space-y-4">
      <div className="relative overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-item ${
                activeCategory === category.id
                  ? "filter-item-active"
                  : "filter-item-inactive"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-creator-background to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-creator-background to-transparent pointer-events-none"></div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
          {languages.map((language) => (
            <button
              key={language.id}
              className={`filter-item ${
                activeLanguage === language.id
                  ? "filter-item-active"
                  : "filter-item-inactive"
              }`}
              onClick={() => setActiveLanguage(language.id)}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-creator-background to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-creator-background to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default FilterSection;
