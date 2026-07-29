import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiPlus,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import useDocumentTitle from "../hooks/useDocumentTitle";
import { useGetSuppliersQuery ,useDeleteSupplierMutation} from "../features/suppliersApiSlice";

const SuppliersPage = () => {

  useDocumentTitle("Suppliers");

  const {
    data: suppliersData,
    isLoading,
    isError,
    error,
  } = useGetSuppliersQuery()


  const navigate = useNavigate();

const [deleteSupplier] = useDeleteSupplierMutation();



const supplierList =
  suppliersData?.ids.map(
    id => suppliersData.entities[id]
  ) || [];



if (isLoading) {
  return (
    <p className="text-center mt-10">
      Loading suppliers...
    </p>
  );
}


if (isError) {
  return (
    <p className="text-center text-red-500 mt-10">
      {error?.data?.message || "Failed to load suppliers"}
    </p>
  );
}



return (

<div className="p-6">

  <div
    className="
    flex
    flex-col
    sm:flex-row
    justify-between
    items-start
    sm:items-center
    gap-4
    mb-8
    "
  >

    <div>

      <h1
        className="
        text-3xl
        font-bold
        "
      >
        Suppliers
      </h1>

      <p
        className="
        text-gray-500
        dark:text-gray-400
        mt-2
        "
      >
        Manage your product suppliers
      </p>

    </div>

    <Link
      to="/admin/suppliers/new"
      className="
      flex
      items-center
      gap-2
      bg-green-600
      hover:bg-green-700
      text-white
      px-5
      py-3
      rounded-xl
      font-semibold
      transition
      "
    >
      <FiPlus />
      Add Supplier
    </Link>

  </div>

  <div
    className="
    bg-white
    dark:bg-gray-800
    rounded-xl
    shadow
    overflow-hidden
    "
  >

    <table className="w-full">

      <thead
        className="
        bg-gray-100
        dark:bg-gray-700
        "
      >

        <tr>

          <th className="px-6 py-4 text-left">Company</th>

          <th className="px-6 py-4 text-left">Contact</th>

          <th className="px-6 py-4 text-left">Phone</th>

          <th className="px-6 py-4 text-left">Email</th>

          <th className="px-6 py-4 text-left">Status</th>

          <th className="px-6 py-4 text-center">Actions</th>

        </tr>

      </thead>

      <tbody>

        {supplierList.length === 0 ? (

          <tr>

            <td
              colSpan="6"
              className="
              text-center
              py-10
              text-gray-500
              "
            >
              No suppliers found.
            </td>

          </tr>

        ) : (

          supplierList.map((supplier) => (

            <tr
              key={supplier._id}
              className="
              border-t
              dark:border-gray-700
              "
            >

              <td className="px-6 py-4">
                {supplier.companyName}
              </td>

              <td className="px-6 py-4">
                {supplier.contactPerson}
              </td>

              <td className="px-6 py-4">
                {supplier.phone}
              </td>

              <td className="px-6 py-4">
                {supplier.email}
              </td>

              <td className="px-6 py-4">

                {supplier.isActive ? (

                  <span
                    className="
                    bg-green-100
                    text-green-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    "
                  >
                    Active
                  </span>

                ) : (

                  <span
                    className="
                    bg-red-100
                    text-red-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    "
                  >
                    Inactive
                  </span>

                )}

              </td>

              <td
                className="
                px-6
                py-4
                flex
                justify-center
                gap-3
                "
              >

             <button
  onClick={() =>
    navigate(`/admin/suppliers/${supplier._id}/edit`)
  }
  className="
  text-blue-600
  hover:text-blue-800
  "
>
  <FiEdit />
</button>

                <button
  onClick={async () => {

    const confirmDelete = window.confirm(
      `Delete supplier "${supplier.companyName}"?`
    );

    if (!confirmDelete) return;

    try {

      await deleteSupplier(supplier._id).unwrap();

      alert("Supplier deleted successfully.");

    } catch (err) {

      alert(
        err?.data?.message ||
        "Failed to delete supplier."
      );

    }

  }}
  className="
  text-red-600
  hover:text-red-800
  "
>
  <FiTrash2 />
</button>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

</div>

);




}


export default SuppliersPage