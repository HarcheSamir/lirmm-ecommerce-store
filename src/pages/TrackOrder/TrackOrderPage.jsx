import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';
import { trackOrderSchema, returnRequestSchema } from '../../utils/schemas';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import {
    PiSpinnerGap, PiCube, PiX, PiPackage, PiCheckCircle, PiTruck, PiClock, PiXCircle,
    PiArrowCounterClockwise, PiPaperPlaneRight, PiImage
} from 'react-icons/pi';

const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

// A modal component for handling returns
const ReturnModal = ({ order, isOpen, onClose }) => {
    const { createReturnRequest, isLoading } = useOrderStore();
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useFormWithValidation(returnRequestSchema, { items: [] });
    const [selectedItems, setSelectedItems] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleItemToggle = (itemId, quantity) => {
        const isSelected = selectedItems.some(item => item.orderItemId === itemId);
        const newItems = isSelected
            ? selectedItems.filter(item => item.orderItemId !== itemId)
            : [...selectedItems, { orderItemId: itemId, quantity }];
        setSelectedItems(newItems);
        setValue('items', newItems);
    };

    const onSubmit = async (data) => {
        // Here you would upload images to image-service and get URLs
        // For now, we'll simulate this.
        const imageUrls = imagePreviews.map(p => p.url); // Placeholder
        const success = await createReturnRequest(order.id, data.reason, data.items, imageUrls, order.guest_token);
        if (success) {
            onClose();
        }
    };
    
    // ... Image handling logic would go here ...

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-lg font-medium">Request a Return</h3>
                    <button onClick={onClose}><PiX/></button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <p className="text-sm text-gray-600">Select the items you wish to return from order #{order.id.substring(0,8).toUpperCase()}.</p>
                        <div className="space-y-3">
                            {order.items.map(item => {
                                const isSelected = selectedItems.some(si => si.orderItemId === item.id);
                                return (
                                <div key={item.id} onClick={() => handleItemToggle(item.id, item.quantity)} className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer ${isSelected ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                                    <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-cover rounded-md" />
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-800">{item.productName}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary' : 'border'}`}>{isSelected && <PiCheckCircle className="text-white"/>}</div>
                                </div>
                            )})}
                        </div>
                        {errors.items && <p className="text-xs text-red-500">{errors.items.message}</p>}
                        
                        <div>
                            <label htmlFor="reason" className="text-sm font-medium">Reason for return</label>
                            <textarea id="reason" {...register('reason')} rows="4" className="mt-1 w-full p-2 border rounded-md"></textarea>
                            {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
                        </div>

                         <div>
                            <label className="text-sm font-medium flex items-center gap-2"><PiImage/> Upload Images (Optional)</label>
                            <div className="mt-1 p-4 border-2 border-dashed rounded-md text-center text-gray-500">
                                Image upload functionality coming soon.
                            </div>
                        </div>

                    </div>
                    <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                            {isLoading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function TrackOrderPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const { order, isLoading, fetchGuestOrder, cancelOrder, clearCurrentOrder } = useOrderStore();
    const { register, handleSubmit, formState: { errors } } = useFormWithValidation(trackOrderSchema);
    const [isReturnModalOpen, setReturnModalOpen] = useState(false);

    const orderIdFromUrl = searchParams.get('orderId');
    const tokenFromUrl = searchParams.get('token');

    useEffect(() => {
        clearCurrentOrder();
        if (orderIdFromUrl && tokenFromUrl) {
            fetchGuestOrder(orderIdFromUrl, tokenFromUrl);
        } else if (orderIdFromUrl && isAuthenticated) {
             // If user is logged in, they might be viewing their own order
             // This can be enhanced to fetch their own order by ID
             navigate(`/account/orders`); // For now, redirect to their list
        }
    }, [orderIdFromUrl, tokenFromUrl, isAuthenticated, fetchGuestOrder, clearCurrentOrder, navigate]);

    const onGuestFormSubmit = (data) => {
        navigate(`/track-order?orderId=${data.orderId}&token=${data.email}`); // Using email as token for guest lookup
    };
    
    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            await cancelOrder(order.id, order.guest_token);
        }
    };
    
    const Timeline = ({ status }) => {
        const statuses = ['PENDING', 'SHIPPED', 'DELIVERED'];
        const isCancelledOrFailed = ['CANCELLED', 'FAILED'].includes(status);
        const currentIndex = isCancelledOrFailed ? -1 : statuses.indexOf(status);
        const icons = { PENDING: PiClock, SHIPPED: PiTruck, DELIVERED: PiCheckCircle };
        
        return (
            <div className="flex justify-between items-start text-center">
                {statuses.map((s, i) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= currentIndex ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {/* < size={20}/> */}
                             </div>
                            <p className={`mt-2 text-xs font-medium ${i <= currentIndex ? 'text-gray-800' : 'text-gray-500'}`}>{s}</p>
                        </div>
                         {i < statuses.length - 1 && <div className={`flex-grow h-0.5 mt-5 ${i < currentIndex ? 'bg-primary' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                ))}
            </div>
        );
    };


    if (isLoading) {
        return <div className="p-10 flex justify-center"><PiSpinnerGap className="animate-spin text-3xl text-primary" /></div>;
    }

    if (order) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <ReturnModal order={order} isOpen={isReturnModalOpen} onClose={() => setReturnModalOpen(false)} />
                <div className="text-center">
                    <PiPackage className="mx-auto text-5xl text-primary mb-2"/>
                    <h1 className="text-2xl font-bold">Order #{order.id.substring(0,8).toUpperCase()}</h1>
                    <p className="text-gray-600">Current Status: <span className="font-semibold">{order.status.replace('_', ' ')}</span></p>
                </div>

                <div className="bg-white shadow-sm rounded-lg p-6 my-8">
                    <Timeline status={order.status} />
                </div>
                
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="divide-y">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 py-4">
                                <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-md"/>
                                <div className="flex-grow">
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">{formatCurrency(item.priceAtTimeOfOrder * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 mt-4 border-t text-right">
                        <p className="text-lg font-semibold">Total: {formatCurrency(order.totalAmount)}</p>
                    </div>
                </div>

                 <div className="mt-8 text-center space-x-4">
                    {order.isCancellable && (
                        <button onClick={handleCancel} className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Cancel Order</button>
                    )}
                    {order.isReturnable && (
                         <button onClick={() => setReturnModalOpen(true)} className="px-5 py-2.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-black flex items-center gap-2 justify-center mx-auto">
                            <PiArrowCounterClockwise/> Request a Return
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-16 px-4 text-center">
            <PiCube className="mx-auto text-5xl text-gray-400 mb-4"/>
            <h2 className="text-2xl font-bold text-gray-800">Track Your Order</h2>
            <p className="mt-2 text-gray-600">Enter your order details to see its status. The details can be found in your confirmation email.</p>
            <form onSubmit={handleSubmit(onGuestFormSubmit)} className="mt-8 space-y-4 text-left">
                <div>
                    <label htmlFor="orderId" className="font-medium">Order ID</label>
                    <input id="orderId" type="text" {...register('orderId')} className="mt-1 w-full p-3 border rounded-md" placeholder="e.g., c0ed8ebe-71f2-4652-8410-f0affd58d067"/>
                    {errors.orderId && <p className="text-xs text-red-500 mt-1">{errors.orderId.message}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="font-medium">Confirmation Email</label>
                    <input id="email" type="email" {...register('email')} className="mt-1 w-full p-3 border rounded-md" placeholder="you@example.com" />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <button type="submit" className="w-full p-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-600">Track Order</button>
            </form>
        </div>
    );
}