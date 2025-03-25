
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ProfileFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  email: string | undefined;
  onSubmit: (e: React.FormEvent) => void;
  updating: boolean;
}

const ProfileForm = ({ 
  fullName, 
  setFullName, 
  username, 
  setUsername, 
  email, 
  onSubmit, 
  updating 
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          value={email || ""}
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
  );
};

export default ProfileForm;
