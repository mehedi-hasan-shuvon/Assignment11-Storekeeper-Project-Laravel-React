import React from 'react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const UserCom = ({ auth}) => {


	useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/getAllUsers'); // Replace with your API endpoint
				console.log(response);

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);


  return (
		<>
		<AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
			 <Head title="Users" />
		</AuthenticatedLayout>
		<h1>Hello </h1>
		</>
		

  )
}

export default UserCom;