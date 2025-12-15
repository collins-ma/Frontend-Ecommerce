import React, { useState, useMemo } from "react";
import { useGetUsersQuery } from "../features/users/usersApiSlice";
import { Link } from "react-router-dom";

export default function UsersList() {
  const { data: usersData, isLoading, isError, error } = useGetUsersQuery(
    "usersList",
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const users = usersData?.entities ? Object.values(usersData.entities) : [];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase()));

      const matchesRole =
        filterRole === "" ||
        (Array.isArray(user.roles) && user.roles.includes(filterRole));

      return matchesSearch && matchesRole;
    });
  }, [users, search, filterRole]);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-lg font-semibold text-gray-600 dark:text-gray-300">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Failed to load users: {error?.data?.message || "Unknown error"}
      </div>
    );
  }

  const roles = Array.from(
    new Set(users.flatMap((u) => (Array.isArray(u.roles) ? u.roles : [])))
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">
        Users Management
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full sm:w-1/4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id || user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                    {user.username}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {user.email && user.email.trim() ? (
                      user.email
                    ) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        No email
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {Array.isArray(user.roles) && user.roles.length > 0
                      ? user.roles.map((role, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-semibold mr-1"
                          >
                            {role}
                          </span>
                        ))
                      : (
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs italic">
                          No roles
                        </span>
                      )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/users/${user._id}`}
                      className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-semibold transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-gray-500 italic dark:text-gray-400"
                >
                  No users match your search/filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
