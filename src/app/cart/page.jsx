
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, CheckCircle } from "lucide-react";
import { reset, resetAll } from "@/redux/cartSlice";
import { getAllBlogPosts } from "@/lib/blog";
import Counter from "@/components/Counter";

export default function CartPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const posts = getAllBlogPosts;

  const cartProducts = posts.filter(({ slug }) => cartItems[slug] && cartItems[slug] > 0);
  const totalItems = Object.values(cartItems).reduce((sum, quantity) => sum + (quantity || 0), 0);
  const totalPrice = cartProducts.reduce((sum, product) => {
    const quantity = cartItems[product.slug] || 0;
    if (product.post && product.post.price) {
      const priceAmount = product.post.price.replace(/[^0-9.-]+/g, "");
      const price = parseFloat(priceAmount);
      return sum + (quantity * price);
    } else {
      console.warn(`Missing price for product ${product.slug}`);
      return sum;  
    }
  }, 0);

  const formattedTotalPrice = totalPrice.toFixed(2);


  const handleCheckout = () => {
    dispatch(resetAll());
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400">Start adding some awesome bikes to your cart!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        <div className="space-y-4">
          {cartProducts.map(({ slug, post }) => (
            <motion.div
              key={slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900 rounded-lg p-4 flex items-center gap-4"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={post.image[0]}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                <div className="flex items-center space-x-4 mt-3">
                  <p className="text-gray-400">
                    Price: {(cartItems[slug] * parseFloat(post.price.replace(/[^0-9.-]+/g, ""))).toFixed(2)}
                  </p>

                  <Counter postId={slug} />
                </div>
              </div>
              <button
                onClick={() => dispatch(reset(slug))}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-white">
            <p className="text-lg">Total Items: {totalItems}</p>
            <p className="text-lg">Total Price: {formattedTotalPrice}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Checkout
          </button>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Order placed successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}