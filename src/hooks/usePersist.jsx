import { useState, useEffect } from "react";

const usePersist = () => {
  const [persist, setPersist] = useState(() => {
    const stored = localStorage.getItem("persist");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};

export default usePersist;