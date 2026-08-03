import React from "react";
import { useParams } from "react-router-dom";

import useDocumentTitle from "../hooks/useDocumentTitle";

import PurchaseInfo from "../components/purchases/PurchaseInfo";
import SupplierInfo from "../components/purchases/SupplierInfo";
import PurchaseItemsTable from "../components/purchases/PurchaseItemsTable";
import PurchaseSummary from "../components/purchases/PurchaseSummary";
import ReceivePurchaseButton from "../components/purchases/RecievePurchaseButton";

import {
  useGetPurchaseByIdQuery,
} from "../features/purchases/purchasesApiSlice";

const PurchaseDetails = () => {

  useDocumentTitle("Purchase Details");

  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetPurchaseByIdQuery(id);

  if (isLoading) {

    return (

      <div className="p-6">

        Loading purchase...

      </div>

    );

  }

  if (isError) {

    return (

      <div className="p-6 text-red-600">

        {
          error?.data?.message ||
          "Failed to load purchase"
        }

      </div>

    );

  }

  const purchase = data.purchase;
  const items = data.items;
  const summary = data.summary;

  return (

    <div className="max-w-7xl mx-auto p-6">

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Purchase Details
      </h1>

      <PurchaseInfo
        purchase={purchase}
      />

      <SupplierInfo
        supplier={purchase.supplier}
      />

      <PurchaseItemsTable
        items={items}
      />

      <PurchaseSummary
        summary={summary}
      />

      <ReceivePurchaseButton
        purchaseId={purchase._id}
        status={purchase.status}
      />

    </div>

  );

};

export default PurchaseDetails;