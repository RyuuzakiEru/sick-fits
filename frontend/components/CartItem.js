import React from "react";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";
import SickButton from './styles/SickButton'

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns:  auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3, p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => (
  <Mutation
    mutation={REMOVE_FROM_CART_MUTATION}
    variables={{ id: cartItem.id }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(removeFromCart, { data, error, loading }) => {
      if (data) console.log(data);
      return (
          <CartItemStyles>
            <img width="80" src={cartItem.item.image} alt={cartItem.item.title} />
            <div className="cart-item-details">
              <h3>{cartItem.item.title}</h3>
              <p>{formatMoney(cartItem.item.price)}</p>
              {" - "}
              <em>{cartItem.quantity}</em>
            </div>
            <button disabled={loading} onClick = {(e) => { e.preventDefault(); removeFromCart()} }>&times;</button>
          </CartItemStyles>
      )
    }}
  </Mutation>
);

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
};

export default CartItem;
