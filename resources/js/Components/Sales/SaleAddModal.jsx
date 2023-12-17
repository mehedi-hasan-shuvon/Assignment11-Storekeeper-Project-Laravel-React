import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faClose, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';

const SaleAddModal = ({ show, toggleModal, sale, auth }) => {
	const [saleDetails, setSaleDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const componentRef = useRef();

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	const fetchSaleDetails = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(`/api/getSaleDetails/${sale?.id}`);


			setSaleDetails(response?.data);
			setIsLoading(false);


		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}

	useEffect(() => {
		if (show == true) {
			(async () => await fetchSaleDetails())();
		}
	}, [show]);

	console.log(saleDetails);

	return (
		<>
			{show && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white rounded-lg shadow-md overflow-hidden w-2/3">
						<div className="bg-gray-200 py-4 px-6 flex items-center justify-between">
							<h2 className="text-lg font-semibold">Sale Details</h2>
							<div className="flex space-x-2">
								<button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
									<p>Print</p>
									<FontAwesomeIcon icon={faPrint} />
								</button>
								<button onClick={() => toggleModal(false)} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
									<p>Close</p>
									<FontAwesomeIcon icon={faClose} />
								</button>
							</div>
						</div>
						<div className="p-6" ref={componentRef}>
							<div className="flex flex-col space-y-4">
								<div>
									<h3 className="text-lg font-semibold mb-2 text-center">Sale Information</h3>
									<hr />
									<div className="grid grid-cols-2 gap-4">
										<p>
											<span className="font-semibold">Sale ID:</span> {sale.id}
										</p>
										<p>
											<span className="font-semibold">Current Date-Time:</span> {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}
										</p>
										<p>
											<span className="font-semibold">Customer Name:</span> {sale.customer_name}
										</p>
										<p>
											<span className="font-semibold">Sale Date-Time:</span> {moment(sale.created_at).format('MMMM Do YYYY, h:mm:ss a')}
										</p>
										<p>
											<span className="font-semibold">Customer Address:</span> {sale.customer_address}
										</p>
										<p>
											<span className="font-semibold">Customer Phone:</span> {sale.customer_phone}
										</p>
										<p>
											<span className="font-semibold">Total Price:</span> {sale.total} TK
										</p>
									</div>

									<h3 className="text-lg font-semibold mb-2 text-center">Product Details</h3>
									<hr />

									{/* Add product details */}

								</div>

								{
									isLoading ?
										<div className="flex items-center justify-center mt-4">
											<div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
										</div>
										: saleDetails?.length > 0 ?
											(<div className="overflow-x-auto">


												<table className="min-w-full divide-y divide-gray-200 my-5">
													<thead className="bg-gray-50">
														<tr>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Unit</th>
															<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Unit Price</th>
															<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Product Unit Price</th>



														</tr>
													</thead>
													<tbody className="bg-white divide-y divide-gray-200">
														{saleDetails.map((saleDetail, index) => (
															<tr key={saleDetail.id}>
																<td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>

																<td className="px-6 py-4 whitespace-nowrap">{saleDetail.product_name}</td>
																<td className="px-6 py-4 whitespace-nowrap">{saleDetail.qty}</td>
																<td className="px-6 py-4  whitespace-nowrap">{saleDetail.sale_price} </td>
																<td className="px-6 py-4 text-right whitespace-nowrap">{saleDetail.sale_price * saleDetail.qty} TK</td>




															</tr>
														))}
														<tr>
															<td colSpan="4" className="px-6 py-4 text-right font-semibold">
																Total:
															</td>
															<td className="px-6 py-4 text-right font-semibold">
																{/* Calculate total */}
																{saleDetails.reduce(
																	(total, saleDetail) =>
																		total + parseFloat(saleDetail.sale_price) * parseFloat(saleDetail.qty),
																	0
																)} TK
															</td>
														</tr>
														<tr>
															<td colSpan="4" className="px-6 py-4 text-right font-semibold">
																Vat:
															</td>
															<td className="px-6 py-4 text-right font-semibold">

																{sale.vat}%
															</td>
														</tr>
														<tr>
															<td colSpan="4" className="px-6 py-4 text-right font-semibold">
																Discount:
															</td>
															<td className="px-6 py-4 text-right font-semibold">

																{sale.discount}%
															</td>
														</tr>
														<tr>
															<td colSpan="4" className="px-6 py-4 text-right font-semibold">
																Net Total:
															</td>
															<td className="px-6 py-4 text-right font-semibold">

																{sale.total} TK
															</td>
														</tr>



													</tbody>
												</table>





												<div className="grid grid-cols-2 gap-4">
													<p>
														<span className="font-semibold">Issued By:</span>{auth && auth.user ? auth.user.name : ''} ({auth && auth.user ? auth.user.email : ''})
													</p>
												</div>




											</div>) :
											<div className='flex flex-col items-center justify-center'>
												{/* <img src={noCategoriesImage} alt="No categories found" className="h-40 w-40 mb-4" /> */}
												<FontAwesomeIcon icon={faBan} className="h-40 w-40 mb-4" />
												<p className="text-lg font-semibold">No Product Details found.</p>
											</div>
								}


							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default SaleAddModal;
