import React from 'react';
import { useGetCartQuery } from '../features/cart/cartApiSlice';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { selectCurrentToken } from '../auth/authSlice';
import { useSelector } from 'react-redux';

const CartIcon = () => {
  const navigate = useNavigate();
  const token=useSelector(selectCurrentToken)
  const { data: cart, isLoading } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !token, // skip until token is ready
  });

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => navigate("/cart")} // navigate to cart page
      title="View Cart"
    >
      <FiShoppingCart className="text-2xl text-gray-800 dark:text-white" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
