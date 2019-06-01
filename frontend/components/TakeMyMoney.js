import React, { Component } from 'react';
import Stripecheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMyMoney extends Component {
  onToken= (res) => {
    console.log('Token res');
  };


  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Stripecheckout
            amount={calcTotalPrice(me.cart)}
            name="Sick-fits"
            description={`Order of ${totalItems(me.cart)} items}`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey='pk_test_RuvPNz4fo12IMYdL4xqndqVL00F5ttg16p'
            currency='USD'
            email={me.email}
            token={res => this.onToken(res)}

          >
            {this.props.children}
          </Stripecheckout>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
