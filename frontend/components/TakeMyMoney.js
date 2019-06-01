import React, {Component} from 'react';
import Stripecheckout from 'react-stripe-checkout';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import User, {CURRENT_USER_QUERY} from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMyMoney extends Component {
  onToken = (res, createOrder) => {
    //console.log(res.id);
    createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => alert(err.message));
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
            <Mutation
                mutation={CREATE_ORDER_MUTATION}
                refetchQueries={[{query: CURRENT_USER_QUERY}]}
            >
              {createOrder => (
                  <Stripecheckout
                      amount={calcTotalPrice(me.cart)}
                      name="Sick-fits"
                      description={`Order of ${totalItems(me.cart)} items}`}
                      image={me.cart[0].item && me.cart[0].item.image}
                      stripeKey="pk_test_RuvPNz4fo12IMYdL4xqndqVL00F5ttg16p"
                      currency="USD"
                      email={me.email}
                      token={res => this.onToken(res, createOrder)}
                  >
                    {this.props.children}
                  </Stripecheckout>
              )}
            </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
