import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import { useForm, useFieldArray } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';



const CreateSales = ({ auth }) => {
	const { register, handleSubmit, control, setValue } = useForm();
	const [productList, setProductList] = useState([]);

	const [selectedProducts, setSelectedProducts] = useState([]);


	const { fields, append, remove } = useFieldArray({
		control,
		name: 'products',
	});

	const onSubmit = (data) => {

		saveSales(data);
	};


	const saveSales = async (data) => {

		try {
			console.log(data);
			const response = await axios.post(`/api/saveSales/${auth?.user?.id}`, data);
			console.log(response);
			if(response.status === 200){
				toast("Sales added successfully!", { type: "success" });
				setTimeout(() => {
					Inertia.visit(route('sales'));
				  }, 2000);
			
			}
		} catch (error) {
			toast("Error adding sales!", { type: "error" });
			console.error('Error fetching categories:', error);
		}

	}


	const fetchAllProducts = async () => {
		try {
			const response = await axios.get(`/api/getAllProducts/${auth?.user?.id}`);
			console.log(response?.data);
			setProductList(response?.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const handleProductSelection = (index, productId) => {
		setSelectedProducts((prevSelected) => [...prevSelected, productId]);
		// Update form values here if needed
	};

	useEffect(() => {
		(async () => await fetchAllProducts()

		)();
	}, []);

	return (
		<AuthenticatedLayout
			user={auth.user}
			header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Sales</h2>}
		>
			<Head title="Create Sales" />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<div className="py-12">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<div className="flex flex-row justify-between align-middle items-center">
								<h3 className="text-lg font-semibold">Create Sales:</h3>
							</div>


							<form onSubmit={handleSubmit(onSubmit)}>
								{/* Customer details */}
								<div className="mb-4 flex">
									<label className="pr-4 flex-shrink-0 w-1/4" htmlFor="customerName">
										Customer Name:
									</label>
									<input
										id="customerName"
										{...register('customerName')}
										placeholder="Customer Name"
										className="border rounded-md px-3 py-2 w-2/5"
									/>
								</div>
								<div className="mb-4 flex">
									<label className="pr-4 flex-shrink-0 w-1/4" htmlFor="customerPhoneNumber">
										Customer Number:
									</label>
									<input
										id="customerPhoneNumber"
										{...register('customerPhoneNumber')}
										placeholder="Customer Phone Number"
										className="border rounded-md px-3 py-2 w-2/5"
									/>
								</div>
								<div className="mb-4 flex">
									<label className="pr-4 flex-shrink-0 w-1/4" htmlFor="customerAddress">
										Customer Address:
									</label>
									<input
										id="customerAddress"
										{...register('customerAddress')}
										placeholder="Customer Address"
										className="border rounded-md px-3 py-2 w-2/5"
									/>
								</div>
								<div className="mb-4 flex">
									<label className="pr-4 flex-shrink-0 w-1/4" htmlFor="discount">
										Discount (%):
									</label>
									<input
										type="number"
										id="discount"
										{...register('discount')}
										placeholder="Discount"
										className="border rounded-md px-3 py-2 w-2/5"
									/>
								</div>
								<div className="mb-4 flex">
									<label className="pr-4 flex-shrink-0 w-1/4" htmlFor="vat">
										Vat (%):
									</label>
									<input
										type="number"
										id="vat"
										{...register('vat')}
										placeholder="Vat"
										className="border rounded-md px-3 py-2 w-2/5"
									/>
								</div>

							


								<table className="border-collapse w-full mb-4">
									<thead>
										<tr className="border-b">
											<th className="text-left px-3 py-2">Product</th>
											<th className="text-left px-3 py-2">Price</th>
											<th className="text-left px-3 py-2">Stock</th>
											<th className="px-3 py-2">Actions</th>
										</tr>
									</thead>
									<tbody>
										{fields.map((field, index) => (
											<tr key={field.id} className="border-b">
												<td className="px-3 py-2">
													<select
														{...register(`products[${index}].product`)}
														defaultValue={field.product}
														className="border rounded-md px-3 py-2 w-full"
														onChange={(e) => {
															const productId = parseInt(e.target.value);
															handleProductSelection(index, productId);
															const selectedProduct = productList.find(
																(product) => product.id === productId
															);
															setValue(`products[${index}].price`, selectedProduct?.price || '');
															setValue(`products[${index}].stock`, selectedProduct?.unit || '');
														}}
													>
														<option value="">Select a product</option>
														{productList.map((product) => (
															<option
																key={product.id}
																value={product.id}
																disabled={selectedProducts.includes(product.id)}
															>
																{product.name}
															</option>
														))}
													</select>
												</td>
												<td className="px-3 py-2">
													<input
														{...register(`products[${index}].price`)}
														defaultValue={field.price}
														placeholder="Price"
														className="border rounded-md px-3 py-2 w-full"
													/>
												</td>
												<td className="px-3 py-2">
													<input
														{...register(`products[${index}].stock`)}
														defaultValue={field.stock}
														placeholder="Stock"
														type="number"
														max={field.stock} // Set the max attribute to the available stock for the product
														className="border rounded-md px-3 py-2 w-full"
													/>
												</td>
												<td className="px-3 py-2">
													<button
														type="button"
														onClick={() => remove(index)}
														className="bg-red-500 text-white px-3 py-2 rounded-md"
													>
														Remove
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								<div className="flex justify-end">
									<button
										type="button"
										onClick={() => append({ product: '', price: '', stock: '' })}
										className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
									>
										Add Product
									</button>
									<button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
										Submit
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
};

export default CreateSales;
