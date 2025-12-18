import { useLayoutEffect, useState } from "react"

const useWindoSize = () => {
    const [size, setSize] = useState({ width: null, height: null });

    useLayoutEffect(() => {
        const handleSize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        handleSize();
        window.addEventListener('resize', handleSize);

        return () => {
            window.removeEventListener('resize', handleSize);
        }
    }, [])
    
    return size;

}

export default useWindoSize; 