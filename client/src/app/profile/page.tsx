"use client";

import { apiGet } from "@/helpers/axios/config";
import { utils } from "@/helpers/utils";
import { User } from "@/types";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const user = await apiGet<User>({
        apiPath: "/api/users/currentUser",
        withCredentials: true,
      });

      setUser(user);
    } catch (error) {
      console.log("Error fetching user: ", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {user && (
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user.firstName}${user.lastName}`}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-primary">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-base-content/70">{user.email}</p>
                <div className="mt-2 badge badge-secondary capitalize">
                  {user.role}
                </div>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="divider" />
            <div className="grid grid-cols-2 gap-4 text-sm text-base-content/80">
              <div>
                <span className="font-semibold">User ID</span>
                <p className="break-all">{user.id}</p>
              </div>
              <div>
                <span className="font-semibold">Joined At</span>
                <p>{utils.formatDateWithOrdinal(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
