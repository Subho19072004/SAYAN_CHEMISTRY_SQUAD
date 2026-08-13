import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

function ComingSoon() {
  const location = useLocation();

  const pageName = location.pathname
    .split("/")
    .pop()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center h-full py-24 px-6 text-center">
      <Construction className="text-blue-600 mb-6" size={64} />
      <h2 className="text-2xl font-bold text-gray-800">{pageName}</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        This feature is under development and will be available soon.
      </p>
    </div>
  );
}

export default ComingSoon;
