import { FiCheckCircle, FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useReviewStore } from '../../store/reviewStore';
import StarRating from './StarRating';

export default function ReviewCard({ review, onEdit }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { user } = useAuthStore();
    const { deleteReview } = useReviewStore();

    const canModify = user && (user.id === review.user.id || user.role === 'ADMIN');
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className="py-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
                <img
                    src={review.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}&background=262C32&color=fff&size=48`}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">{review.user.name}</p>
                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <StarRating rating={review.rating} size="text-lg" />
                            {canModify && (
                                <div className="relative" ref={menuRef}>
                                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-800 p-1 rounded-full"><FiMoreVertical /></button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10 animate-scaleIn">
                                            <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <FiEdit size={14} /> Edit
                                            </button>
                                            <button onClick={() => deleteReview(review.id, review.product.id)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                <FiTrash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {review.isVerifiedPurchase && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                            <FiCheckCircle />
                            <span>Verified Purchase</span>
                        </div>
                    )}
                    <h4 className="font-semibold text-md text-gray-900 mt-3">{review.title}</h4>
                    <p className="text-gray-600 mt-1 leading-relaxed">{review.comment}</p>
                </div>
            </div>
        </div>
    );
}