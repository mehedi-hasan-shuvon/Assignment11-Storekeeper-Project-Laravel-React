import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const salesData = [
        { title: "Today", count: 1 },
        { title: "Yesterday", count: 2 },
        { title: "This Month", count: 3 },
        { title: "Last Month", count: 4 },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />



            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {salesData.map((data, index) => (
                        <SalesCard key={index} title={data.title} count={data.count} />
                    ))}
                </div>
            </div>

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const SalesCard = ({ title, count }) => {
    // Assign different colors based on the title (you can customize these)
    const cardColors = {
        Today: 'bg-blue-200',
        Yesterday: 'bg-green-200',
        'This Month': 'bg-yellow-200',
        'Last Month': 'bg-pink-200',
    };

    const color = cardColors[title] || 'bg-gray-200'; // Default color if not found in the object

    return (
        <div className={`overflow-hidden shadow-sm sm:rounded-lg p-6 m-4 ${color}`}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-3xl font-bold">{count}</p>
        </div>
    );
};
