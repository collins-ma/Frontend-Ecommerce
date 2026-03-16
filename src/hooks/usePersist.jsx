import { useState, useEffect } from "react"

const usePersist = () => {
    const [persist, setPersist] = useState(true);

    return [persist, setPersist]
}
export default usePersist