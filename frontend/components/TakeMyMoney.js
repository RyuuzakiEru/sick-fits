import React, {Component} from 'react';
import Stripecheckout from 'react-stripe-checkout';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import NProgress from 'nprogress';
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
  onToken = async (res, createOrder) => {
    NProgress.start();

    const order = await createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => alert(err.message));
    Router.push({
      pathname: '/order',
      query: {id: order.data.createOrder.id}
    });
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
                      image={me.cart[0] && me.cart[0].item && me.cart[0].item.image}
                      stripeKey="pk_test_RuvPNz4fo12IMYdL4xqndqVL00F5ttg16p"
                      currency="USD"
                      email={me.email}
                      token={res => this.onToken(res, createOrder)}
                      onClick={e => e.preventDefault()}
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
