import { AiOutlineLoading } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <AiOutlineLoading className="text-4xl text-blue-500 animate-spin" />
    </div>
  );
};

export default Loading;
