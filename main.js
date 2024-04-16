
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemCount = document.querySelector('.cart-icon span');
    const cartItemsList = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartIcon = document.querySelector('.cart-icon');
    const sidebar = document.getElementById('sidebar');
    const closeButton = document.querySelector('.sidebar-close');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const item = {
                name: document.querySelectorAll('.card .card--title')[index].innerText,
                price: parseFloat(
                    document.querySelectorAll('.card .card--price .price')[index].innerText.slice(1)
                ),
                quantity: 1,
            };

            const existingItem = cartItems.find(
                (cartItem) => cartItem.name === item.name
            );
            if (existingItem) {
                existingItem.quantity++;
                totalAmount += item.price;
            } 
            else {
                cartItems.push(item);
                totalAmount += item.price * item.quantity;
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('totalAmount', totalAmount.toString());

            updateCartUI();
        });
    });

    function updateCartUI() {
        let totalItems = 0;
        cartItems.forEach(item => {
            totalItems += item.quantity;
        });
        updateCartItemCount(totalItems);
        updateCartItemList();
        updateCartTotal();
    }

    function updateCartItemCount(count) {
        cartItemCount.textContent = count;
    }

    function updateCartItemList() {
        cartItemsList.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'individual-cart-item');
            cartItem.innerHTML = `
                <span>(${item.quantity}x)${item.name}</span>
                <span class="cart-item-price">₵${(item.price * item.quantity).toFixed(
                    2,
                )}
                <button class="remove-btn" data-index="${index}"><i class="fa-solid fa-times"></i></button> 
              </span>
            `;

            cartItemsList.append(cartItem);
        });

        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const index = event.currentTarget.dataset.index;
                removeItemFromCart(index);
                updateCartUI();
            });
        });
    }

    function removeItemFromCart(index) {
        const removeItem = cartItems[index];
        if (removeItem.quantity > 1) {
            removeItem.quantity--;
            totalAmount -= removeItem.price;
        } else {
            cartItems.splice(index, 1);
            totalAmount -= removeItem.price * removeItem.quantity;
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('totalAmount', totalAmount.toString());

        updateCartUI();
    }

    function updateCartTotal() {
        cartTotal.textContent = `₵${totalAmount.toFixed(2)}`;
    }

    cartIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    closeButton.addEventListener('click', ()=> {
        sidebar.classList.remove('open'); 
    });

    // Initialize the cart UI on page load
    updateCartUI();
});