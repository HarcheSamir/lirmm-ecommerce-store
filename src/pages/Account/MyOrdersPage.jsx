import React, { useEffect } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { Link } from 'react-router-dom';
import { PiPackage, PiSpinnerGap } from 'react-icons/pi';

const StatusBadge = ({ status }) => {
    const config = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        PAID: 'bg-blue-100 text-blue-800',
        SHIPPED: 'bg-indigo-100 text-indigo-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
        FAILED: 'bg-red-200 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config}`}>{status.replace('_', ' ')}</span>;
};

export default function MyOrdersPage() {
    const { orders, pagination, isLoading, fetchMyOrders } = useOrderStore();

    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="mt-2 text-sm text-gray-500">View your order history and track your purchases.</p>
                    
                    <div className="mt-8 bg-white shadow-sm sm:rounded-lg">
                        <div className="divide-y divide-gray-200">
                            {isLoading && orders.length === 0 ? (
                                <div className="p-10 flex justify-center items-center"><PiSpinnerGap className="animate-spin text-3xl text-primary" /></div>
                            ) : orders.length === 0 ? (
                                <div className="p-10 text-center text-gray-500">
                                    <PiPackage className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">You haven't placed any orders with us.</p>
                                    <div className="mt-6">
                                        <Link to="/shop" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-600">
                                            Start Shopping
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-primary">Order #{order.id.substring(0,8).toUpperCase()}</p>
                                                <p className="text-xs text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="mt-4 flex space-x-4 overflow-x-auto pb-2">
                                            {order.items.map(item => (
                                                <img key={item.id} src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                                            ))}
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-800">${parseFloat(order.totalAmount).toFixed(2)}</p>
                                            <Link to={`/track-order?orderId=${order.id}`} className="text-sm font-medium text-primary hover:text-blue-600">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}