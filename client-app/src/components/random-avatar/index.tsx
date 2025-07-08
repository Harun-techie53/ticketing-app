"use client";

import React, { useEffect, useState } from "react";

const getRandomAvatarUrl = (username?: string) => {
  const seed = !!username
    ? username
    : Math.random().toString(36).substring(2, 10);
  return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`;
};

export const RandomAvatar = ({ size = "w-8" }: { size?: string }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;
  const username = `${user?.firstName} ${user?.lastName}`;

  useEffect(() => {
    // Run only on the client
    setAvatarUrl(getRandomAvatarUrl(username));
  }, []);

  if (!avatarUrl) return null; // or a spinner/placeholder

  return (
    <div className="avatar">
      <div
        className={`
          rounded-full 
          ${size}
          ring ring-primary ring-offset-2 ring-offset-base-100 
          transition-all duration-300 ease-in-out 
          hover:scale-110 
          hover:ring-secondary
          cursor-pointer
        `}
      >
        <img src={avatarUrl} alt="Random avatar" />
      </div>
    </div>
  );
};
