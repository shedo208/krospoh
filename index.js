
let cart = [];
const cartCount = document.getElementById("cart-count");
const openCartButton = document.getElementById("open-cart");
const cartSidebar = document.getElementById("cart-sidebar");
const closeSidebarButton = document.querySelector(".close-sidebar");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const checkoutBtn = document.querySelector(".checkout-btn"); // Кнопка "Оформить заказ"


const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutBtn = document.getElementById("close-checkout-btn");
const checkoutFinalTotal = document.getElementById("checkout-final-total");
const checkoutForm = document.getElementById("checkout-form");


const modal = document.getElementById("auth-modal");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const closeBtn = document.querySelector(".close-btn");
const modalTitle = document.getElementById("modal-title");
const authForm = document.getElementById("auth-form");
const guestLoginBtn = document.getElementById("guest-login-btn");
const userActionsContainer = document.querySelector(".user-actions");
let currentUser = null; 



function renderCart() {
    cartItemsContainer.innerHTML = '';
    let totalCost = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Ваша корзина пуста.</p>';
        checkoutBtn.disabled = true;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalCost += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            const priceFormatted = item.price.toLocaleString('ru-RU');
            const totalFormatted = itemTotal.toLocaleString('ru-RU');

            itemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} шт. &times; ${priceFormatted}₸</p>
                </div>
                <span>${totalFormatted}₸</span>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        checkoutBtn.disabled = false;
    }

    cartTotalElement.textContent = totalCost.toLocaleString('ru-RU') + ' ₸';
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    return totalCost; 
}


function openSidebar() {
    renderCart();
    if (window.innerWidth < 600) {
        cartSidebar.style.width = "100%"; 
    } else {
        cartSidebar.style.width = "350px";
    }
}

function closeSidebar() {
    cartSidebar.style.width = "0";
}



function openCheckoutModal() {
    const finalTotal = renderCart();
    
    if (finalTotal === 0) {
        alert("Для оформления заказа добавьте товары в корзину!");
        closeSidebar();
        return;
    }
    
   
    checkoutFinalTotal.textContent = finalTotal.toLocaleString('ru-RU') + ' ₸';
    
    closeSidebar(); 
    checkoutModal.style.display = "block";
}

function closeCheckoutModal() {
    checkoutModal.style.display = "none";
    checkoutForm.reset(); 
}


document.getElementById('card-number').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4}/g);
    let match = matches ? matches.join(' ') : value;
    e.target.value = match;
});


document.getElementById('card-date').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 2 && !value.includes('/')) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    e.target.value = value;
});



function setGuestMode() {
    currentUser = { name: "Гость", type: "guest" };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    modal.style.display = "none";
    alert(`Вы вошли как Гость. Приятных покупок!`);
    updateHeader();
}

function updateHeader() {
    if (currentUser) {
        userActionsContainer.innerHTML = `
            <span style="color: white; font-weight: bold; margin-right: 10px;">Привет, ${currentUser.name}!</span>
            <button class="auth-btn" id="logout-btn">Выход</button>
        `;
        
        document.getElementById("logout-btn").addEventListener("click", () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            alert('Вы вышли из системы.');
            location.reload(); 
        });
    }
}

function checkInitialLogin() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateHeader();
    }
}



document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const price = parseInt(button.getAttribute("data-price"));

        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        openSidebar();
    });
});
openCartButton.addEventListener("click", openSidebar);
closeSidebarButton.addEventListener("click", closeSidebar);
checkoutBtn.addEventListener("click", openCheckoutModal); 



closeCheckoutBtn.addEventListener("click", closeCheckoutModal);


window.addEventListener("click", (event) => {
    if (event.target == checkoutModal) {
        closeCheckoutModal();
    }
});


checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Заказ на сумму ${checkoutFinalTotal.textContent} успешно оформлен! (Функция-заглушка)`);
    
    cart = [];
    renderCart(); 
    
    closeCheckoutModal();
});



loginBtn.addEventListener("click", () => {
    modalTitle.textContent = "Вход";
    authForm.querySelector('button[type="submit"]').textContent = "Войти";
    modal.style.display = "block";
});

registerBtn.addEventListener("click", () => {
    modalTitle.textContent = "Регистрация";
    authForm.querySelector('button[type="submit"]').textContent = "Зарегистрироваться";
    modal.style.display = "block";
});

closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});
guestLoginBtn.addEventListener("click", (e) => { e.preventDefault(); setGuestMode(); });
authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Успешно! Пользователь вошел/зарегистрировался (функция-заглушка).`);
    currentUser = { name: "User", type: "registered" };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    modal.style.display = "none";
    updateHeader();
});


// --- Общие ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});


// =================================================================================
// 6. ИНИЦИАЛИЗАЦИЯ
// =================================================================================
checkInitialLogin();