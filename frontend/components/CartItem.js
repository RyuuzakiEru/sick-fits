import React from "react";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const CartItemStyles = styled.li``;

const CartItem = ({ cartItem }) => (
  <Mutation
    mutation={REMOVE_FROM_CART_MUTATION}
    variables={{ id: cartItem.id }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(removeFromCart, { data, error, loading }) => (
      <CartItemStyles>
        <img width="80" src={cartItem.item.image} alt={cartItem.item.title} />
        <div className="cart-item-details">
          <h3>{cartItem.item.title}</h3>
          <p>{formatMoney(cartItem.item.price)}</p>
          {" - "}
          <em>{cartItem.quantity}</em>
          <button onClick = {(e) => { e.preventDefault; removeFromCart()} }>Remove</button>
        </div>
      </CartItemStyles>
    )}
  </Mutation>
);

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
};

export default CartItem;
