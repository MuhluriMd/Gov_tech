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
      if (!price) return 0;
      const cleaned = String(price).replace(/[^0-9.\-]/g, "");
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : 0;
    }

    function showToast(msg) {
      let toast = document.getElementById("toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        Object.assign(toast.style, {
          position: "fixed",
          right: "20px",
          bottom: "20px",
          padding: "10px 14px",
          background: "rgba(0,0,0,0.85)",
          color: "#fff",
          borderRadius: "6px",
          zIndex: 9999,
          opacity: "0",
          transition: "opacity 0.3s",
        });
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.style.opacity = "1";
      setTimeout(() => (toast.style.opacity = "0"), 1600);
    }

    function addToCart(name, priceRaw) {
      const price = parsePrice(priceRaw);
      cart.push({ name, price });
      cartCount.textContent = cart.length;
      showToast(`${name} added — R${price.toFixed(2)}`);
      console.log("Cart now:", cart);
    }

    // Add to cart handler
    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart");
      if (!btn) return;

      const productCard = btn.closest(".product-card");
      if (!productCard) return;

      const name =
        productCard.getAttribute("data-name") ||
        productCard.querySelector("h4")?.textContent ||
        "Product";
      const price =
        productCard.getAttribute("data-price") ||
        productCard.querySelector("p")?.textContent ||
        "0";

      addToCart(name, price);
    });

    // Cart summary
    if (cartLink) {
      cartLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (cart.length === 0) {
          alert("Your cart is empty!");
          return;
        }
        let total = 0;
        let summary = "🛒 Your Cart:\n\n";
        cart.forEach((item) => {
          summary += `${item.name} - R${item.price.toFixed(2)}\n`;
          total += item.price;
        });
        summary += `\nTotal: R${total.toFixed(2)}`;
        alert(summary);
      });
    }
  } catch (err) {
    console.error("Cart script error:", err);
  }
});
