import React, { Component } from "react";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import PropTypes from "prop-types";
const CartItemStyles = styled.li``;

const CartItem = ({ cartItem }) => (
  <CartItemStyles>
    <img width="80" src={(cartItem.item.image)} alt={cartItem.item.title} />
    <div className="cart-item-details">
      <h3>{cartItem.item.title}</h3>
      <p>{formatMoney(cartItem.item.price)}</p>
      {" - "}
      <em>{cartItem.quantity}</em>
    </div>
  </CartItemStyles>
);

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
};

export default CartItem;
