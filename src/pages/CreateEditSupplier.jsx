import React, { useState,useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useCreateSupplierMutation,  useGetSupplierByIdQuery,useUpdateSupplierMutation } from "../features/suppliersApiSlice";

import { useParams } from "react-router-dom";

  



const CreateEditSupplier = () => {

    const { id } = useParams();

const isEditMode = Boolean(id);


useDocumentTitle(
  isEditMode
  ? "Edit Supplier"
  : "Create Supplier"
);




  const [formData, setFormData] = useState({

    companyName:"",
    contactPerson:"",
    phone:"",
    email:"",
    address:"",
    notes:"",
    isActive:true,

  });


  const [createSupplier, {
  isLoading
}] = useCreateSupplierMutation();



const {
  data: supplier,
  isLoading: loadingSupplier
} = useGetSupplierByIdQuery(id, {
  skip: !isEditMode
});


const [
  updateSupplier,
  {
    isLoading: updatingSupplier
  }
] = useUpdateSupplierMutation();



useEffect(()=>{

  if(supplier){

    setFormData({

      companyName: supplier.companyName || "",

      contactPerson: supplier.contactPerson || "",

      phone: supplier.phone || "",

      email: supplier.email || "",

      address: supplier.address || "",

      notes: supplier.notes || "",

      isActive: supplier.isActive,

    });

  }

},[supplier]);




  const handleChange = (e)=>{

    const {name,value,type,checked}=e.target;


    setFormData((prev)=>({

      ...prev,

      [name]:
        type === "checkbox"
        ? checked
        : value

    }));

  };


  const handleSubmit = async(e)=>{

  e.preventDefault();


  try{


    if(isEditMode){


      await updateSupplier({

        id,

        ...formData

      }).unwrap();


      alert("Supplier updated successfully");


    }else{


      await createSupplier(formData).unwrap();


      alert("Supplier created successfully");


    }



  }catch(error){

    alert(
      error?.data?.message ||
      "Operation failed"
    );

  }

};


return (

  <div className="max-w-4xl mx-auto p-6">


    <h1
      className="
      text-3xl
      font-bold
      mb-8
      "
    >
   {
 isEditMode
 ?
 "Edit Supplier"
 :
 "Create Supplier"
}
    </h1>



    <form

      onSubmit={handleSubmit}

      className="
      bg-white
      dark:bg-gray-800
      rounded-2xl
      shadow
      p-6
      space-y-5
      "

    >



      <div>

        <label className="block mb-2 font-medium">
          Company Name
        </label>

        <input

          name="companyName"

          value={formData.companyName}

          onChange={handleChange}

          className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          "

          placeholder="Samsung Kenya"

        />

      </div>





      <div>

        <label className="block mb-2 font-medium">
          Contact Person
        </label>

        <input

          name="contactPerson"

          value={formData.contactPerson}

          onChange={handleChange}

          className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          "

          placeholder="John Mwangi"

        />

      </div>





      <div>

        <label className="block mb-2 font-medium">
          Phone
        </label>

        <input

          name="phone"

          value={formData.phone}

          onChange={handleChange}

          className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          "

          placeholder="0712345678"

        />

      </div>





      <div>

        <label className="block mb-2 font-medium">
          Email
        </label>

        <input

          name="email"

          value={formData.email}

          onChange={handleChange}

          className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          "

          placeholder="supplier@email.com"

        />

      </div>





      <div>

        <label className="block mb-2 font-medium">
          Address
        </label>

        <input

          name="address"

          value={formData.address}

          onChange={handleChange}

          className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          "

          placeholder="Nairobi"

        />

      </div>





      <div>

        <label className="block mb-2 font-medium">
          Notes
        </label>

        <textarea

          name="notes"

          value={formData.notes}

          onChange={handleChange}

          className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          "

          rows="4"

          placeholder="Additional information"

        />

      </div>





      <label
        className="
        flex
        items-center
        gap-3
        "
      >

        <input

          type="checkbox"

          name="isActive"

          checked={formData.isActive}

          onChange={handleChange}

        />

        Active Supplier

      </label>



<button

  type="submit"

  disabled={isLoading || updatingSupplier}

  className="
  bg-green-600
  hover:bg-green-700
  disabled:bg-gray-400
  text-white
  px-6
  py-3
  rounded-xl
  font-semibold
  "

>

{
  isLoading || updatingSupplier
  ?
  "Saving..."
  :
  isEditMode
  ?
  "Update Supplier"
  :
  "Save Supplier"
}

</button>



    </form>



  </div>

);



};

export default CreateEditSupplier;