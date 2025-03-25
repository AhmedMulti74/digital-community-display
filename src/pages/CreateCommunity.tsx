
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import CommunityForm from "@/components/CommunityForm";

const CreateCommunity = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleSuccess = () => {
    navigate("/");
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
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-center">إنشاء مجتمع جديد</h1>
          <p className="text-gray-500 text-center mb-6">أنشئ مجتمعك الخاص وابدأ في استقطاب الأعضاء</p>
          
          <CommunityForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
