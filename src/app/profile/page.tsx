import { Metadata } from "next";

import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "KGLOTO | Профиль",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-24">
      <div className="max-w-200 mx-auto">
        <ProfileClient />
      </div>
    </div>
  );
}
