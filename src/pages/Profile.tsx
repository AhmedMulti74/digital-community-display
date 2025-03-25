
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    
    if (profile) {
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [user, profile, loading, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
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
          
          <div className="mb-8 flex flex-col items-center">
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-2 border-creator-purple group-hover:opacity-90 transition-all">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="الصورة الشخصية" />
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
            
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold">{profile?.full_name || "المستخدم"}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                placeholder="أدخل اسمك الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">لا يمكن تغيير البريد الإلكتروني</p>
            </div>
            
            <div className="flex justify-center mt-8">
              <Button 
                type="submit" 
                className="bg-creator-purple hover:bg-creator-lightpurple transition-colors w-full max-w-xs"
                disabled={updating}
              >
                {updating ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
