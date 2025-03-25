
import { Separator } from "@/components/ui/separator";

interface ProfileInfoProps {
  fullName: string;
  email: string | undefined;
}

const ProfileInfo = ({ fullName, email }: ProfileInfoProps) => {
  return (
    <div className="mt-4 text-center">
      <h2 className="text-xl font-semibold">{fullName || "المستخدم"}</h2>
      <p className="text-gray-500">{email}</p>
      <Separator className="my-6" />
    </div>
  );
};

export default ProfileInfo;
