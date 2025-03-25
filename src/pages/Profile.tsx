
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("يجب اختيار صورة");
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم تحديث صورة الملف الشخصي",
      });
    } catch (error) {
      toast({
        title: "خطأ في رفع الصورة",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
      console.error("Error uploading avatar:", error);
    } finally {
      setUploading(false);
    }
  }
  
  async function updateProfile() {
    try {
      setSaving(true);
      
      if (!user) throw new Error("يجب تسجيل الدخول");
      
      const updates = {
        id: user.id,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-creator-purple" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h1 className="text-2xl font-bold text-creator-text text-right">الملف الشخصي</h1>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-creator-purple">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={fullName || "صورة المستخدم"} />
                ) : (
                  <AvatarFallback className="bg-creator-purple text-white text-xl">
                    {fullName?.charAt(0) || username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-creator-purple text-white p-1.5 rounded-full cursor-pointer hover:bg-creator-lightpurple transition-colors"
              >
                <Camera size={16} />
                <span className="sr-only">تغيير الصورة</span>
              </label>
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
                disabled={uploading}
              />
            </div>
            {uploading && <p className="text-sm text-gray-500">جاري رفع الصورة...</p>}
          </div>
          
          <div className="space-y-4 text-right">
            <div className="space-y-2">
              <Label htmlFor="email" className="block">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ""} 
                disabled 
                className="text-right bg-gray-50"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName" className="block">الاسم الكامل</Label>
              <Input 
                id="fullName" 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="أدخل اسمك الكامل"
                className="text-right"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="block">اسم المستخدم</Label>
              <Input 
                id="username" 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="text-right"
                dir="rtl"
              />
            </div>
            
            <Button 
              onClick={updateProfile} 
              className="w-full bg-creator-purple hover:bg-creator-lightpurple transition-colors mt-4"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
