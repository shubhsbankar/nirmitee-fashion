'use client'
import WebsiteBreadCrumb from "@/components/application/website/WebsiteBreadCrumb"
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { addIntoCart, clearCart } from "@/store/reducer/cartReducer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyCouponSchema, orderFormSchema } from "@/lib/zodSchema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/application/ButtonLoading";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaShippingFast } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import Script from "next/script";
import { useRouter } from "next/navigation";
import loading from '@/public/assets/images/loading.svg';



const breadCrumb = {
  title: 'Checkout',
  links: [
    { label: "Checkout" }
  ]
}

const Checkout = () => {
  const router = useRouter();
  const cart = useSelector(store => store.cartStore);
  const auth = useSelector(store => store.authStore.auth);
  const dispatch = useDispatch();

  const [verifiedCartData, setVerifiedCartData] = useState([]);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savingOrder,setSavingOrder] = useState(false);

  const form = useForm({
    resolver: zodResolver(applyCouponSchema),
    defaultValues: {
      code: '',
      minShoppingAmount: subtotal,
    }
  });

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      landmark: '',
      ordernote: '',
      userId: auth?._id,
    }
  });

  useEffect(() => { 
    orderForm.setValue('userId',auth?._id)
  }, [auth]);


  const getOrderId = async (amount) => {
    try {
      const { data: orderIdData } = await axios.post('/api/payment/get-order-id', { amount });

      if (!orderIdData.success) {
        throw new Error(orderIdData.message);
      }
      return { success: true, order_id: orderIdData.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  const placeOrder = async (formData) => {
    setPlacingOrder(true);
    try {
      const orderId = await getOrderId(totalAmount);
      if (!orderId.success) {
        throw new Error(orderId.message);
      }
      const order_id = orderId.order_id;
      const razorOption = {
        "key": process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        "amount": totalAmount * 100,
        "currency": "INR",
        "name": "Nirmitee Fashion",
        "description": "Transaction for order",
        "image": "https://res.cloudinary.com/dwcgtu013/image/upload/v1766295854/NFLogo_btkay3.webp",
        "order_id": order_id,
        handler: async function (response) {
        setSavingOrder(true)
          const products = verifiedCartData.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            qty: item.qty,
            name: item.name,
            mrp: item.mrp,
            sellingPrice: item.sellingPrice
          }));
          const { data: paymentResponseData } = await axios.post('/api/payment/save-order', {
            ...formData,
            ...response,
            products,
            subtotal,
            discount,
            couponDiscountAmount,
            totalAmount
          });
          if (paymentResponseData.success) {
            showToast('success', paymentResponseData.message);
            dispatch(clearCart());
            orderForm.reset();
            router.push(WEBSITE_ORDER_DETAILS(response.razorpay_order_id));
          setSavingOrder(false);
          } else {
          setSavingOrder(false);
            showToast('error', paymentResponseData.message);
          }

        },
        "prefill": {
          "name": formData.name,
          "email": formData.email,
          "contact": formData.phone,
        },
        "theme": {
          "color": "#7c3aed"
        }
      };

      const razor = new Razorpay(razorOption);
      razor.on('payment.failed', function (response) {
        showToast('error', response.error.description);
      });
      razor.open();
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setPlacingOrder(false)
    }

  }

  const { data: getVerifiedCartData } = useFetch('/api/cart-verification', 'POST', { data: cart.products });

  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = getVerifiedCartData.data;
      setVerifiedCartData(cartData);
      dispatch(clearCart());
      cartData.forEach((cartItem) => {
        dispatch(addIntoCart(cartItem));
      });
    }
  }, [getVerifiedCartData]);



  useEffect(() => {
    const cartProducts = cart.products;
    const totalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0);
    const discountAmount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0);
    setSubtotal(totalAmount);
    setDiscount(discountAmount);
    setTotalAmount(totalAmount);
    form.setValue('minShoppingAmount', totalAmount);
  }, [cart]);

  const applyCoupon = async (values) => {
    setCouponLoading(true);
    try {
      const { data: response } = await axios.post('/api/coupon/apply', values);
      if (!response.success) {
        throw new Error(response.message);
      }
      const discountPercentage = response.data.discountPercentage;
      setCouponDiscountAmount((subtotal * discountPercentage) / 100);
      setTotalAmount(subtotal - ((subtotal * discountPercentage) / 100));
      showToast('success', response.message);
      setCouponCode(form.getValues('code'));
      setIsCouponApplied(true);
      form.resetField('code', '');
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setCouponLoading(false);
    }
  }


  const removeCoupon = () => {
    setIsCouponApplied(false);
    setCouponCode('');
    setCouponDiscountAmount(0);
    setTotalAmount(subtotal);
  }

  return (
    <div>
      {
        savingOrder && <div className="h-screen w-screen fixed top-0 left-0 z-50 bg-black/10">
          <div className="flex justify-center items-center h-screen">
            <Image src={loading.src} height={80} width={80} alt={'Loading'} />
            <h4 className="font-semibold">Order Confirming...</h4>
          </div>
        </div>
      }
      <WebsiteBreadCrumb props={breadCrumb} />
      {
        cart.count === 0
          ?
          <div className="w-screen h-[500px] flex justify-center items-center py-32">
            <div className="text-center">
              <h4 className="text-4xl font-semibold mb-5">Your cart is empty!</h4>
              <Button type="button" asChild>
                <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
          :
          <div className="flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4">
            <div className="lg:w-[60%] w-full">
              <div className="flex items-center gap-2 font-semibold">
                <FaShippingFast size={25} />
                Shipping Address:
              </div>
              <div className="mt-5">

                <Form {...orderForm}>
                  <form className="grid grid-cols-2 gap-5" onSubmit={orderForm.handleSubmit(placeOrder)}>
                    <div className="mb-3">
                      <FormField
                        control={orderForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Full name*"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3">
                      <FormField
                        control={orderForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type='email' placeholder="Email*"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3">
                      <FormField
                        control={orderForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Phone number*"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3">
                      <FormField
                        control={orderForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Country*"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3">
                      <FormField
                        control={orderForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="State*"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3">
                      <FormField
                        control={orderForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="City*"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3">
                      <FormField
                        control={orderForm.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Pincode*"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3">
                      <FormField
                        control={orderForm.control}
                        name="landmark"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Landmark*"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3 col-span-2">
                      <FormField
                        control={orderForm.control}
                        name="ordernote"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea placeholder="Order note" {...field}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="mb-3">
                      <ButtonLoading type={'submit'} text='Place Order' loading={placingOrder} className={'bg-black rounded-full px-5 cursor-pointer'} />
                    </div>
                  </form>
                </Form>
              </div>
            </div>
            <div className="lg:w-[40%] w-full">
              <div className="rounded bg-gray-50 p-5 sticky top-5">
                <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
                <div>
                  <table className="w-full border">
                    <tbody>
                      {
                        verifiedCartData && verifiedCartData?.map(product => (
                          <tr key={product.variantId}>
                            <td className="p-3">
                              <div className="flex items-center gap-5">
                                <Image
                                  src={product?.media}
                                  width={60}
                                  height={60}
                                  alt={product.name}
                                  className='rounded'
                                />
                                <div>
                                  <h4 className="font-medium line-clamp-1">
                                    <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                                  </h4>
                                  <p className="text-sm">Color: {product.color}</p>
                                  <p className="text-sm">Size: {product.size}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <p className="text-nowrap text-sm">{product.qty} x {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-medium py-2">Subtotal</td>
                        <td className="text-end py-2">
                          {subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium py-2">Discount</td>
                        <td className="text-end py-2">
                          -{discount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium py-2">Coupen Discount</td>
                        <td className="text-end py-2">
                          -{couponDiscountAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium py-2 text-xl">Total</td>
                        <td className="text-end py-2">
                          {totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-2 mb-5">
                    {
                      !isCouponApplied ?
                        <Form {...form}>
                          <form className="flex justify-between gap-5" onSubmit={form.handleSubmit(applyCoupon)}>
                            <div className="w-[calc(100%-100px)]">
                              <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input placeholder="Enter Coupon Code"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              ></FormField>
                            </div>
                            <div className="w-[100px]">
                              <ButtonLoading type={'submit'} text={'Apply'} loading={couponLoading} className={'w-full cursor-pointer'} />
                            </div>
                          </form>
                        </Form> :
                        <div className="flex justify-between py-1 px-5 rounded-lg bg-gray-200">
                          <div>
                            <span className="text-xs">Coupon:</span>
                            <p className="text-sm font-semibold">{couponCode}</p>
                          </div>
                          <button type="button" className="text-red-500 cursor-pointer" onClick={removeCoupon}>
                            <IoCloseCircleSharp size={25} />
                          </button>
                        </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
      }

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  )
}

export default Checkout
