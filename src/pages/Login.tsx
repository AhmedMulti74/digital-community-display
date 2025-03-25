
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Login successful:", data);

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بعودتك إلى منصة CreatorHub",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error during login:", error);
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "تأكد من صحة البريد الإلكتروني وكلمة المرور",
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
            <h1 className="text-2xl font-bold mt-6 mb-2">تسجيل الدخول</h1>
            <p className="text-creator-textLight">
              أهلاً بعودتك! قم بتسجيل الدخول للوصول إلى مجتمعاتك المفضلة
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                البريد الإلكتروني
              </label>
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  كلمة المرور
                </label>
                <a href="#" className="text-xs text-creator-purple hover:underline">
                  نسيت كلمة المرور؟
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-creator-purple hover:bg-creator-lightpurple transition-colors"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-creator-textLight">
              ليس لديك حساب؟{" "}
              <Link to="/signup" className="text-creator-purple hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
