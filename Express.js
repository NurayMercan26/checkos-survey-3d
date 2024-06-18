const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true in production
}));

app.post('/add-to-cart', (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push(req.body.product);
    res.send('Product added to cart');
});

app.get('/cart', (req, res) => {
    res.json(req.session.cart || []);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
