import React, { useState } from 'react';

const CategoryEditModal = ({ show, toggleModal, category, handelEditFunc }) => {
	const [newCategoryName, setNewCategoryName] = useState('');


	return (
		<>
			{show && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white rounded-lg shadow-md overflow-hidden w-96">
						<div className="bg-gray-200 py-4 px-6 flex items-center justify-between">
							<h2 className="text-lg font-semibold">Edit Category</h2>
						</div>
						<div className="p-6">
							<div className="mb-4">
								<label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
									Category Name*
								</label>
								<input
									type="text"
									id="categoryName"
									defaultValue={category.name}
									onChange={(e) => setNewCategoryName(e.target.value)}
									className="border rounded-md px-3 py-2 w-full mt-1"
								/>
							</div>
							<div className="flex justify-end">
								<button
									className={`px-4 py-2 rounded-md mr-2 ${
										newCategoryName === '' ? 'bg-blue-500 text-white cursor-not-allowed opacity-50' : 'bg-blue-500 text-white'
									}`}
									disabled={newCategoryName === ''}
									onClick={() => {
										if (newCategoryName !== '') {
											handelEditFunc(newCategoryName);
											toggleModal(false);
										}
									}}
								>
									Save Changes
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
				</div>
			)}
		</>
	);
};

export default CategoryEditModal;
