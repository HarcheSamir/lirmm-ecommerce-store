import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore'; // <-- IMPORT AUTH STORE
import { useFormWithValidation } from '../hooks/useFormWithValidation';
import { checkoutSchema } from '../utils/schemas';
import { FiInfo, FiCreditCard, FiHome, FiTruck, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-toastify';

const FormInput = ({ label, name, register, error, optional = false, ...props }) => (
    <div className="relative">
        <input id={name} className={`w-full px-3 py-2.5 text-sm text-gray-900 bg-white rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary peer`} {...register(name)} {...props} />
        <label htmlFor={name} className={`absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2.5 left-3 z-10 origin-[0] bg-white px-1 peer-focus:text-primary ${error ? 'peer-focus:text-red-500' : ''}`} > {label} {optional && '(optional)'} </label>
        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
);

const OrderSummaryItem = ({ item }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidde">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
            </div>
            <div>
                <p className="font-medium text-sm text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{Object.values(item.attributes).filter(v => typeof v === 'string').join(' / ')}</p>
            </div>
        </div>
        <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
    </div>
);


export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart } = useCartStore();
    const { createOrder, isLoading } = useOrderStore();
    const { isAuthenticated } = useAuthStore(); // <-- GET AUTH STATE
    const [deliveryMethod, setDeliveryMethod] = useState('ship');
    const [paymentMethod, setPaymentMethod] = useState('creditCard');

    const subtotal = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const shippingCost = subtotal > 0 && deliveryMethod === 'ship' ? 9.18 : 0;
    const taxes = (subtotal + shippingCost) * 0.10;
    const total = subtotal + shippingCost;

    const { register, handleSubmit, formState: { errors }, trigger, getValues } = useFormWithValidation(checkoutSchema, {
        defaultValues: { country: 'Armenia', paymentMethod: 'creditCard' }
    });

    useEffect(() => {
        trigger();
    }, [paymentMethod, trigger]);

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
    };

    const onSubmit = async () => {
        const fieldsToValidate = ['email'];
        if (!isAuthenticated) {
            fieldsToValidate.push('guestFullName');
        }
        if (deliveryMethod === 'ship') {
            fieldsToValidate.push('country', 'firstName', 'lastName', 'address', 'postalCode', 'city');
        }
        if (paymentMethod === 'creditCard') {
            fieldsToValidate.push('cardHolder', 'cardNumber', 'cardExpiry', 'cardCvc');
        }

        const isValid = await trigger(fieldsToValidate);

        if (!isValid) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        const data = getValues();

        if (!cart || cart.items.length === 0) {
            return toast.error("Your cart is empty.");
        }

        const orderData = {
            guestEmail: data.email,
            guestName: !isAuthenticated ? data.guestFullName : null, // <-- USE NEW FIELD
            shippingAddress: deliveryMethod === 'ship' ? { country: data.country, firstName: data.firstName, lastName: data.lastName, address: data.address, apartment: data.apartment, postalCode: data.postalCode, city: data.city, } : null,
            paymentMethod: paymentMethod === 'creditCard' ? 'CREDIT_CARD' : 'CASH_ON_DELIVERY',
            items: cart.items.map(item => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity, price: item.price, name: item.name, imageUrl: item.imageUrl, attributes: item.attributes, })),
        };
        const result = await createOrder(orderData);
        if (result.success) {
            navigate(`/order-confirmation/${result.orderId}`);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-6">You can't proceed to checkout without any items.</p>
                <Link to="/" className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-fblack">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="font-sans bg-white min-h-screen">
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="lg:col-span-1 lg:border-r border-gray-200 lg:pr-12 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="max-w-lg mx-auto lg:mx-0 lg:ml-auto">
                            <div className="text-center py-8">
                                <h1 className="text-3xl font-semibold">Checkout</h1>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-lg font-medium text-gray-800">Billing details</h2>

                                <div className="space-y-2">
                                    <h3 className="text-base font-medium">Contact</h3>
                                    <FormInput name="email" label="Email" register={register} error={errors.email} type="email" />
                                    
                                    {!isAuthenticated && (
                                        <FormInput name="guestFullName" label="Full Name" register={register} error={errors.guestFullName} />
                                    )}

                                    <div className="flex items-center"><input type="checkbox" id="newsletter" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" /><label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">Email me with news and offers</label></div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-base font-medium">Delivery</h3>
                                    <div className="space-y-3">
                                        <div onClick={() => setDeliveryMethod('ship')} className={`p-3 border rounded-md flex items-center justify-between cursor-pointer ${deliveryMethod === 'ship' ? 'bg-blue-50 border-primary ring-1 ring-primary' : 'border-gray-300'}`}><div className="flex items-center gap-3"><input type="radio" checked={deliveryMethod === 'ship'} readOnly className="h-4 w-4 text-primary focus:ring-primary" /><span>Ship</span></div><FiTruck /></div>
                                        <div onClick={() => setDeliveryMethod('pickup')} className={`p-3 border rounded-md flex items-center justify-between cursor-pointer ${deliveryMethod === 'pickup' ? 'bg-blue-50 border-primary ring-1 ring-primary' : 'border-gray-300'}`}><div className="flex items-center gap-3"><input type="radio" checked={deliveryMethod === 'pickup'} readOnly className="h-4 w-4 text-primary focus:ring-primary" /><span>Pickup in store</span></div><FiHome /></div>
                                    </div>
                                </div>

                                {deliveryMethod === 'ship' && (
                                    <div className="space-y-4 pt-2">
                                        <select name="country" {...register('country')} className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"><option value="Armenia">Armenia</option><option value="USA">United States</option></select>
                                        <div className="grid grid-cols-2 gap-4"><FormInput name="firstName" label="First name" optional register={register} error={errors.firstName} /><FormInput name="lastName" label="Last name" register={register} error={errors.lastName} /></div>
                                        <FormInput name="address" label="Address" register={register} error={errors.address} />
                                        <FormInput name="apartment" label="Apartment, suite, etc." optional register={register} error={errors.apartment} />
                                        <div className="grid grid-cols-2 gap-4"><FormInput name="postalCode" label="Postal code" optional register={register} error={errors.postalCode} /><FormInput name="city" label="City" register={register} error={errors.city} /></div>
                                        <div className="flex items-center"><input type="checkbox" id="save-info" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" /><label htmlFor="save-info" className="ml-2 block text-sm text-gray-700">Save this information for next time</label></div>
                                    </div>
                                )}

                                 {deliveryMethod === 'ship' && (
                                    <div className="space-y-2">
                                        <h3 className="text-base font-medium">Shipping method</h3>
                                        <div className="p-3 border rounded-md flex items-center justify-between bg-gray-100"><span>Standard</span><span className="font-medium">${shippingCost.toFixed(2)}</span></div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h3 className="text-base font-medium">Payment</h3>
                                    <p className="text-xs text-gray-500">All transactions are secure and encrypted.</p>
                                    <div className="border border-gray-300 rounded-lg">
                                        <div onClick={() => handlePaymentChange('creditCard')} className={`p-3 cursor-pointer flex items-center justify-between ${paymentMethod === 'creditCard' ? 'bg-blue-50' : ''}`}><div className="flex items-center gap-3"><FiCreditCard/><span>Credit card</span></div><div className="w-6 h-4 bg-yellow-500 text-white flex items-center justify-center text-[10px] font-bold rounded-sm">B</div></div>
                                        {paymentMethod === 'creditCard' && (
                                            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                                                <FormInput name="cardNumber" label="Card number" register={register} error={errors.cardNumber} />
                                                <div className="grid grid-cols-2 gap-4"><FormInput name="cardExpiry" label="Expiration date (MM / YY)" register={register} error={errors.cardExpiry} /><FormInput name="cardCvc" label="Security code" register={register} error={errors.cardCvc} /></div>
                                                <FormInput name="cardHolder" label="Name on card" register={register} error={errors.cardHolder} />
                                                <div className="flex items-center pt-2"><input type="checkbox" id="billing-address" defaultChecked className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" /><label htmlFor="billing-address" className="ml-2 block text-sm text-gray-700">Use shipping address as billing address</label></div>
                                            </div>
                                        )}
                                        <div onClick={() => handlePaymentChange('cashOnDelivery')} className={`p-3 cursor-pointer flex items-center gap-3 border-t border-gray-200 ${paymentMethod === 'cashOnDelivery' ? 'bg-blue-50' : ''}`}>
                                            <FiDollarSign />
                                            <span>Cash on Delivery</span>
                                        </div>
                                    </div>
                                </div>
                                <input {...register('paymentMethod')} type="hidden" value={paymentMethod} />
                            </div>
                            <div className="mt-8 pt-4 border-t border-gray-200">
                                 <div className="flex justify-start items-center gap-4 text-xs text-primary">
                                    <Link to="/refund-policy" className="hover:underline">Refund policy</Link>
                                    <Link to="/shipping-policy" className="hover:underline">Shipping policy</Link>
                                    <Link to="/privacy-policy" className="hover:underline">Privacy policy</Link>
                                    <Link to="/terms-of-service" className="hover:underline">Terms of service</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-gray-100 lg:pl-12 px-4 sm:px-6 lg:px-8 py-8">
                         <div className="max-w-lg mx-auto lg:mx-0 sticky top-10">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">Your order</h2>
                            <div className="space-y-2">
                               {cart.items.map(item => <OrderSummaryItem key={item.itemId} item={item} />)}
                            </div>
                            <div className="py-4 border-t border-b my-4 space-y-2">
                                <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span>Shipping</span><span>{deliveryMethod === 'ship' ? `$${shippingCost.toFixed(2)}` : 'Calculated at next step'}</span></div>
                            </div>
                            <div className="flex justify-between items-center font-semibold">
                                <span>Total</span>
                                <span className="text-2xl">${total.toFixed(2)}</span>
                            </div>
                             <p className="text-xs text-gray-500 mt-1">Including ${taxes.toFixed(2)} in taxes</p>

                            <div className="mt-6">
                                <button type="submit" disabled={isLoading} className="bg-primary w-full text-white py-3.5 px-6 rounded-md font-semibold hover:bg-fblack disabled:bg-gray-400">
                                    {isLoading ? 'Placing Order...' : (paymentMethod === 'creditCard' ? 'Pay now' : 'Complete order')}
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
            </form>
        </div>
    );
}