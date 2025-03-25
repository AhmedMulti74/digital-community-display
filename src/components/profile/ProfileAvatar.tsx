
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, User } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  onAvatarChange: (file: File) => void;
}

const ProfileAvatar = ({ avatarUrl, onAvatarChange }: ProfileAvatarProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (avatarUrl) {
      // Set the avatar URL directly
      setAvatarPreview(avatarUrl);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [avatarUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onAvatarChange(file);
      
      // Create a local preview
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="mb-8 flex flex-col items-center">
      <Label htmlFor="avatar" className="cursor-pointer">
        <div className="relative group">
          <Avatar className="w-32 h-32 border-2 border-creator-purple group-hover:opacity-90 transition-all">
            {!isLoading && avatarPreview ? (
              <AvatarImage 
                src={avatarPreview} 
                alt="الصورة الشخصية" 
                onError={() => console.error("Failed to load avatar image")}
              />
            ) : (
              <AvatarFallback className="bg-creator-purple text-white flex items-center justify-center">
                <User className="h-12 w-12" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="h-6 w-6 text-white" />
          </div>
        </div>
      </Label>
      <Input
        id="avatar"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
    </div>
  );
};

export default ProfileAvatar;
