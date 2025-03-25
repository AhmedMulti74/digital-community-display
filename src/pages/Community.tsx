
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { MessageSquare, BookOpen, Calendar, Users, Activity, Info } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const CommunityPage = () => {
  const { id, tab = "about" } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      if (id) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('communities')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching community:', error);
            setError(error.message);
            return;
          }

          console.log("Community data:", data);
          setCommunity(data);
        } catch (error) {
          console.error('Failed to fetch community details:', error);
          setError('Failed to fetch community details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCommunity();
  }, [id]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (id) {
        try {
          const { data: membersData, error: membersError } = await supabase
            .from('community_members')
            .select('*')
            .eq('community_id', id);

          if (membersError) {
            console.error('Error fetching members:', membersError);
            return;
          }

          console.log("Members data:", membersData);
          setMembers(membersData || []);

          // Get unique user IDs
          const userIds = [...new Set(membersData.map(member => member.user_id))];
          
          // Fetch profiles for all members
          if (userIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('*')
              .in('id', userIds);

            if (profilesError) {
              console.error('Error fetching profiles:', profilesError);
              return;
            }

            console.log("Profiles data:", profilesData);
            // Create a map of profiles by user ID for easy lookup
            const profilesMap = {};
            profilesData?.forEach(profile => {
              profilesMap[profile.id] = profile;
            });
            
            setProfiles(profilesMap);
          }
        } catch (error) {
          console.error('Failed to fetch members:', error);
        }
      }
    };

    fetchMembers();
  }, [id]);

  const handleTabChange = (value) => {
    navigate(`/community/${id}/${value}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-10 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">خطأ</h2>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">لم يتم العثور على المجتمع</h2>
          <p className="text-muted-foreground">لا يمكن العثور على بيانات هذا المجتمع</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-between mb-8 overflow-x-auto flex-nowrap">
            <TabsTrigger value="forum" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>المنتدى</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>الدورات</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>التقويم</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>الأعضاء</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>لوحة التقدم</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>عن المجتمع</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forum" className="mt-6">
            <ForumSection />
          </TabsContent>
          
          <TabsContent value="courses" className="mt-6">
            <CoursesSection />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <CalendarSection />
          </TabsContent>
          
          <TabsContent value="members" className="mt-6">
            <MembersSection members={members} profiles={profiles} />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-6">
            <ProgressSection />
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <AboutSection community={community} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ForumSection = () => (
  <div className="bg-card p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">منتدى المجتمع</h2>
    <p className="text-muted-foreground">
      هنا يمكن للأعضاء التفاعل ومناقشة المواضيع المختلفة واستعراض الأفكار.
    </p>
    <div className="mt-4 grid gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border p-4 rounded-md">
          <h3 className="font-medium">عنوان الموضوع #{i}</h3>
          <p className="text-sm text-muted-foreground">بواسطة: مستخدم {i}</p>
          <div className="mt-2">
            <p>محتوى المنشور يظهر هنا ويمكن أن يحتوي على نصوص أو صور أو فيديوهات.</p>
          </div>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>{i * 5} تعليقات</span>
            <span className="mx-2">•</span>
            <span>قبل {i} ساعات</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CoursesSection = () => (
  <div className="bg-card p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">الدورات التدريبية</h2>
    <p className="text-muted-foreground">
      استكشف الدورات التدريبية المتاحة وتعلم مهارات جديدة للتطوير الشخصي والمهني.
    </p>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border rounded-md overflow-hidden">
          <div className="bg-muted h-40 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="p-4">
            <h3 className="font-medium">دورة تطويرية #{i}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              وصف مختصر للدورة ومحتواها وما سيتعلمه المتدرب فيها.
            </p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm">{5 * i} درس</span>
              <button className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded">
                ابدأ الآن
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CalendarSection = () => (
  <div className="bg-card p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">تقويم الفعاليات</h2>
    <p className="text-muted-foreground">
      تابع الفعاليات والأحداث القادمة في المجتمع وكن جزءاً منها.
    </p>
    <div className="mt-6 border rounded-lg">
      <div className="grid grid-cols-7 text-center py-2 border-b">
        {["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"].map((day) => (
          <div key={day} className="font-medium">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 gap-y-2 p-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <div 
            key={index} 
            className={`aspect-square flex flex-col items-center justify-start p-1 rounded-md ${
              index % 7 === 0 || index % 7 === 6 ? 'bg-muted/50' : ''
            } ${index === 14 || index === 22 ? 'border-2 border-primary' : ''}`}
          >
            <span className="text-sm">{index - 3 > 0 && index - 3 < 31 ? index - 3 : ''}</span>
            {index === 14 && <div className="w-full mt-1 text-[10px] p-[2px] bg-blue-100 text-blue-800 rounded">ورشة عمل</div>}
            {index === 22 && <div className="w-full mt-1 text-[10px] p-[2px] bg-green-100 text-green-800 rounded">محاضرة</div>}
          </div>
        ))}
      </div>
    </div>
    <div className="mt-4">
      <h3 className="font-medium mb-2">الفعاليات القادمة</h3>
      <div className="space-y-2">
        <div className="border p-3 rounded-md flex justify-between items-center">
          <div>
            <h4 className="font-medium">ورشة عمل تطوير المهارات</h4>
            <p className="text-sm text-muted-foreground">15 سبتمبر، 6:00 مساءً</p>
          </div>
          <button className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded">
            سجل الآن
          </button>
        </div>
        <div className="border p-3 rounded-md flex justify-between items-center">
          <div>
            <h4 className="font-medium">محاضرة حول ريادة الأعمال</h4>
            <p className="text-sm text-muted-foreground">23 سبتمبر، 7:30 مساءً</p>
          </div>
          <button className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded">
            سجل الآن
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MembersSection = ({ members, profiles }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">أعضاء المجتمع</h2>
      <p className="text-muted-foreground mb-4">
        تعرف على أعضاء المجتمع وتواصل معهم لبناء شبكة علاقات قوية.
      </p>
      
      {members.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا يوجد أعضاء في هذا المجتمع حتى الآن.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map((member) => {
            const profile = profiles[member.user_id] || {};
            return (
              <div key={member.id} className="border rounded-md p-4 flex flex-col items-center">
                <Avatar className="w-16 h-16 mb-2">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.username || 'عضو'} />
                  ) : (
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {profile.username?.charAt(0) || profile.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="font-medium text-center">{profile.full_name || profile.username || 'عضو'}</h3>
                <div className="mt-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  {member.role === 'creator' ? 'مالك المجتمع' : 'عضو'}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  عضو منذ {new Date(member.joined_at).toLocaleDateString('ar-EG')}
                </p>
                <button className="mt-3 text-sm bg-primary text-primary-foreground px-3 py-1 rounded w-full">
                  تواصل
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProgressSection = () => (
  <div className="bg-card p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">لوحة التقدم</h2>
    <p className="text-muted-foreground">
      تابع تقدمك وإنجازاتك في المجتمع واحصل على تحفيز لتحقيق المزيد.
    </p>
    <div className="mt-6 grid gap-4">
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">تقدم الدورات</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>تطوير تطبيقات الويب</span>
              <span>75%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div className="h-full w-3/4 bg-primary rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>تصميم واجهات المستخدم</span>
              <span>40%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div className="h-full w-2/5 bg-primary rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>إدارة المشاريع</span>
              <span>90%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div className="h-full w-[90%] bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">الإنجازات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["إكمال أول دورة", "المساهمة في المنتدى", "حضور 5 فعاليات", "التواصل مع 10 أعضاء"].map((achievement, index) => (
            <div key={index} className="border rounded-md p-2 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-1">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm">{achievement}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">المستوى الحالي</h3>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-xl font-bold text-primary">
            5
          </div>
          <div className="ml-4 flex-1">
            <h4 className="font-medium">متقدم</h4>
            <p className="text-sm text-muted-foreground">2000 / 3000 نقطة للمستوى التالي</p>
            <div className="h-2 bg-muted rounded-full mt-1">
              <div className="h-full w-2/3 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AboutSection = ({ community }) => {
  if (!community) return <div>جاري التحميل...</div>;

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">عن المجتمع</h2>
      <div className="space-y-6">
        {community.banner_url && (
          <div className="w-full h-48 overflow-hidden rounded-lg mb-6">
            <img 
              src={community.banner_url} 
              alt={community.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/lovable-uploads/3b7bb45a-a281-4e2a-a79f-0a36f3bbb6d0.png";
              }}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {community.logo_url && (
            <img 
              src={community.logo_url} 
              alt={community.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/lovable-uploads/3b7bb45a-a281-4e2a-a79f-0a36f3bbb6d0.png";
              }}
            />
          )}
          <div>
            <h3 className="text-xl font-semibold">{community.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                {community.language || 'العربية'}
              </span>
              <span>•</span>
              <span>${community.membership_fee}/شهر</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">الوصف</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {community.description || 'لا يوجد وصف للمجتمع.'}
          </p>
        </div>
        
        {community.rules && (
          <div>
            <h3 className="text-lg font-semibold mb-2">قواعد المجتمع</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {community.rules}
            </p>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold mb-2">تفاصيل إضافية</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>الفئة: <span className="text-foreground">{community.category || 'غير محدد'}</span></li>
            <li>الحد الأقصى للأعضاء: <span className="text-foreground">{community.max_members || 'غير محدد'}</span></li>
            <li>تاريخ الإنشاء: <span className="text-foreground">{new Date(community.created_at).toLocaleDateString('ar-EG')}</span></li>
          </ul>
        </div>
        
        {community.video_embed && (
          <div>
            <h3 className="text-lg font-semibold mb-2">فيديو تعريفي</h3>
            <div className="aspect-video rounded-lg overflow-hidden" 
                 dangerouslySetInnerHTML={{ __html: community.video_embed }} />
          </div>
        )}
        
        <div className="pt-4">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
            انضم الآن - ${community.membership_fee}/شهر
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
