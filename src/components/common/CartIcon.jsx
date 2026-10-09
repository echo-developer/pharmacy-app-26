import React from 'react';
import { ShoppingCart } from 'lucide-react-native';

const CartIcon = ({ size = 20, color = '#263077', style }) => (
  <ShoppingCart size={size} color={color} style={style} />
);

export default CartIcon;
