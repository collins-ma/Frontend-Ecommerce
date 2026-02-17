import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
} from "../features/users/usersApiSlice";
import { FiTrash2, FiUserX, FiUserCheck } from "react-icons/fi";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, isError, error } =
    useGetUserByIdQuery(userId);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [deactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();
  const [activateUser, { isLoading: isActivating }] =
    useActivateUserMutation();

  const [showModal, setShowModal] = useState(false);

  if (isLoading)
    return <div className="p-6 text-center">Loading user...</div>;

  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        {error?.data?.message || "Failed to load user"}
      </div>
    );

  if (!user)
    return <div className="p-6 text-center">User not found</div>;

  const handleDelete = async () => {
    await deleteUser(user._id).unwrap();
    navigate("/users");
  };

  const handleDeactivate = async () => {
    await deactivateUser(user._id).unwrap();
  };

  const handleActivate = async () => {
    await activateUser(user._id).unwrap();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mb-6">
        {user.isActive ? (
          <button
            onClick={handleDeactivate}
            disabled={isDeactivating}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            <FiUserX />
            {isDeactivating ? "Deactivating..." : "Deactivate"}
          </button>
        ) : (
          <button
            onClick={handleActivate}
            disabled={isActivating}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            <FiUserCheck />
            {isActivating ? "Activating..." : "Activate"}
          </button>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          <FiTrash2 /> Delete
        </button>
      </div>

      {/* USER INFO */}
      <div className="bg-white shadow-xl rounded-xl p-6">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email || "—"}</p>
        <p><strong>Status:</strong> {user.isActive ? "Active" : "Deactivated"}</p>
        <p><strong>User ID:</strong> {user._id}</p>
      </div>

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Delete <strong>{user.username}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white px-4 py-2 rounded"
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
