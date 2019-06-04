import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';
import React from 'react';

const OrderPage = props => (
	<div>
		<PleaseSignIn>
			<Order id={props.query.id}/>
		</PleaseSignIn>
	</div>
);


export default OrderPage;