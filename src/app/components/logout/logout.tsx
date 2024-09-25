import React from "react";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    console.log("Logout successful");
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 bg-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;