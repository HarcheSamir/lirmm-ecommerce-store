import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';
import { returnRequestSchema } from '../../utils/schemas';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { useImageStore } from '../../store/imageStore';
import {
    PiSpinnerGap, PiCube, PiX, PiPackage, PiCheckCircle,
    PiArrowCounterClockwise, PiPaperPlaneRight, PiImage, PiChatText, PiUserCircle, PiLinkSimple, PiPaperclip,
    PiXCircle // <-- Restored Icon
} from 'react-icons/pi';

const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;
const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

const TimelineNode = ({ label, isActive }) => (
    <div className="flex flex-col items-center z-10">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'bg-gray-800' : 'bg-gray-300'}`} />
        <p className={`mt-2 text-xs font-semibold ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>{label}</p>
    </div>
);

const Timeline = ({ status }) => {
    const statusMap = { PENDING: 0, SHIPPED: 1, DELIVERED: 2 };
    const currentIndex = statusMap[status] ?? -1;
    return (
        <div className="relative flex justify-between items-center w-full max-w-sm mx-auto">
            <div className="absolute top-2.5 left-0 w-full h-0.5 bg-gray-300" />
            <div
                className="absolute top-2.5 left-0 h-0.5 bg-gray-800 transition-all duration-500"
                style={{ width: `${(currentIndex / 2) * 100}%` }}
            />
            <TimelineNode label="PENDING" isActive={currentIndex >= 0} />
            <TimelineNode label="SHIPPED" isActive={currentIndex >= 1} />
            <TimelineNode label="DELIVERED" isActive={currentIndex >= 2} />
        </div>
    );
};

