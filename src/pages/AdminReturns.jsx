import React from "react";
import { Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

import useDocumentTitle from "../hooks/useDocumentTitle";
import { useGetAllReturnsQuery } from "../features/returns/returnsApiSlice";

export default function AdminReturns() {
  useDocumentTitle("Manage Returns");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAllReturnsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PulseLoader color="#2563EB" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-600">
        {error?.data?.message || "Failed to load returns."}
      </div>
    );
  }

  const returns = data?.ids
    ? data.ids.map((id) => data.entities[id])
    : [];

  if (!returns.length) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No return requests found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <h1 className="text-3xl font-bold dark:text-white">
            Manage Returns
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Review and process customer return requests.
          </p>

        </div>

        <div className="grid gap-6">

          {returns.map((item) => (

            <div
              key={item._id}
              className="
                bg-white
                dark:bg-gray-800
                rounded-2xl
                shadow
                p-6
                hover:shadow-lg
                transition
              "
            >

              {/* Header */}

              <div className="flex justify-between items-start mb-6">

                <div>

                  <h2 className="text-xl font-bold dark:text-white">
                    Return #{item._id.slice(-6).toUpperCase()}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Order #
                    {item.order?._id?.slice(-8).toUpperCase()}
                  </p>

                </div>

                <ReturnStatusBadge
                  status={item.status}
                />

              </div>

              {/* Customer */}

              <div className="grid md:grid-cols-2 gap-5 mb-6">

                <InfoRow
                  label="Customer"
                  value={item.customer?.username}
                />

                <InfoRow
                  label="Phone"
                  value={item.customer?.phoneNumber}
                />

                <InfoRow
                  label="Email"
                  value={item.customer?.email}
                />

                <InfoRow
                  label="Requested"
                  value={new Date(item.createdAt).toLocaleDateString()}
                />

              </div>

              {/* Order */}

              <div className="grid md:grid-cols-3 gap-5 mb-6">

                <InfoRow
                  label="Order Total"
                  value={`KSh ${item.order?.total?.toLocaleString()}`}
                />

                <InfoRow
                  label="Order Status"
                  value={item.order?.orderStatus}
                />

                <InfoRow
                  label="Payment"
                  value={item.order?.paymentStatus?.replaceAll("_", " ")}
                />

              </div>

              {/* Reason */}

              <div className="mb-6">

                <p className="text-sm text-gray-500">
                  Return Reason
                </p>

                <p className="font-semibold dark:text-white mt-1">
                  {item.reason}
                </p>

              </div>

              {/* Footer */}

              <div className="flex justify-end">

                <Link
                  to={`/admin/returns/${item._id}`}
                  className="
                    bg-black
                    hover:bg-gray-800
                    text-white
                    px-5
                    py-2
                    rounded-xl
                    transition
                  "
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold mt-1 dark:text-white">
        {value || "-"}
      </p>

    </div>
  );
}

function ReturnStatusBadge({ status }) {

  const colors = {

    requested:
      "bg-yellow-100 text-yellow-700",

    approved:
      "bg-blue-100 text-blue-700",

    item_received:
      "bg-purple-100 text-purple-700",

    refunded:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",

  };

  return (
    <span
      className={`
        px-4
        py-2
        rounded-full
        font-semibold
        capitalize
        ${colors[status]}
      `}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}