import React from "react";
import { useCreateCategoryMutation } from "../features/categories/categoriesApiSlice";
import { useState } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";

const CreateCategory = () => {

  useDocumentTitle("Create Category");


  const [
    createCategory,
    { isLoading },
  ] = useCreateCategoryMutation();


  const [category, setCategory] = useState({
    name: "",
    trackExpiry: false,
  });


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createCategory(category).unwrap();

      alert("Category created successfully.");

      setCategory({
        name: "",
        trackExpiry: false,
      });


    } catch (err) {

      alert(
        err?.data?.message ||
        "Failed to create category."
      );

    }

  };


  return (
    <>

      <h1 className="text-3xl font-bold mb-8">
        Create Category
      </h1>


      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          dark:bg-gray-800
          rounded-2xl
          shadow
          p-6
          space-y-6
        "
      >


        {/* Category Name */}

        <div>

          <label
            className="
              block
              mb-2
              font-medium
            "
          >
            Category Name
          </label>


          <input

            type="text"

            value={category.name}

            onChange={(e) =>
              setCategory((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }

            placeholder="Example: Food, Electronics"

            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
            "

            required

          />

        </div>



        {/* Track Expiry */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <input

            type="checkbox"

            id="trackExpiry"

            checked={category.trackExpiry}

            onChange={(e) =>
              setCategory((prev) => ({
                ...prev,
                trackExpiry: e.target.checked,
              }))
            }

            className="
              h-5
              w-5
            "

          />


          <label
            htmlFor="trackExpiry"
            className="font-medium"
          >

            Track Expiry Dates

          </label>


        </div>



        {/* Submit Button */}

        <button

          type="submit"

          disabled={isLoading}

          className="
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-gray-400
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
          "

        >

          {
            isLoading
            ? "Saving..."
            : "Create Category"
          }


        </button>


      </form>

    </>
  );

};


export default CreateCategory;