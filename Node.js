const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

app.post('/create-checkout-session', async (req, res) => {
    const cart = req.session.cart || [];
    const line_items = cart.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
            },
            unit_amount: item.price * 100,
        },
        quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/success.html`,
        cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ id: session.id });
});
