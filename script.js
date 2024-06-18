// Initialize Swiper
var swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Modal functionality
var modal = document.getElementById("modal");
var slides = document.getElementsByClassName("swiper-slide");
var span = document.getElementsByClassName("close")[0];

for (var i = 0; i < slides.length; i++) {
    slides[i].onclick = function() {
        modal.style.display = "block";
    }
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Add to cart functionality
var cart = [];
var cartItems = document.querySelector('.cart-items');
var totalPrice = document.querySelector('.total-price');

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', event => {
        var product = event.target.previousElementSibling;
        var name = product.dataset.name;
        var price = parseFloat(product.dataset.price);
        addToCart(name, price);
    });
});

function addToCart(name, price) {
    cart.push({name, price});
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = '';
    var total = 0;
    cart.forEach(item => {
        var li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} TL`;
        cartItems.appendChild(li);
        total += item.price;
    });
    totalPrice.textContent = total.toFixed(2);
}

// Payment modal functionality
var paymentModal = document.getElementById("payment-modal");
var checkoutButton = document.querySelector(".checkout");
var closePayment = document.querySelector(".close-payment");

checkoutButton.onclick = async function() {
    const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
    });
    const session = await response.json();
    const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
    const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
    if (error) {
        console.error('Error:', error);
    }
}

closePayment.onclick = function() {
    paymentModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == paymentModal) {
        paymentModal.style.display = "none";
    }
}

// Payment form submission
var paymentForm = document.getElementById('payment-form');
paymentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Ödeme başarılı!');
    paymentModal.style.display = "none";
    cart = [];
    updateCart();
});
