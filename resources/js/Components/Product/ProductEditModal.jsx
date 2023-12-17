import React, { useEffect, useState } from 'react';

const ProductEditModal = ({ show, toggleModal, product, handelEditFunc, auth }) => {
	const [newProductName, setNewProductName] = useState('');
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

	const save = () => {

		let data = {
			productName: newProductName,
			productPrice: price,
			productQuantity: stock,
			productCategory: parseInt(selectedCategory)

		};
		// console.log(data);
		handelEditFunc(data);
	}

	const handleCancel = () => {
		toggleModal();
		setNewProductName('');
		setPrice(0);
		setStock(0);
		setSelectedCategory('');
	}

	useEffect(() => {
		(async () => await fetchCategories())();
		
	}, []);

	useEffect(() => {
		// Set the default category based on product.category_id
		if (product && product.category_id) {
		  setSelectedCategory(product.category_id);
		  setNewProductName(product.name);
		  setPrice(product.price);
		  setStock(product.unit);


		}
	  }, [product]);


	const fetchCategories = async () => {
		try {

			const response = await axios.get(`/api/getAllCategories/${auth?.user?.id}`);

			setCategoryList(response?.data);
			

		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}

  return (
	<>
			{show && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white rounded-lg shadow-md overflow-hidden w-full sm:w-96 lg:w-1/3">
						<div className="bg-gray-200 py-4 px-6 flex items-center justify-between">
							<h2 className="text-lg font-semibold">Edit Product</h2>
						</div>
						{/* show the image here */}
						<div className='flex flex-row justify-center pt-4'>  
							<img src={`upload_image/${product.img_url}`} alt={`upload_image/${product.img_url}`} className="w-48 h-48 object fit-cover" />
							{/* <img src={`upload_image/${product.img_url}`} alt={`upload_image/${product.img_url}`} className="w-12 h-12 object-cover" /> */}
						</div>
						<div className="p-6">
							<div className="mb-4">
								<label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
									Product Name*
								</label>
								<input
									type="text"
									id="categoryName"
									defaultValue={product.name}
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
									defaultValue={product.price}
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
									defaultValue={product.unit}
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

							<div className="flex justify-end">
								<button
									className={`px-4 py-2 rounded-md mr-2 ${(newProductName === '' ||   parseInt(price) <= 0 || parseInt(stock) <= 0 || selectedCategory === '') ? 'bg-blue-500 text-white cursor-not-allowed opacity-50' : 'bg-blue-500 text-white'
										}`}
									disabled={newProductName === '' ||   parseInt(stock) <= 0 || parseInt(price) <= 0 || selectedCategory === ''}
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
  )
}

export default ProductEditModal;