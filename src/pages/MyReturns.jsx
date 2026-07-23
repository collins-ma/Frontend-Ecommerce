import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyReturnsQuery } from "../features/returns/returnsApiSlice";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function MyReturns() {
  useDocumentTitle("my returns");

  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useGetMyReturnsQuery();

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        Loading returns...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-600">
        Failed to load returns.
      </div>
    );
  }

  const returns = data?.ids
    ? data.ids.map((id) => data.entities[id])
    : [];

  if (!returns.length) {
    return (
      <div
        className="
          min-h-screen
          bg-gray-100
          dark:bg-gray-900
          flex
          items-center
          justify-center
        "
      >
        <p
          className="
            text-gray-500
            dark:text-gray-300
          "
        >
          You have no return requests.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        dark:bg-gray-900
        p-6
      "
    >
      <div
        className="
          max-w-5xl
          mx-auto
        "
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="
                text-3xl
                font-bold
                dark:text-white
              "
            >
              My Returns
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track all your return requests
            </p>
          </div>

          <span
            className="
              px-4
              py-2
              rounded-xl
              bg-blue-100
              dark:bg-blue-900
              text-blue-700
              dark:text-blue-300
              font-semibold
            "
          >
            {returns.length} Return
            {returns.length > 1 && "s"}
          </span>
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
                hover:shadow-lg
                transition
                p-6
              "
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2
                    className="
                      text-lg
                      font-bold
                      dark:text-white
                    "
                  >
                    Return #{item._id.slice(-6).toUpperCase()}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Order #
                    {item.order?._id
                      ? item.order._id
                          .slice(-8)
                          .toUpperCase()
                      : "N/A"}
                  </p>
                </div>

                <ReturnStatusBadge
                  status={item.status}
                />
              </div>

              {/* Reason */}
              <div className="mb-5">
                <p className="text-xs text-gray-500 uppercase">
                  Return Reason
                </p>

                <p className="font-medium dark:text-white mt-1">
                  {item.reason}
                </p>
              </div>

              {/* Order Information */}
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-4
                  mb-6
                "
              >
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Total
                  </p>

                  <p className="font-semibold dark:text-white mt-1">
                    KSh{" "}
                    {item.order?.total?.toLocaleString() ||
                      0}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Items
                  </p>

                  <p className="font-semibold dark:text-white mt-1">
                    {item.order?.items?.length || 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Payment
                  </p>

                  <p className="font-semibold capitalize dark:text-white mt-1">
                    {item.order?.paymentStatus
                      ?.replaceAll("_", " ") ||
                      "N/A"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                className="
                  border-t
                  dark:border-gray-700
                  pt-5
                  flex
                  justify-between
                  items-center
                "
              >
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Requested
                  </p>

                  <p className="text-sm font-medium dark:text-white mt-1">
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/returns/${item._id}`)
                  }
                  className="
                    bg-black
                    hover:bg-gray-800
                    text-white
                    px-5
                    py-2.5
                    rounded-xl
                    transition
                  "
                >
                  View Return
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReturnStatusBadge({ status }) {
  const colors = {
    requested:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",

    approved:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",

    item_received:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",

    refunded:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",

    rejected:
      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-sm
        font-semibold
        capitalize
        ${colors[status] || "bg-gray-100 text-gray-700"}
      `}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}