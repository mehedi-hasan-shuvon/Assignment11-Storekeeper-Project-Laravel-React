import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faAngleLeft, faAngleRight, faBan, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '@/Components/DeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import CategoryEditModal from '@/Components/Category/CategoryEditModal';
import CategoryAddModal from '@/Components/Category/CategoryAddModal';





const Categories = ({ auth }) => {

  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModalOpen] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState({});

  const [showAddModal, setShowAddModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);


  const fetchCategories = async (page = 1) => {
    try {
      setIsLoading(true);
      // const response = await axios.get(`/api/getAllCategories/${auth?.user?.id}`); 
      const response = await axios.get(`/api/getAllCategories/${auth?.user?.id}`, {
        params: { page },
      });

      response
      setCategories(response?.data?.data);
      setTotalPages(response?.data?.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };



  const handelDeleteCategoriesModal = (category) => {
    setShowDeleteModalOpen(true);
    setSelectedCategory(category);
  }

  const handelEditCategoriesModal = (category) => {
    setShowEditModal(true);
    setSelectedCategory(category);
  }

  const handelAddCategoriesModal = () => {
    setShowAddModal(true);
  }

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(`/api/deleteCategory/${selectedCategory?.id}`);
      setShowDeleteModalOpen(false);
      fetchCategories(currentPage);
      toast("Category deleted successfully!", { type: "success" });
    } catch (error) {
      toast("Error deleting category!", { type: "error" });
      console.error('Error deleting category:', error);
    }
  }

  const handleEditCategory = async (newCategoryName) => {
    try {
      const response = await axios.post(`/api/editCategory/${selectedCategory?.id}`, { name: newCategoryName });
      console.log(response);
      if (response?.status === 200) {
        setShowEditModal(false);
        fetchCategories(currentPage);
        toast("Category updated successfully!", { type: "success" });
      }

    } catch (error) {
      toast("Error updating category!", { type: "error" });
      console.error('Error updating category:', error);
    }

  }

  const handleAddCategory = async (newCategoryName) => {
    try {
      const response = await axios.post(`/api/addCategory/${auth?.user?.id}`, { name: newCategoryName });
      console.log(response);
      if (response?.status === 200) {
        setShowAddModal(false);
        fetchCategories();
        toast("Category added successfully!", { type: "success" });
      }
    } catch (error) {
      toast("Error adding category!", { type: "error" });
      console.error('Error adding category:', error);
    }
  }



  useEffect(() => {

    (async () => await fetchCategories(currentPage))();
  }, [currentPage]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (

    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Categories</h2>}
    >
      <Head title="Users" />

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
                <h3 className="text-lg font-semibold ">Category List:</h3>
                <button onClick={() => handelAddCategoriesModal()} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                  <p>Add</p>
                  <FontAwesomeIcon icon={faAdd} />
                </button>
              </div>

              {
                isLoading ?
                  <div className="flex items-center justify-center mt-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
                  </div>
                  : categories?.length > 0 ?
                    (<div className="overflow-x-auto">
                      

                      <table className="min-w-full divide-y divide-gray-200 my-5">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {categories.map((category, index) => (
                            <tr key={category.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{moment(category.created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <button onClick={() => handelEditCategoriesModal(category)} className="text-blue-500 mr-2 px-2"><FontAwesomeIcon icon={faPen} /></button>
                                <button onClick={() => handelDeleteCategoriesModal(category)} className="text-red-500"><FontAwesomeIcon icon={faTrash} /></button>
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


      <DeleteModal show={showDeleteModal} toggleModal={setShowDeleteModalOpen} name={selectedCategory?.name} handleDeleteFunc={handleDeleteCategory} />
      <CategoryEditModal show={showEditModal} toggleModal={setShowEditModal} category={selectedCategory} handelEditFunc={handleEditCategory} />
      <CategoryAddModal show={showAddModal} toggleModal={setShowAddModal} handelAddFunc={handleAddCategory} />


    </AuthenticatedLayout>

  )
}

export default Categories;