import React from "react";

const SupplierInfo = ({ supplier }) => {

  return (

    <div
      className="
        bg-white
        dark:bg-gray-800
        rounded-xl
        shadow
        p-6
        mb-8
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-6
          border-b
          pb-3
        "
      >
        Supplier Information
      </h2>

      <div className="space-y-4">

        <div className="flex">

          <span className="w-52 font-semibold">
            Company Name
          </span>

          <span>
            {supplier.companyName}
          </span>

        </div>

        <div className="flex">

          <span className="w-52 font-semibold">
            Contact Person
          </span>

          <span>
            {supplier.contactPerson}
          </span>

        </div>

        <div className="flex">

          <span className="w-52 font-semibold">
            Phone
          </span>

          <span>
            {supplier.phone}
          </span>

        </div>

        <div className="flex">

          <span className="w-52 font-semibold">
            Email
          </span>

          <span>
            {supplier.email || "N/A"}
          </span>

        </div>

        <div className="flex">

          <span className="w-52 font-semibold">
            Address
          </span>

          <span>
            {supplier.address || "N/A"}
          </span>

        </div>

      </div>

    </div>

  );

};

export default SupplierInfo;