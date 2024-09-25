import React from "react";
import { useRouter } from "next/navigation";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userCargo');
    console.log("Logout successful");
    router.push('/pages/cargo');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;