const ReturnModal = ({ order, isOpen, onClose }) => {
    const { createReturnRequest, isLoading } = useOrderStore();
    const { uploadImage, isUploading } = useImageStore();
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useFormWithValidation(returnRequestSchema, { items: [] });
    const [selectedItems, setSelectedItems] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);

    const handleItemToggle = (itemId, quantity) => {
        const isSelected = selectedItems.some(item => item.orderItemId === itemId);
        const newItems = isSelected ? selectedItems.filter(item => item.orderItemId !== itemId) : [...selectedItems, { orderItemId: itemId, quantity }];
        setSelectedItems(newItems);
        setValue('items', newItems, { shouldValidate: true });
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setImageFiles(prev => [...prev, ...files]);
        const previews = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        setImagePreviews(prev => [...prev, ...previews]);
    };

    const removeImage = (fileToRemove) => {
        setImageFiles(prev => prev.filter(f => f !== fileToRemove));
        setImagePreviews(prev => {
            const previewToRemove = prev.find(p => p.file === fileToRemove);
            if (previewToRemove) URL.revokeObjectURL(previewToRemove.url);
            return prev.filter(p => p.file !== fileToRemove);
        });
    };

    const onSubmit = async (data) => {
        const uploadPromises = imageFiles.map(file => uploadImage(file));
        const imageUrls = (await Promise.all(uploadPromises)).filter(Boolean);
        
        const requestCreated = await createReturnRequest(order.id, data.reason, data.items, imageUrls, order.guest_token);
        if (requestCreated) {
            reset();
            setSelectedItems([]);
            setImageFiles([]);
            setImagePreviews([]);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Request a Return</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100"><PiX/></button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-3">
                            {order.items.map(item => {
                                const isSelected = selectedItems.some(si => si.orderItemId === item.id);
                                return ( <div key={item.id} onClick={() => handleItemToggle(item.id, item.quantity)} className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer ${isSelected ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}> <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-cover rounded-md" /> <div className="flex-grow"> <p className="font-semibold text-gray-800">{item.productName}</p> <p className="text-xs text-gray-500">Qty: {item.quantity}</p> </div> <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-gray-800 border-gray-800' : 'border border-gray-300'}`}>{isSelected && <PiCheckCircle className="text-white text-xs"/>}</div> </div> )})}
                        </div>
                        {errors.items && <p className="text-xs text-red-500 mt-1">{errors.items.message}</p>}
                        <div>
                            <label htmlFor="reason" className="text-sm font-medium text-gray-700">Reason for return</label>
                            <textarea id="reason" {...register('reason')} rows="4" className={`mt-1 w-full p-2 border rounded-md ${errors.reason ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                            {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
                        </div>
                         <div>
                            <label className="text-sm font-medium flex items-center gap-2 text-gray-700"><PiImage/> Upload Images (Optional)</label>
                            <div onClick={() => fileInputRef.current?.click()} className="mt-1 p-4 border-2 border-dashed rounded-md text-center text-gray-500 hover:border-gray-800 hover:text-gray-800 cursor-pointer">Click to select files</div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden"/>
                            {imagePreviews.length > 0 && <div className="mt-2 grid grid-cols-4 gap-2">
                                {imagePreviews.map(p => <div key={p.url} className="relative"><img src={p.url} className="w-full h-20 object-cover rounded" /><button onClick={() => removeImage(p.file)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"><PiX size={10}/></button></div>)}
                            </div>}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">Cancel</button>
                        <button type="submit" disabled={isLoading || isUploading} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black disabled:opacity-50 font-semibold text-sm">
                            {isUploading ? 'Uploading...' : isLoading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ReturnDetails = ({ returnRequest, guestToken }) => {
    const { createReturnRequestComment, isLoading } = useOrderStore();
    const { uploadImage, isUploading } = useImageStore();
    const [comment, setComment] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const commentsEndRef = useRef(null);

    useEffect(() => { commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [returnRequest.comments]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim() && !imageFile) return;

        let imageUrl = null;
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
            if (!imageUrl) return;
        }
        
        const success = await createReturnRequestComment(returnRequest.id, comment, imageUrl, guestToken);
        if (success) {
            setComment('');
            removeImage();
        }
    };

    return (
        <div className="mt-6 bg-white shadow-md rounded-lg" id="return-section">
            <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Return Request #{returnRequest.id.substring(0,8).toUpperCase()}</h2>
                <p className="text-sm text-gray-500">Status: <span className="font-medium text-gray-800">{returnRequest.status.replace(/_/g, ' ')}</span></p>
            </div>
            <div className="p-6 space-y-6">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {returnRequest.comments.map(c => (
                         <div key={c.id} className={`flex gap-4 ${c.authorName !== 'Guest' ? 'justify-end' : ''}`}>
                            {c.authorName === 'Guest' && <PiUserCircle className="text-4xl text-gray-400 shrink-0"/>}
                            <div className={`max-w-md ${c.authorName !== 'Guest' ? 'text-right' : ''}`}>
                                <p className="font-semibold text-sm text-gray-800">{c.authorName} <span className="text-xs text-gray-400 font-normal ml-2">{formatDate(c.createdAt)}</span></p>
                                <div className={`mt-1 text-sm p-3 rounded-lg ${c.authorName !== 'Guest' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                    {c.commentText && <p>{c.commentText}</p>}
                                    {c.imageUrl && <a href={c.imageUrl} target="_blank" rel="noopener noreferrer"><img src={c.imageUrl} alt="comment attachment" className="mt-2 rounded-md max-w-xs"/></a>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={commentsEndRef} />
                </div>
                 <form onSubmit={handleCommentSubmit} className="border-t pt-4">
                    {imagePreview && <div className="relative w-24 h-24 mb-2"><img src={imagePreview} className="w-full h-full object-cover rounded"/><button type="button" onClick={removeImage} className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5"><PiX size={10}/></button></div>}
                    <div className="flex items-center gap-3">
                        <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Type your reply..." className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:ring-gray-800 focus:border-gray-800 text-sm"/>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-500 rounded-full hover:bg-gray-100"><PiPaperclip size={20} /></button>
                        <button type="submit" disabled={isLoading || isUploading} className="p-3 bg-gray-800 text-white rounded-full hover:bg-black disabled:opacity-50">
                            {isUploading ? <PiSpinnerGap className="animate-spin"/> : <PiPaperPlaneRight size={20} />}
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
    const { isAuthenticated } = useAuthStore();
    // highlight-start
    const { order, isLoading, fetchGuestOrder, cancelOrder, clearCurrentOrder } = useOrderStore();
    // highlight-end
    const [isReturnModalOpen, setReturnModalOpen] = useState(false);
    
    const orderIdFromUrl = searchParams.get('orderId');
    const tokenFromUrl = searchParams.get('token');
    const returnFocus = searchParams.get('returnFocus');

    useEffect(() => {
        clearCurrentOrder();
        if (orderIdFromUrl && tokenFromUrl) {
            fetchGuestOrder(orderIdFromUrl, tokenFromUrl);
        } else if (orderIdFromUrl && isAuthenticated) {
             navigate(`/account/orders`);
        }
    }, [orderIdFromUrl, tokenFromUrl, isAuthenticated, fetchGuestOrder, clearCurrentOrder, navigate]);

    useEffect(() => {
        if (returnFocus && order) {
            setTimeout(() => { document.getElementById('return-section')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
        }
    }, [returnFocus, order]);

    // highlight-start
    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            await cancelOrder(order.id, order.guest_token);
        }
    };
    // highlight-end

    if (isLoading || (!order && tokenFromUrl)) {
        return <div className="flex h-screen items-center justify-center"><PiSpinnerGap className="animate-spin text-4xl text-gray-800" /></div>;
    }

    if (order) {
        const hasReturnRequest = order.returnRequests && order.returnRequests.length > 0;
        return (
            <div className="bg-gray-100 min-h-screen font-sans">
                <ReturnModal order={order} isOpen={isReturnModalOpen} onClose={() => setReturnModalOpen(false)} />
                <div className="max-w-2xl mx-auto py-12 px-4">
                    <div className="text-center mb-8">
                        <PiCube className="mx-auto text-4xl text-gray-800 mb-2"/>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order #{order.id.substring(0,8).toUpperCase()}</h1>
                        <p className="text-sm text-gray-600">Current Status: <span className="font-semibold text-gray-800">{order.status.replace('_', ' ')}</span></p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-8 mb-6"><Timeline status={order.status} /></div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {order.items.map(item => (<div key={item.id} className="flex items-center gap-4"><img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-md border"/><div className="flex-grow"><p className="font-semibold text-gray-800">{item.productName}</p><p className="text-sm text-gray-500">Qty: {item.quantity}</p></div><p className="font-semibold text-gray-800">{formatCurrency(item.priceAtTimeOfOrder * item.quantity)}</p></div>))}
                        </div>
                        <div className="pt-4 mt-4 border-t text-right"><p className="text-lg font-bold text-gray-900">Total: {formatCurrency(order.totalAmount)}</p></div>
                    </div>
                    {/*// highlight-start*/}
                    {hasReturnRequest ? (
                        <ReturnDetails returnRequest={order.returnRequests[0]} guestToken={order.guest_token} />
                    ) : (
                        <div className="mt-8 flex justify-center items-center gap-4">
                            {order.isCancellable && (
                                <button onClick={handleCancel} className="px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 flex items-center gap-2 text-sm">
                                    <PiXCircle /> Cancel Order
                                </button>
                            )}
                            {order.isReturnable && (
                                <button onClick={() => setReturnModalOpen(true)} className="px-6 py-3 bg-gray-800 text-white rounded-md font-semibold hover:bg-black flex items-center gap-2 text-sm">
                                    <PiArrowCounterClockwise /> Request a Return
                                </button>
                            )}
                        </div>
                    )}
                    {/*// highlight-end*/}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-md mx-auto py-16 px-4 text-center">
                <PiLinkSimple className="mx-auto text-5xl text-gray-400 mb-4"/>
                <h2 className="text-2xl font-bold text-gray-800">Invalid or Missing Link</h2>
                <p className="mt-2 text-gray-600">To view your order details, please use the secure link provided in your order confirmation email. This page cannot be accessed directly.</p>
                <div className="mt-6"><Link to="/" className="text-sm font-medium text-gray-800 hover:text-black">&larr; Back to homepage</Link></div>
            </div>
        </div>
    );
}