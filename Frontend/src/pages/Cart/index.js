import { useContext } from "react";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { IoMdCart } from "react-icons/io";
import Swal from "sweetalert2";
import { createOrder } from "../../api/api";

const Cart = () => {
  const { cart, setCart, user, selectedCity, openLoginGate } = useContext(MyContext);
  const navigate = useNavigate();

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, qty: Math.max(1, Math.min(99, (it.qty || 1) + delta)) }
          : it
      )
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const placeGuestOrder = (orderId, orderTotal, payment) => {
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: cart.map((i) => ({ ...i })), // shallow copy
      totals: { subtotal: Number(orderTotal), shipping: 0, grandTotal: Number(orderTotal) },
      customer: {
        name: user?.name || "Guest",
        email: user?.email || "",
        city: selectedCity || "Not selected",
      },
      payment: payment || { method: "COD", provider: "COD", status: "PENDING", meta: {} },
    };
    localStorage.setItem("aura_mosaic_last_order", JSON.stringify(order));
    setCart([]);
    localStorage.removeItem("aura_mosaic_cart");
    window.dispatchEvent(new Event("aura:refresh-me"));

    Swal.fire({
      title: "Order placed! 🎉",
      html: `
        <div style="text-align:left">
          <div><b>Order ID</b>: ${orderId}</div>
          <div><b>Total</b>: ৳${orderTotal}</div>
          <div style="margin-top:4px"><b>Payment</b>: ${order.payment.method === "ONLINE" ? `${order.payment.provider} • ${order.payment.status}` : "Cash on Delivery"}</div>
          <div style="margin-top:10px;padding:8px 10px;background:#f8fffb;border:1px solid #d7f2e3;border-radius:8px;">
            🚚 Estimated delivery: <b>within 3 working days</b>.
          </div>
        </div>
      `,
      icon: "success",
      confirmButtonText: "View confirmation",
    }).then(() => {
      navigate(`/order-confirmation/${orderId}`, { state: { order } });
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Your cart is empty",
        text: "Add some products before checking out.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    // 🔐 require sign-in to buy
    if (!user) {
      openLoginGate("Please sign in to checkout and place your order.");
      return;
    }

    const itemsPreview = cart
      .slice(0, 5)
      .map(
        (i) => `
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
          <img src="${i.image || ""}" alt=""
               style="width:36px;height:36px;object-fit:cover;border-radius:6px;background:#f4f4f4" />
          <div style="flex:1;">${i.name} × ${i.qty || 1}</div>
          <div>৳${((i.price || 0) * (i.qty || 1)).toFixed(2)}</div>
        </div>
      `
      )
      .join("");

    const more =
      cart.length > 5
        ? `<div style="opacity:.7;margin-bottom:6px;">+ ${cart.length - 5} more item(s)</div>`
        : "";

    const orderTotal = total.toFixed(2);
    const customer = user?.name
      ? `${user.name}${user.email ? ` • ${user.email}` : ""}`
      : "Guest";
    const city = selectedCity || "Not selected";

    const ask = await Swal.fire({
      title: "Review your order",
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:6px"><b>Customer</b>: ${customer}</div>
          <div style="margin-bottom:8px"><b>Shipping city</b>: ${city}</div>
          <hr/>
          ${itemsPreview}
          ${more}
          <hr/>
          <div style="display:flex;justify-content:space-between;margin-top:8px">
            <div>Subtotal</div><div>৳${orderTotal}</div>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <div>Shipping</div><div>Free</div>
          </div>
          <div style="display:flex;justify-content:space-between;font-weight:700;">
            <div>Grand Total</div><div>৳${orderTotal}</div>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Proceed to payment",
      cancelButtonText: "Keep shopping",
      reverseButtons: true,
      customClass: { popup: "rounded-2xl" },
    });
    if (!ask.isConfirmed) return;

    // ---- Payment step (COD / Online → bKash/Nagad/Card) ----
    const pay = await Swal.fire({
      title: "Select payment",
      html: `
        <div style="text-align:left">
          <div style="display:flex;gap:8px;margin-bottom:10px;">
            <label style="display:flex;align-items:center;gap:6px;">
              <input type="radio" name="pay_method" value="COD" checked />
              <span>Cash on Delivery</span>
            </label>
            <label style="display:flex;align-items:center;gap:6px;">
              <input type="radio" name="pay_method" value="ONLINE" />
              <span>Online Payment</span>
            </label>
          </div>

          <div id="onlineSection" style="display:none;border:1px dashed #e5e5e5;padding:10px;border-radius:8px;">
            <div style="margin-bottom:8px;"><b>Choose provider</b></div>
            <div style="display:flex;gap:8px;margin-bottom:12px;">
              <label style="display:flex;align-items:center;gap:6px;">
                <input type="radio" name="pay_provider" value="BKASH" checked />
                <span>bKash</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;">
                <input type="radio" name="pay_provider" value="NAGAD" />
                <span>Nagad</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;">
                <input type="radio" name="pay_provider" value="CARD" />
                <span>Card</span>
              </label>
            </div>

            <div id="walletFields">
              <div style="display:flex;gap:8px;margin-bottom:8px;">
                <div style="flex:1;">
                  <label class="swal2-label">Phone</label>
                  <input id="walletPhone" class="swal2-input" placeholder="01XXXXXXXXX" />
                </div>
                <div style="flex:1;">
                  <label class="swal2-label">Transaction ID</label>
                  <input id="walletTxn" class="swal2-input" placeholder="e.g., TXN12345" />
                </div>
              </div>
            </div>

            <div id="cardFields" style="display:none;">
              <div class="swal2-label">Name on Card</div>
              <input id="cardName" class="swal2-input" placeholder="Full name" />
              <div class="swal2-label">Card Number</div>
              <input id="cardNumber" class="swal2-input" placeholder="4111 1111 1111 1111" />
              <div style="display:flex;gap:8px;">
                <div style="flex:1;">
                  <div class="swal2-label">Expiry (MM/YY)</div>
                  <input id="cardExpiry" class="swal2-input" placeholder="MM/YY" />
                </div>
                <div style="flex:1;">
                  <div class="swal2-label">CVV</div>
                  <input id="cardCvv" class="swal2-input" placeholder="CVV" />
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `Pay ৳${orderTotal}`,
      cancelButtonText: "Back",
      focusConfirm: false,
      didOpen: () => {
        const methodRadios = Swal.getPopup().querySelectorAll('input[name="pay_method"]');
        const onlineSection = Swal.getPopup().querySelector('#onlineSection');
        const providerRadios = Swal.getPopup().querySelectorAll('input[name="pay_provider"]');
        const walletFields = Swal.getPopup().querySelector('#walletFields');
        const cardFields = Swal.getPopup().querySelector('#cardFields');

        const syncView = () => {
          const method = [...methodRadios].find(r => r.checked)?.value;
          onlineSection.style.display = method === "ONLINE" ? "block" : "none";

          const provider = [...providerRadios].find(r => r.checked)?.value;
          walletFields.style.display = provider === "CARD" ? "none" : "block";
          cardFields.style.display = provider === "CARD" ? "block" : "none";
        };

        methodRadios.forEach(r => r.addEventListener('change', syncView));
        providerRadios.forEach(r => r.addEventListener('change', syncView));
        syncView();
      },
      preConfirm: () => {
        const method = Swal.getPopup().querySelector('input[name="pay_method"]:checked')?.value || "COD";
        if (method === "COD") {
          return { method: "COD", provider: "COD", status: "PENDING", meta: {} };
        }

        const provider = Swal.getPopup().querySelector('input[name="pay_provider"]:checked')?.value || "BKASH";

        if (provider === "CARD") {
          const name = Swal.getPopup().querySelector('#cardName')?.value?.trim() || "";
          const number = (Swal.getPopup().querySelector('#cardNumber')?.value || "").replace(/\s+/g, "");
          const expiry = Swal.getPopup().querySelector('#cardExpiry')?.value?.trim() || "";
          const cvv = Swal.getPopup().querySelector('#cardCvv')?.value?.trim() || "";

          const reNum = /^\d{13,19}$/;
          const reExp = /^(0[1-9]|1[0-2])\/\d{2}$/;
          const reCvv = /^\d{3,4}$/;

          if (!name) return Swal.showValidationMessage("Enter the card holder name.");
          if (!reNum.test(number)) return Swal.showValidationMessage("Enter a valid card number (13–19 digits).");
          if (!reExp.test(expiry)) return Swal.showValidationMessage("Expiry must be MM/YY.");
          if (!reCvv.test(cvv)) return Swal.showValidationMessage("CVV must be 3–4 digits.");

          return {
            method: "ONLINE",
            provider: "CARD",
            status: "PAID",
            meta: { name, last4: number.slice(-4), expiry }
          };
        } else {
          const phone = Swal.getPopup().querySelector('#walletPhone')?.value?.trim() || "";
          const txn = Swal.getPopup().querySelector('#walletTxn')?.value?.trim() || "";
          if (!/^01\d{9}$/.test(phone)) return Swal.showValidationMessage("Enter a valid 11-digit phone starting with 01.");
          if (txn.length < 5) return Swal.showValidationMessage("Enter a valid transaction ID.");

          return {
            method: "ONLINE",
            provider,
            status: "PAID",
            meta: { phone, txn }
          };
        }
      }
    });
    if (!pay.isConfirmed) return;

    const payment = pay.value; // { method, provider, status, meta }

    // (Signed-in flow continues as before)
    try {
      const payload = {
        items: cart.map((i) => ({
          productId: i.id,
          name: i.name,
          image: i.image,
          price: i.price,
          qty: i.qty || 1,
        })),
        city,
        payment: {
          method: payment.method,
          provider: payment.provider,
          status: payment.status,
          meta: payment.meta,
          amount: Number(orderTotal)
        }
      };

      const res = await createOrder(payload);
      const saved = res.data; // { _id, items, total, status, createdAt, payment? }

      const order = {
        id: saved._id,
        createdAt: saved.createdAt,
        items: saved.items?.map((it) => ({
          id: it.productId || it._id,
          name: it.name,
          image: it.image,
          price: it.price,
          qty: it.qty,
        })) || [],
        totals: {
          subtotal: saved.total,
          shipping: 0,
          grandTotal: saved.total,
        },
        customer: {
          name: user?.name || "",
          email: user?.email || "",
          city,
        },
        payment: saved.payment || payment
      };
      localStorage.setItem("aura_mosaic_last_order", JSON.stringify(order));

      // Clear cart
      setCart([]);
      localStorage.removeItem("aura_mosaic_cart");

      await Swal.fire({
        title: "Order placed! 🎉",
        html: `
          <div style="text-align:left">
            <div><b>Order ID</b>: ${saved._id}</div>
            <div><b>Total</b>: ৳${Number(saved.total).toFixed(2)}</div>
            <div style="margin-top:4px"><b>Payment</b>: ${order.payment.method === "ONLINE" ? `${order.payment.provider} • ${order.payment.status}` : "Cash on Delivery"}</div>
            <div style="margin-top:10px;padding:8px 10px;background:#f8fffb;border:1px solid #d7f2e3;border-radius:8px;">
              🚚 Estimated delivery: <b>within 3 working days</b>.
            </div>
          </div>
        `,
        icon: "success",
        confirmButtonText: "View confirmation",
      });
      navigate(`/order-confirmation/${saved._id}`, { state: { order } });
    } catch (e) {
      console.error(e);
      // Fallback guest order (shouldn't happen much now that we require auth)
      const orderId = `AURA-${Date.now().toString().slice(-6)}`;
      placeGuestOrder(orderId, orderTotal, payment);
    }
  };

  return (
    <section className="section cartPage">
      <div className="container">
        <h2 className="hd mb-0">Your Cart</h2>
        <p>
          There are <b>{cart.length}</b> products in your cart
        </p>

        <div className="row">
          <div className="col-md-9 pr-5">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th width="30%">Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link to={`/product/${item.id}`}>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img
                                src={item.image || "https://bk.shajgoj.com/storage/2025/07/32568.jpg"}
                                alt={item.name}
                                className="w-100"
                              />
                            </div>
                            <div className="info px-3">
                              <h6>{item.name}</h6>
                              <Rating
                                name="read-only"
                                value={3.5}
                                precision={0.5}
                                size="small"
                                readOnly
                              />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td>৳{Number(item.price || 0).toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => changeQty(item.id, -1)}
                          >
                            −
                          </button>
                          <span className="mx-2">{item.qty || 1}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => changeQty(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>৳{((item.price || 0) * (item.qty || 1)).toFixed(2)}</td>
                      <td>
                        <span
                          className="remove"
                          onClick={() => removeItem(item.id)}
                          role="button"
                        >
                          <IoClose />
                        </span>
                      </td>
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        Your cart is empty.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border shadow p-3 cartDetails">
              <h4>CART SUMMARY</h4>
              <div className="d-flex align-items-center mb-3">
                <span>Total Cash </span>
                <span className="ml-auto text-red font-weight-bold">৳{total.toFixed(2)}</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <span>Shipping </span>
                <span className="ml-auto"><b>Free</b></span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <span>Grand-Total </span>
                <span className="ml-auto text-red font-weight-bold">৳{total.toFixed(2)}</span>
              </div>

              <Button className="btn-blue btn-lg btn-big" onClick={handleCheckout}>
                <IoMdCart />
                &nbsp;Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
