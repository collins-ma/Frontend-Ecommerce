import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
} from "../features/users/usersApiSlice";
import { FiTrash2, FiUserX, FiUserCheck, FiAlertCircle } from "react-icons/fi";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, isError, error } = useGetUserByIdQuery(userId);

  const [deleteUser, { isLoading: isDeleting, error: deleteError }] = useDeleteUserMutation();
  const [deactivateUser, { isLoading: isDeactivating, error: deactivateError }] =
    useDeactivateUserMutation();
  const [activateUser, { isLoading: isActivating, error: activateError }] =
    useActivateUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [actionError, setActionError] = useState("");

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading user...
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 font-medium">
        {error?.data?.message || "Failed to load user"}
      </div>
    );

  if (!user)
    return <div className="p-6 text-center text-gray-600 dark:text-gray-300">User not found</div>;

  const handleDelete = async () => {
    try {
      await deleteUser(user._id).unwrap();
      navigate("/users");
    } catch (err) {
      setActionError(err?.data?.message || "Failed to delete user.");
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateUser(user._id).unwrap();
    } catch (err) {
      setActionError(err?.data?.message || "Failed to deactivate user.");
    }
  };

  const handleActivate = async () => {
    try {
      await activateUser(user._id).unwrap();
    } catch (err) {
      setActionError(err?.data?.message || "Failed to activate user.");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-6 items-start md:items-center">
        <div className="flex flex-wrap gap-3">
          {user.isActive ? (
            <button
              onClick={handleDeactivate}
              disabled={isDeactivating}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md"
            >
              <FiUserX /> {isDeactivating ? "Deactivating..." : "Deactivate"}
            </button>
          ) : (
            <button
              onClick={handleActivate}
              disabled={isActivating}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
            >
              <FiUserCheck /> {isActivating ? "Activating..." : "Activate"}
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
          >
            <FiTrash2 /> Delete
          </button>
        </div>

        {/* Styled Action Error */}
        {actionError && (
          <div className="flex items-center gap-2 mt-2 md:mt-0 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 px-4 py-2 rounded shadow-sm">
            <FiAlertCircle />
            <span className="text-sm font-medium">{actionError}</span>
          </div>
        )}
      </div>

      {/* USER INFO CARD */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 flex flex-col gap-3 transition-colors duration-300">
        <p className="text-gray-800 dark:text-gray-200"><strong>Username:</strong> {user.username}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {user.email || "—"}</p>
        <p className="text-gray-800 dark:text-gray-200"><strong>Status:</strong> {user.isActive ? "Active" : "Deactivated"}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>User ID:</strong> {user._id}</p>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm mx-auto shadow-lg transition-colors duration-300">
            <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Confirm Delete</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Delete <strong>{user.username}</strong>?
            </p>

            {/* Modal API Error */}
            {deleteError && (
              <div className="flex items-center gap-2 mb-4 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 px-3 py-2 rounded text-sm">
                <FiAlertCircle />
                <span>{deleteError?.data?.message}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-md"
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