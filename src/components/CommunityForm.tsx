
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  "رياضة",
  "ألعاب",
  "تكنولوجيا",
  "فن",
  "موسيقى",
  "سفر",
  "طعام",
  "تعليم",
  "أعمال",
  "ترفيه",
  "أخرى"
];

const languages = [
  "العربية",
  "الإنجليزية",
  "الفرنسية",
  "الإسبانية",
  "الألمانية",
  "أخرى"
];

interface CommunityFormProps {
  onSuccess?: () => void;
}

const CommunityForm = ({ onSuccess }: CommunityFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [rules, setRules] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [videoEmbed, setVideoEmbed] = useState("");
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('community-images')
      .upload(filePath, file, {
        upsert: true,
      });
      
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('community-images')
      .getPublicUrl(filePath);
      
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "غير مسجل الدخول",
        description: "يجب تسجيل الدخول أولاً لإنشاء مجتمع",
        variant: "destructive",
      });
      return;
    }
    
    if (!name) {
      toast({
        title: "خطأ في النموذج",
        description: "اسم المجتمع مطلوب",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload logo and banner if provided
      let logoUrl = null;
      let bannerUrl = null;
      
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, 'logo');
      }
      
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banner');
      }
      
      // Create community record
      const { data, error } = await supabase
        .from('communities')
        .insert({
          creator_id: user.id,
          name,
          description,
          logo_url: logoUrl,
          banner_url: bannerUrl,
          video_embed: videoEmbed,
          category,
          language,
          rules,
          max_members: maxMembers ? parseInt(maxMembers) : null,
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "تم إنشاء المجتمع",
        description: `تم إنشاء المجتمع "${name}" بنجاح!`,
      });
      
      // Reset form
      setName("");
      setDescription("");
      setCategory("");
      setLanguage("");
      setRules("");
      setMaxMembers("");
      setVideoEmbed("");
      setLogoFile(null);
      setLogoPreview(null);
      setBannerFile(null);
      setBannerPreview(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating community:", error);
      toast({
        title: "خطأ في إنشاء المجتمع",
        description: error.message || "حدث خطأ أثناء إنشاء المجتمع",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">اسم المجتمع*</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسم المجتمع"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">وصف المجتمع</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="أدخل وصفاً للمجتمع..."
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>شعار المجتمع (اللوغو)</Label>
            <div 
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => logoInputRef.current?.click()}
            >
              {logoPreview ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 rounded-lg transition-opacity">
                    <Upload className="text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">اضغط لإضافة شعار للمجتمع</p>
                  <p className="text-xs text-gray-400">يفضل صورة مربعة</p>
                </div>
              )}
              <Input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">فئة المجتمع</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="اختر فئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxMembers">عدد المقاعد المتاحة</Label>
            <Input
              id="maxMembers"
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              placeholder="غير محدود"
              min="1"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>صورة غلاف المجتمع</Label>
            <div 
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerPreview ? (
                <div className="relative w-full h-32 mx-auto">
                  <img 
                    src={bannerPreview} 
                    alt="Banner preview" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 rounded-lg transition-opacity">
                    <Upload className="text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">اضغط لإضافة صورة غلاف</p>
                  <p className="text-xs text-gray-400">يفضل صورة بنسبة عرض 3:1</p>
                </div>
              )}
              <Input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">لغة المجتمع</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="اختر لغة" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="videoEmbed">فيديو (رمز HTML)</Label>
        <Textarea
          id="videoEmbed"
          value={videoEmbed}
          onChange={(e) => setVideoEmbed(e.target.value)}
          placeholder='<iframe src="https://www.youtube.com/embed/example"></iframe>'
          rows={3}
        />
        <p className="text-xs text-gray-500">أدخل رمز HTML لتضمين فيديو من YouTube أو مصادر أخرى</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rules">قواعد المجتمع</Label>
        <Textarea
          id="rules"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="أدخل قواعد المجتمع..."
          rows={5}
        />
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-creator-purple hover:bg-creator-lightpurple"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جارٍ الإنشاء..." : "إنشاء المجتمع"}
        </Button>
      </div>
    </form>
  );
};

export default CommunityForm;
