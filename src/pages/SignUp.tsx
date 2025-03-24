
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتا المرور غير متطابقتين",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
          },
        },
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إنشاء الحساب",
          variant: "destructive",
        });
        return;
      }

      // Upload avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${authData.user.id}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            upsert: true,
          });

        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded avatar
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        // Update the user's profile with the avatar URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            avatar_url: publicUrlData.publicUrl,
            full_name: fullName,
            username
          })
          .eq('id', authData.user.id);
          
        if (updateError) throw updateError;
      }

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول إلى حسابك",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm animate-scale-in">
          <div className="text-center mb-8">
            <Link 
              to="/" 
              className="text-creator-purple text-3xl font-bold inline-block"
            >
              CreatorHub
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">إنشاء حساب جديد</h1>
            <p className="text-creator-textLight">
              انضم إلى مجتمعنا واكتشف مجتمعات المبدعين
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSignUp}>
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-2 border-creator-purple group-hover:opacity-90 transition-all">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="الصورة الشخصية" />
                    ) : (
                      <AvatarFallback className="bg-creator-purple text-white flex items-center justify-center">
                        <Upload className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">اختر صورة</span>
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
              <span className="text-sm text-creator-textLight">
                اختر صورة شخصية (اختياري)
              </span>
            </div>
            
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="block text-sm font-medium">
                الاسم الكامل
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="أدخل اسمك الكامل"
                className="w-full"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="block text-sm font-medium">
                اسم المستخدم
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm font-medium">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="block text-sm font-medium">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="block text-sm font-medium">
                تأكيد كلمة المرور
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                className="w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-creator-purple hover:bg-creator-lightpurple transition-colors"
              disabled={loading}
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-creator-textLight">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-creator-purple hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
