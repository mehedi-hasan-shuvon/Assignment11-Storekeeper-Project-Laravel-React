import { formatToBanglaNumber } from '@/Components/CommonFunctions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

export default function Dashboard({ auth }) {

    const [salesStats, setSalesStats] = useState([{ title: "Today", count: 0 },
    { title: "Yesterday", count: 0 },
    { title: "This Month", count: 0 },
    { title: "Last Month", count: 0 }]);

    const [chartData, setChartData] = useState([]);
    const fetchSalesStats = async () => {

        try {
            const response = await axios.get(`/api/getSalesStats/${auth?.user?.id}`);
            // setSalesStats(response?.data);
            console.log(response?.data);
            setSalesStats([
                { title: "Today", count: response?.data?.todaySalesTotal },
                { title: "Yesterday", count: response?.data?.yesterdaySalesTotal },
                { title: "This Month", count: response?.data?.thisMonthsSalesTotal },
                { title: "Last Month", count: response?.data?.lastMonthsSalesTotal },
            ])

        } catch (error) {
            console.error('Error fetching sales stats:', error);
        }
    }

    const fetchMonthlySales = async () => {
        try {

            const response = await axios.get(`/api/getMonthlySales/${auth?.user?.id}`);

            setChartData(response?.data);

        } catch (error) {
            console.error('Error fetching monthly sales:', error);
        }

    }


    useEffect(() => {

        const fetchData = async () => {
            await Promise.all([fetchSalesStats(), fetchMonthlySales()]);
          };

        fetchData();
    }, []);

    const options = {
        chart: {
            id: 'monthly-sales-chart',
        },
        xaxis: {
            type: 'Date',
            categories: chartData.map(data => ` ${moment(data.sales_date).format('MMM Do')}`), // Assuming 'day' is the day number in data
        },
    };

    const series = [
        {
            name: 'Sales',
            data: chartData.map(data => data.total_sales),
        },
    ]


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />



            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {salesStats.map((data, index) => (
                        <SalesCard key={index} title={data.title} count={data.count} />
                    ))}
                </div>
            </div>

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        {/* chart section here */}
                            {
                                chartData.length === 0 ? (
                                    <p>No data available</p>
                                ) : (
                                    <Chart options={options} series={series} type="line" height={350} />
                                )
                            }
                           
                        
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
            <p className="text-3xl font-bold">{formatToBanglaNumber(count)} BDT</p>
        </div>
    );
};


