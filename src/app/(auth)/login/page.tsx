"use client";
import "@ant-design/v5-patch-for-react-19";
import React from "react";
import Image from "next/image";
import LoginForm from "./_components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-1/2 relative p-8">
          <Image
            src="/aset_login.jpg"
            alt="Happy family"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex-1 lg:w-1/2 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
