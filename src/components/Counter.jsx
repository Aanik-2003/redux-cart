// src/components/Counter.js
"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "../redux/cartSlice";

const Counter = ({ postId }) => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.cart.items[postId] || 0);

  return (
    <div className="flex gap-7 text-white">
      <div>Add to Cart</div>
      <button 
        onClick={() => dispatch(decrement(postId))}
        className="hover:text-red-500 transition-colors"
      >
        -
      </button>
      <span>{count}</span>
      <button 
        onClick={() => dispatch(increment(postId))}
        className="hover:text-red-500 transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default Counter;