
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileForm from "@/components/profile/ProfileForm";

const Profile = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    
    if (profile) {
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
    }
  }, [user, profile, loading, navigate]);

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "غير مسجل الدخول",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUpdating(true);
      
      // Prepare update object
      const updates = {
        id: user.id,
        full_name: fullName,
        username: username,
        updated_at: new Date().toISOString(),
      };
      
      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Check if avatars bucket exists and create it if it doesn't
        try {
          // Try to get bucket information to see if it exists
          const { error } = await supabase.storage.getBucket('avatars');
          
          if (error && error.message.includes('does not exist')) {
            // Bucket doesn't exist, create it
            const { error: createError } = await supabase.storage.createBucket('avatars', {
              public: true,
              fileSizeLimit: 5242880, // 5MB
            });
            
            if (createError) {
              console.error('Error creating avatars bucket:', createError);
              throw createError;
            }
            
            // Removed the setPublic call as it's not available in the current SDK version
          }
        } catch (bucketError) {
          console.error('Error handling avatars bucket:', bucketError);
        }
        
        // Upload the avatar
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            upsert: true,
          });

        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        // Add avatar URL to updates
        Object.assign(updates, { avatar_url: publicUrlData.publicUrl });
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Refresh profile in context
      await refreshProfile();
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم تحديث بيانات الملف الشخصي بنجاح",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: error.message || "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">الملف الشخصي</h1>
          
          <ProfileAvatar 
            avatarUrl={profile?.avatar_url || null} 
            onAvatarChange={handleAvatarChange} 
          />
          
          <ProfileInfo 
            fullName={profile?.full_name || ""} 
            email={user?.email} 
          />
          
          <ProfileForm 
            fullName={fullName}
            setFullName={setFullName}
            username={username}
            setUsername={setUsername}
            email={user?.email}
            onSubmit={handleSubmit}
            updating={updating}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
