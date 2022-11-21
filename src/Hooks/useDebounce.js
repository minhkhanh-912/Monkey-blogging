import { useEffect, useState } from "react";

export default function useDebounce(initialValue ="", delay = 500) {
    const [debounceValue , setdebounceValue] = useState('');

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setdebounceValue(initialValue);
        },delay);

        return ()=>{
            clearTimeout(timer);
        }
    },[delay, initialValue])

    return debounceValue;
}