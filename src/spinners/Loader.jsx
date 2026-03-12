import React from "react";
import { LoaderCircle } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <LoaderCircle className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );
};

export default Loader;