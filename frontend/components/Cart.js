import React from 'react';
import Supreme from './styles/Supreme';
import CartStyles from './styles/CartStyles';
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";

const Cart = () => {
    return (
        <CartStyles open={false}>
            <header>
                <CloseButton title='Close'>&times;</CloseButton>
                <Supreme>Your Cart</Supreme>
                <p>You have __ Items</p>
            </header>

            <footer>
                <p>$10.10</p>
                <SickButton>Checkout</SickButton>
            </footer>
        </CartStyles>
    );
};

export default Cart;