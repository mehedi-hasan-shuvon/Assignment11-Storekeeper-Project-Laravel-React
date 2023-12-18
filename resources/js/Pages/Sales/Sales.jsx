import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faAngleLeft, faAngleRight, faBan, faPen, faTrash, faCartPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import SaleAddModal from '@/Components/Sales/SaleAddModal';
import NavLink from '@/Components/NavLink';
import { formatToBanglaNumber } from '@/Components/CommonFunctions';


const Sales = ({ auth }) => {
	const [sales, setSales] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const [showAddModal, setShowAddModal] = useState(false);
	const [selectedSale, setSelectedSale] = useState({});

	const fetchSales = async (page = 1) => {
		try {
			setIsLoading(true);
			// const response = await axios.get(`/api/getAllCategories/${auth?.user?.id}`); 
			const response = await axios.get(`/api/getSales/${auth?.user?.id}`, {
				params: { page },
			});


			setSales(response?.data?.data);
			setTotalPages(response?.data?.totalPages);
			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	useEffect(() => {

		(async () => await fetchSales(currentPage))();
	}, [currentPage]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handelSalesShowModal = (sale) => {
		setShowAddModal(true);
		setSelectedSale(sale);

	  }
	return (
		<AuthenticatedLayout
			user={auth.user}
			header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales</h2>}
		>
			<Head title="sales" />
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
								<h3 className="text-lg font-semibold ">Sales List:</h3>
								{/* <button href={route('dashboard')} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
									<p>Add</p>
									<FontAwesomeIcon icon={faAdd} />
								</button> */}
								<NavLink
									href={route('createSales')}
									className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-lg flex items-center space-x-2"
								>
									<p className='text-base'>Create Sales</p>
									<FontAwesomeIcon icon={faCartPlus} />
									
								</NavLink>
							</div>

							{
                isLoading ?
                  <div className="flex items-center justify-center mt-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
                  </div>
                  : sales?.length > 0 ?
                    (<div className="overflow-x-auto">
                      

                      <table className="min-w-full divide-y divide-gray-200 my-5">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>						
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total price (BDT)</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>

                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sales.map((sale, index) => (
                            <tr key={sale.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
							  <td className="px-6 py-4 whitespace-nowrap">{sale.invoice_id} </td>
                              <td className="px-6 py-4 whitespace-nowrap">{sale.customer_name}</td>
							  <td className="px-6 py-4 whitespace-nowrap">{formatToBanglaNumber(sale.total)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{moment(sale.created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <button onClick={() => handelSalesShowModal(sale)} className="text-blue-500 mr-2 px-2"><FontAwesomeIcon icon={faEye} /></button>
                              
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
                      <p className="text-lg font-semibold">No sales found.</p>
                    </div>
              }


						</div>
					</div>
				</div>
			</div>



			<SaleAddModal show={showAddModal} toggleModal={setShowAddModal} sale={selectedSale}  auth={auth}/>


		</AuthenticatedLayout>
	)
}

export default Sales;