import React from 'react';

const DeleteModal = ({ show, toggleModal, name, handleDeleteFunc }) => {
  return (
    <>
      {/* Overlay */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
			
          {/* Modal */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Confirm Deletion</h2>
             
            </div>
            <p className="text-gray-700">
              Are you sure you want to delete '{name}'?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => {
                  // Add delete functionality here
				  handleDeleteFunc();
                  toggleModal(false);
                }}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => toggleModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
