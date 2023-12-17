import React, { useEffect, useState } from 'react';

const ProductAddModal = ({ show, toggleModal, handelAddFunc, auth }) => {
	const [newProductName, setNewProductName] = useState('');
	const [newProductImage, setNewProductImage] = useState(null);
	const [price, setPrice] = useState(0);
	const [stock, setStock] = useState(0);
	const [categoryList, setCategoryList] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');


	const categoryOptions = categoryList.map((category) => (
		<option key={category.id} value={category.id}>
			{category.name}
		</option>
	));

	const handleCategoryChange = (e) => {
		setSelectedCategory(e.target.value);
	};

	const fetchCategories = async () => {
		try {

			const response = await axios.get(`/api/getAllCategories/${auth?.user?.id}`);

			setCategoryList(response?.data);

		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}


	const save = () => {

		let data = {
			productName: newProductName,
			productImage: newProductImage,
			productPrice: price,
			productQuantity: stock,
			productCategory: selectedCategory

		};
		// console.log(data);
		handelAddFunc(data);
	}

	const handleCancel = () => {
		toggleModal();
		setNewProductName('');
		setNewProductImage(null);
		setPrice(0);
		setStock(0);
		setSelectedCategory('');
	}

	useEffect(() => {

		(async () => await fetchCategories())();
	}, []);

	return (
		<>
			{show && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white rounded-lg shadow-md overflow-hidden w-100">
						<div className="bg-gray-200 py-4 px-6 flex items-center justify-between">
							<h2 className="text-lg font-semibold">Add New Product</h2>
						</div>
						<div className="p-6">
							<div className="mb-4">
								<label htmlFor="productName" className="block text-sm font-medium text-gray-700">
									Product Name*
								</label>
								<input
									type="text"
									id="productName"
									placeholder='Enter product name'
									onChange={(e) => setNewProductName(e.target.value)}
									className="border rounded-md px-3 py-2 w-full mt-1"
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
									Product Price(BDT)*
								</label>
								<input
									type="number"
									id="productPrice"
									placeholder='Enter product price'
									onChange={(e) => setPrice(e.target.value)}
									className="border rounded-md px-3 py-2 w-full mt-1"
									min="1"
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
									Product Stock*
								</label>
								<input
									type="number"
									id="productStock"
									placeholder='Enter product stock'
									onChange={(e) => setStock(e.target.value)}
									className="border rounded-md px-3 py-2 w-full mt-1"
									min="1"
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="productCategory" className="block text-sm font-medium text-gray-700">
									Product Category*
								</label>
								<select
									id="productCategory"
									onChange={handleCategoryChange}
									value={selectedCategory}
									className="border rounded-md px-3 py-2 w-full mt-1"
								>
									<option value="">Select category</option>
									{categoryOptions}
								</select>
							</div>


							<div className="mb-4">
								<label htmlFor="productImage" className="block text-sm font-medium text-gray-700">
									Product Image*
								</label>
								<input
									type="file"
									id="productImage"
									onChange={(e) => setNewProductImage(e.target.files[0])}
									className="border rounded-md px-3 py-2 w-full mt-1"
								/>
							</div>

							<div className="flex justify-end">
								<button
									className={`px-4 py-2 rounded-md mr-2 ${(newProductName === '' || !newProductImage || parseInt(price) <= 0 || parseInt(stock) <= 0 || selectedCategory === '') ? 'bg-blue-500 text-white cursor-not-allowed opacity-50' : 'bg-blue-500 text-white'
										}`}
									disabled={newProductName === '' || !newProductImage || parseInt(stock) <= 0 || parseInt(price) <= 0 || selectedCategory === ''}
									onClick={() => {

										save();
									}}
								>
									Save Changes
								</button>
								<button
									className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
									onClick={()=> handleCancel()}
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
}

export default ProductAddModal