import { useState } from "react";
import Toastr from "./Toastr";

const MyComponent = () => {
  const [toastrMessage, setToastrMessage] = useState(null);

  return (
    <div>
      <button onClick={() => setToastrMessage({ message: "Action Successful!", type: "success" })}>
        Show Toastr
      </button>

      {toastrMessage && (
        <Toastr 
          message={toastrMessage.message} 
          type={toastrMessage.type} 
          onClose={() => setToastrMessage(null)} 
        />
      )}
    </div>
  );
};

export default MyComponent;
