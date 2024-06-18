const express = require('express');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    })),
    mode: 'payment',
    success_url: `${req.headers.origin}/success.html`,
    cancel_url: `${req.headers.origin}/cancel.html`,
  });

  res.json({ id: session.id });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Adding item to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Retrieving items from cart
function getCartItems() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Example usage
addToCart({ id: 1, name: 'Product 1', price: 100 });
console.log(getCartItems());
document.querySelector(".checkout").addEventListener("click", async () => {
  const response = await fetch('/create-checkout-session', { method: 'POST' });
  const session = await response.json();
  const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
  const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
  if (error) {
      console.error('Error:', error);
  }
});
