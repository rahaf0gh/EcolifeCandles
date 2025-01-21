const Nav = document.getElementById("UlNav");
const barBtn = document.getElementById("bar-btn");
const xmarkBtn = document.getElementById("amark-btn");

function displayMenu(){
    Nav.style.display="block";
    barBtn.style.display="none";
    xmarkBtn.style.display="block";
}

function closeMenu(){
    Nav.style.display="none";
    barBtn.style.display="block";
    xmarkBtn.style.display="none";
}
// ----------------------- 
let nums = document.querySelectorAll(".No");
let section = document.querySelector(".Numbers");
let started = false; // Function Started ? No

window.onscroll = function () {
  if (window.scrollY <= section.offsetTop) {
    if (!started) {
      nums.forEach((num) => startCount(num));
    }
    started = true;
  }
};

function startCount(el) {
  let goal = el.dataset.goal;
  let count = setInterval(() => {
    el.textContent++;
    if (el.textContent == goal) {
      clearInterval(count);
    }
  }, 1000 / goal);
}
// --------------------------- 

function addToCart(name, price) {
  // الحصول على السلة من LocalStorage أو إنشاء سلة جديدة
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // البحث إذا كان المنتج موجودًا بالفعل في السلة
  const existingProduct = cart.find(item => item.name === name);

  if (existingProduct) {
      // إذا كان المنتج موجودًا، قم بزيادة الكمية بمقدار 1
      existingProduct.quantity += 1;
  } else {
      // إذا لم يكن موجودًا، أضفه كمنتج جديد بكمية 1
      cart.push({ name, price, quantity: 1 });
  }

  // حفظ السلة المحدثة في LocalStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // إشعار المستخدم بإضافة المنتج
  alert(`${name} has been added to your cart!`);
}


// Retrieve cart data from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart data to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart items on the page
function renderCart() {
  const cart = getCart();
  const cartBody = document.getElementById('cart-body');
  const cartTotal = document.getElementById('cart-total');
  cartBody.innerHTML = '';

  if (cart.length === 0) {
      cartBody.innerHTML = '<tr><td colspan="5" class="empty">Your cart is empty</td></tr>';
      cartTotal.textContent = 'Total: $0.00';
      return;
  }

  let total = 0;
  cart.forEach((item, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
          <td>${item.name}</td>
          <td>
              <button onclick="decreaseQuantity(${index})">- </button>
              ${item.quantity}
              <button onclick="increaseQuantity(${index})"> +</button>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td><button onclick="removeFromCart(${index})">Remove</button></td>
      `;

      cartBody.appendChild(row);
      total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Remove an item from the cart
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Clear the entire cart
function clearCart() {
  localStorage.removeItem('cart');
  renderCart();
}

// Initialize the cart when the page loads
document.addEventListener('DOMContentLoaded', renderCart);


// ---------------------- 
// استرجاع السلة من LocalStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// حفظ السلة في LocalStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// عرض محتويات السلة
function renderCart() {
  const cart = getCart();
  const cartBody = document.getElementById('cart-body');
  const cartTotal = document.getElementById('cart-total');
  cartBody.innerHTML = '';

  if (cart.length === 0) {
      cartBody.innerHTML = '<tr><td colspan="5" class="empty">Your cart is empty</td></tr>';
      cartTotal.textContent = 'Total: $0.00';
      return;
  }

  let total = 0;
  cart.forEach((item, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
          <td>${item.name}</td>
          <td>
              <button onclick="decreaseQuantity(${index})">-</button>
              ${item.quantity}
              <button onclick="increaseQuantity(${index})">+</button>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td><button style="background-color: rgba(240, 15, 15, 0.815);; border-radius: 4px;
                      padding: 2px;" onclick="removeFromCart(${index})">Remove</button></td>
      `;

      cartBody.appendChild(row);
      total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// زيادة الكمية
function increaseQuantity(index) {
  const cart = getCart();
  cart[index].quantity += 1;
  saveCart(cart);
  renderCart();
}

// تقليل الكمية
function decreaseQuantity(index) {
  const cart = getCart();
  if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
  } else {
      const confirmDelete = confirm("Quantity is 1. Do you want to remove the item?");
      if (confirmDelete) {
          cart.splice(index, 1);
      }
  }
  saveCart(cart);
  renderCart();
}

// حذف منتج من السلة
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// تهيئة السلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', renderCart);
