document.addEventListener("DOMContentLoaded", () => {
  try {
    const cart = [];
    const cartCount = document.getElementById("cart-count");
    const cartLink = document.getElementById("cart-link");

    if (!cartCount) {
      console.error("Missing #cart-count element in DOM.");
      return;
    }

    function parsePrice(price) {
      if (price == null) return 0;
      if(typeof price === 'number') return price;
      const cleaned = String(price).replace(/[^0-9.\-]/g, "").replace(/,/g, '');
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : 0;
    }

    function showToast(msg) {
      let toast = document.getElementById("toast");
      if (!toast) {
        toast = document.createElement("div");
       toast.id = 'toast';
          toast.style.position = 'fixed';
          toast.style.right = '20px';
          toast.style.bottom = '20px';
          toast.style.padding = '10px 14px';
          toast.style.background = 'rgba(0,0,0,0.85)';
          toast.style.color = '#fff';
          toast.style.borderRadius = '6px';
          toast.style.zIndex = 9999;
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.2s';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.style.opacity = "1";
      setTimeout(() => {toast.style.opacity = '0';}, 1400);
    }

    function addToCart(name, priceRaw) {
      const price = parsePrice(priceRaw);
      cart.push({ name, price });
      cartCount.textContent = cart.length;
      showToast(`${name} added — R${price.toFixed(2)}`);
      console.log("Cart now:", cart);
    }
    
     function renderCart() {
        let total = 0;
        let summary = '🛒 Your Cart:\n\n';
        cart.forEach((item, index) => {
          summary += `${item.name} - R${item.price.toFixed(2)} [x]\n`;
          total += item.price;
        });
        summary += `\nTotal: R${total.toFixed(2)}\n\n(Click "x" next to an item to remove it.)`;
        alert(summary);
      }

    // Add to cart handler
   document.body.addEventListener('click', (e) => {
        const btn = e.target.closest && e.target.closest('.add-to-cart');
        if (!btn) return;
        const productCard = btn.closest('.product-card');
        if (!productCard) {
          console.error('No .product-card ancestor found for add-to-cart button.');
          return;
        }
        const name = productCard.getAttribute('data-name') || productCard.querySelector('h4')?.textContent || 'Product';
        const price = productCard.getAttribute('data-price') || productCard.querySelector('p')?.textContent || '0';
        addToCart(name, price);
      });

      // Cart link click
      const cartTarget = cartLink || document.querySelector('nav ul li:last-child a');
      if (cartTarget) {
        cartTarget.addEventListener('click', (e) => {
          e.preventDefault();
          if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
          }

          // Build a nicer cart popup with remove buttons
          let cartBox = document.getElementById('cart-box');
          if (!cartBox) {
            cartBox = document.createElement('div');
            cartBox.id = 'cart-box';
            cartBox.style.position = 'fixed';
            cartBox.style.right = '20px';
            cartBox.style.top = '70px';
            cartBox.style.width = '280px';
            cartBox.style.background = '#fff';
            cartBox.style.border = '1px solid #ccc';
            cartBox.style.borderRadius = '8px';
            cartBox.style.padding = '10px';
            cartBox.style.zIndex = 10000;
            cartBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            document.body.appendChild(cartBox);
          }

          cartBox.innerHTML = '<h3>Your Cart</h3>';

          let total = 0;
          cart.forEach((item, index) => {
            total += item.price;
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'center';
            row.style.margin = '4px 0';

            const span = document.createElement('span');
            span.textContent = `${item.name} - R${item.price.toFixed(2)}`;

            const remove = document.createElement('span');
            remove.className = 'remove-btn';
            remove.textContent = '✖';
            remove.style.cursor = 'pointer';
            remove.style.color = 'red';
            remove.onclick = () => {
              cart.splice(index, 1);
              cartCount.textContent = cart.length;
              showToast(`${item.name} removed`);
              cartBox.remove(); // re-render
              cartTarget.click();
            };

            row.appendChild(span);
            row.appendChild(remove);
            cartBox.appendChild(row);
          });

          const totalRow = document.createElement('div');
          totalRow.style.marginTop = '8px';
          totalRow.style.fontWeight = 'bold';
          totalRow.textContent = `Total: R${total.toFixed(2)}`;
          cartBox.appendChild(totalRow);
        });
      } else {
        console.warn('Cart link not found. Cart summary will not be shown on click.');
      }

    } catch (err) {
      console.error('Cart script error:', err);
    }
  });
