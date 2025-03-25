
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const params = useParams();
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      if (params.id) {
        try {
          console.log("Fetching community for navbar with ID:", params.id);
          const { data, error } = await supabase
            .from('communities')
            .select('*')
            .eq('id', params.id)
            .single();

          if (error) {
            console.error('Error fetching community for navbar:', error);
            return;
          }

          console.log("Community data in navbar:", data);
          setCommunity(data);
        } catch (error) {
          console.error('Failed to fetch community details for navbar:', error);
        }
      } else {
        setCommunity(null);
      }
    };

    fetchCommunity();
  }, [params.id]);

  const handleSignOut = async () => {
    try {
      console.log("Handling sign out in Navbar");
      await signOut();
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل الخروج بنجاح",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-sm z-10">
      {community ? (
        <Link 
          to={`/community/${community.id}`} 
          className="flex items-center gap-3 text-creator-purple text-xl font-bold transition-all duration-300 hover:opacity-90"
        >
          {community.logo_url ? (
            <img 
              src={community.logo_url} 
              alt={community.name} 
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/lovable-uploads/3b7bb45a-a281-4e2a-a79f-0a36f3bbb6d0.png";
              }}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-creator-purple flex items-center justify-center text-white">
              {community.name.charAt(0)}
            </div>
          )}
          <span>{community.name}</span>
        </Link>
      ) : (
        <Link 
          to="/" 
          className="text-creator-purple text-2xl font-bold transition-all duration-300 hover:opacity-90"
        >
          CreatorHub
        </Link>
      )}
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Button
              className="bg-creator-purple text-white hover:bg-creator-lightpurple transition-colors flex items-center gap-2"
              onClick={() => navigate("/create-community")}
            >
              <Plus size={18} />
              <span>إنشاء مجتمع</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.username || user.email} />
                    ) : (
                      <AvatarFallback className="bg-creator-purple text-white">
                        {profile?.username?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.full_name || 'المستخدم'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-creator-text hover:text-creator-purple transition-colors"
            >
              تسجيل الدخول
            </Link>
            
            <Button
              className="bg-creator-purple text-white hover:bg-creator-lightpurple transition-colors"
              asChild
            >
              <Link to="/signup">إنشاء حساب</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
