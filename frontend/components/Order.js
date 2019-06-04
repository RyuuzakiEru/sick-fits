import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            charge
            total
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                price
                image
                quantity
            }
        }
    }
`;

class Order extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired
	};

	render() {
		return (
			<Query query={SINGLE_ORDER_QUERY} variables={{id: this.props.id}}>
				{
					({data, loading, error}) => {
						if (error) return <Error error={error}/>;
						if (loading) return <p>Loading...</p>;
						return (
							<div>
								<p>Order ID: {data.order.id}</p>
							</div>
						);
					}}
			</Query>
		);
	}
}

export default Order;
