import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery, useDeleteUserMutation } from "../features/users/usersApiSlice";
import { FiTrash2 } from "react-icons/fi";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, isError, error } = useGetUserByIdQuery(userId);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [showModal, setShowModal] = useState(false);

  if (isLoading)
    return <div className="p-6 text-center text-gray-600 font-semibold">Loading user info...</div>;

  if (isError)
    return <div className="p-6 text-center text-red-500 font-semibold">Failed to load user: {error?.data?.message || "Unknown error"}</div>;

  if (!user)
    return <div className="p-6 text-center text-gray-500 italic">User not found.</div>;

  const handleDelete = async () => {
    try {
      await deleteUser(user._id).unwrap();
      setShowModal(false);
      navigate("/users");
    } catch (err) {
      console.error("Failed to delete user: ", err);
      alert(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Delete Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          disabled={isDeleting}
          className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <FiTrash2 /> Delete User
        </button>
      </div>

      {/* User Info Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roles</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-800 font-medium">{user.username}</td>
              <td className="px-6 py-4 text-gray-800">{user.email?.trim() || <span className="italic text-gray-400">No email</span>}</td>
              <td className="px-6 py-4 text-gray-800">
                {Array.isArray(user.roles) && user.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span key={role} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{role}</span>
                    ))}
                  </div>
                ) : (
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs italic">No roles</span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-800">{user._id}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-medium">{user.username}</span>?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
