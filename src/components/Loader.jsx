import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

export default function Loader() {
  const { dark } = useContext(AppContext);

  return (
    <div className="flex w-full justify-start mt-4">
      <div className="flex flex-col gap-3 w-full max-w-2xl p-4">
      
        <div className={`h-4 rounded-full animate-pulse bg-gradient-to-r ${
          dark 
            ? "from-blue-900 via-indigo-600 to-blue-900" 
            : "from-blue-200 via-indigo-400 to-blue-200"
        }`}></div>
        
  
        <div className={`h-4 w-[80%] rounded-full animate-pulse bg-gradient-to-r ${
          dark 
            ? "from-blue-900 via-indigo-600 to-blue-900" 
            : "from-blue-200 via-indigo-400 to-blue-200"
        }`}></div>
        
  
        <div className={`h-4 w-[60%] rounded-full animate-pulse bg-gradient-to-r ${
          dark 
            ? "from-blue-900 via-indigo-600 to-blue-900" 
            : "from-blue-200 via-indigo-400 to-blue-200"
        }`}></div>
      </div>
    </div>
  );
}