import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Supreme from "./styles/Supreme";
import CartStyles from "./styles/CartStyles";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = () => {
  return (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {toggleCart => (
        <Query query={LOCAL_STATE_QUERY}>
          {({ data }) => (
            <CartStyles open={data.cartOpen}>
              <header>
                <CloseButton title="Close" onClick={toggleCart}>&times;</CloseButton>
                <Supreme>Your Cart</Supreme>
                <p>You have __ Items</p>
              </header>

              <footer>
                <p>$10.10</p>
                <SickButton>Checkout</SickButton>
              </footer>
            </CartStyles>
          )}
        </Query>
      )}
    </Mutation>
  );
};
export {LOCAL_STATE_QUERY};
export {TOGGLE_CART_MUTATION};
export default Cart;
