import React from "react";


export default function OrderCard({ order }) {
    if (!order) return null;

    const { _id, status, paymentMethod, total, items = [], createdAt } = order;

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600 text-sm">Order ID:</p>
                <p className="text-gray-800 font-medium">{_id}</p>
            </div>

            <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600 text-sm">Status:</p>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        status === "paid"
                            ? "bg-green-100 text-green-800"
                            : status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {status}
                </span>
            </div>

            <div className="mb-2">
                <p className="text-gray-600 text-sm">Payment Method:</p>
                <p className="text-gray-800">{paymentMethod}</p>
            </div>

            <div className="mb-2">
                <p className="text-gray-600 text-sm">Total:</p>
                <p className="text-gray-800">${total}</p>
            </div>

            <div className="mb-2">
                <p className="text-gray-600 text-sm">Items:</p>
                <ul className="mt-1 space-y-1">
                    {items.map(item => (
                        <li key={item._id} className="flex justify-between text-gray-800">
                            <span>{item.product?.name || "Product"}</span>
                            <span>Qty: {item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <p className="text-gray-500 text-xs mt-auto">
                Ordered on: {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
            </p>
        </div>
    );
}
