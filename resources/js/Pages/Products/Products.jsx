import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { faAdd, faAngleLeft, faAngleRight, faBan, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProductAddModal from '@/Components/Product/ProductAddModal';
import ProductEditModal from '@/Components/Product/ProductEditModal';
import DeleteModal from '@/Components/DeleteModal';
import { formatToBanglaNumber } from '@/Components/CommonFunctions';

const Products = ({ auth }) => {

	const [showAddModal, setShowAddModal] = useState(false);
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [showDeleteModal, setShowDeleteModalOpen] = useState(false);


	const [showEditModal, setShowEditModal] = useState(false);

	const [selectedProduct, setSelectedProduct] = useState({});

	const fetchProducts = async (page = 1) => {
		try {
			setIsLoading(true);
			// const response = await axios.get(`/api/getAllCategories/${auth?.user?.id}`); 
			const response = await axios.get(`/api/getProducts/${auth?.user?.id}`, {
				params: { page },
			});
			setProducts(response?.data?.data);
			setTotalPages(response?.data?.totalPages);
			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};





	const handelAddProductModal = () => {
		setShowAddModal(true);
	}

	const handleAddProduct = async (data) => {
		try {
			console.log(data);
			const response = await axios.post(`/api/addProduct/${auth?.user?.id}`, data, {
				headers: {
					'Content-Type': 'multipart/form-data', // Important for file upload
				},
			});
			if (response.status === 200) {
				toast("Product added successfully!", { type: "success" });
				setShowAddModal(false);
				fetchProducts(currentPage);
			} else {
				toast("Error adding product!", { type: "error" });
			}
		} catch (error) {
			toast("Error adding product!", { type: "error" });
			console.error('Error adding product:', error);
		}
	}

	const handelEditProductModal = (product) =>{
		setShowEditModal(true);
		setSelectedProduct(product);

	}

	const handleEditProduct = async(data) =>{
		try {
			console.log(data);
			const response = await axios.post(`/api/editProduct/${selectedProduct?.id}`, data);
			if (response.status === 200) {
				toast("Product updated successfully!", { type: "success" });
				setShowEditModal(false);
				fetchProducts(currentPage);
			} else {
				toast("Error updating product!", { type: "error" });
			}
		} catch (error) {
			toast("Error updating product!", { type: "error" });
			console.error('Error updating product:', error);
		}
	}

	const handelDeleteProductModal = (product) => {
		setShowDeleteModalOpen(true);
		setSelectedProduct(product);
	  }

	const handleDeleteProduct = async () => {
		try {
			console.log(selectedProduct);
		 const response = await axios.delete(`/api/deleteProduct/${selectedProduct?.id}`);

		 if (response.status === 200) {
			toast("Product deleted successfully!", { type: "success" });
			setShowDeleteModalOpen(false);
			fetchProducts(currentPage);
		 }
		} catch (error) {
		  toast("Error deleting product!", { type: "error" });
		  console.error('Error deleting product:', error);
		}
	  }



	useEffect(() => {

		(async () => await fetchProducts(currentPage))();
	}, [currentPage]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};


	return (
		<AuthenticatedLayout
			user={auth.user}
			header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
		>
			<Head title="Products" />
			<ToastContainer position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light" />


			<div className="py-12">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<div className='flex flex-row justify-between align-middle items-center'>
								<h3 className="text-lg font-semibold ">Product List:</h3>
								<button onClick={() => handelAddProductModal()} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
									<p>Add</p>
									<FontAwesomeIcon icon={faAdd} />
								</button>
							</div>

							{
                isLoading ?
                  <div className="flex items-center justify-center mt-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
                  </div>
                  : products?.length > 0 ?
                    (<div className="overflow-x-auto">
                      

                      <table className="min-w-full divide-y divide-gray-200 my-5">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">price (BDT)</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>

                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.map((product, index) => (
                            <tr key={product.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
							  <td className="px-6 py-4 whitespace-nowrap">
								<img src={`upload_image/${product.img_url}`} alt={product.img_url} className="w-12 h-12 object-cover" />
							  </td>

                              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
							  <td className="px-6 py-4 whitespace-nowrap">{formatToBanglaNumber(product.price)} </td>
							  <td className="px-6 py-4 whitespace-nowrap">{product.unit}</td>
							  <td className="px-6 py-4 whitespace-nowrap">{product.category_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{moment(product.created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <button onClick={() => handelEditProductModal(product)} className="text-blue-500 mr-2 px-2"><FontAwesomeIcon icon={faPen} /></button>
                                <button onClick={() => handelDeleteProductModal(product)} className="text-red-500"><FontAwesomeIcon icon={faTrash} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="flex justify-end mt-4 space-x-4">
                        <div className="flex items-center space-x-4">
                          <p>Total Pages: {totalPages}</p>
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                           <FontAwesomeIcon icon={faAngleLeft} />
                          </button>
                          <span>{currentPage}</span>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                          <FontAwesomeIcon icon={faAngleRight} />
                          </button>
                        </div>
                      </div>
                    

                    </div>) :
                    <div className='flex flex-col items-center justify-center'>
                      {/* <img src={noCategoriesImage} alt="No categories found" className="h-40 w-40 mb-4" /> */}
                      <FontAwesomeIcon icon={faBan} className="h-40 w-40 mb-4" />
                      <p className="text-lg font-semibold">No categories found.</p>
                    </div>
              }


						</div>
					</div>
				</div>
			</div>

			<DeleteModal show={showDeleteModal} toggleModal={setShowDeleteModalOpen} name={selectedProduct?.name} handleDeleteFunc={handleDeleteProduct} />
			<ProductAddModal show={showAddModal} toggleModal={setShowAddModal} handelAddFunc={handleAddProduct} auth={auth} />
			<ProductEditModal show={showEditModal} toggleModal={setShowEditModal} product={selectedProduct} handelEditFunc={handleEditProduct} auth= {auth}/>
		</AuthenticatedLayout>
	)
}

export default Products;