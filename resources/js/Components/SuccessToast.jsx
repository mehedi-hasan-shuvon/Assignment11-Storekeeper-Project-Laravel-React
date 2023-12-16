import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuccessToast = ({ message }) => {
  const notify = () => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // milliseconds
    });
  };

  return (
    <div onClick={notify} className="cursor-pointer">
      Show Success Toast
    </div>
  );
};

export default SuccessToast;