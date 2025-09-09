import React, { useMemo } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const order = useMemo(() => {
    if (location.state?.order) return location.state.order;
    try {
      const saved = JSON.parse(localStorage.getItem("aura_mosaic_last_order"));
      if (saved && saved.id === orderId) return saved;
    } catch {}
    return null;
  }, [location.state, orderId]);

  if (!order) {
    return (
      <section className="section">
        <div className="container text-center">
          <h2 className="hd">No order found</h2>
          <p className="text-muted">Your confirmation has expired or was not found.</p>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
      </section>
    );
  }

  const { items, totals, customer, createdAt, payment } = order;

  const paymentSummary = (() => {
    if (!payment) return "Cash on Delivery";
    if (payment.method === "COD") return "Cash on Delivery";
    if (payment.provider === "CARD") {
      return `Card • **** **** **** ${payment.meta?.last4 || "****"} • ${payment.status || "PAID"}`;
    }
    if (payment.provider === "BKASH" || payment.provider === "NAGAD") {
      const ph = payment.meta?.phone ? `(${payment.meta.phone})` : "";
      const tx = payment.meta?.txn ? ` • ${payment.meta.txn}` : "";
      return `${payment.provider}${ph}${tx} • ${payment.status || "PAID"}`;
    }
    return "Online Payment";
  })();

  return (
    <section className="section">
      <div className="container">
        <div className="card p-4 shadow">
          <div className="d-flex align-items-center mb-3">
            <div
              className="d-flex align-items-center justify-content-center mr-3"
              style={{ width: 48, height: 48, borderRadius: "50%", background: "#e8f5e9", fontSize: 24 }}
            >
              ✅
            </div>
            <div>
              <h3 className="mb-0">Thank you! Your order is confirmed.</h3>
              <small className="text-muted">
                Order ID <b>{order.id}</b> • {new Date(createdAt).toLocaleString()}
              </small>
              <div
                style={{ marginTop: 8, padding: "8px 10px", background: "#f8fffb", border: "1px solid #d7f2e3", borderRadius: 8 }}
              >
                🚚 Estimated delivery: <b>within 3 working days</b>.
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <h5 className="mb-3">Items</h5>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-center" width="120">Qty</th>
                      <th className="text-right" width="160">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={it.image || "https://via.placeholder.com/60"}
                              alt={it.name}
                              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                              className="mr-2"
                            />
                            <div>
                              <div>{it.name}</div>
                              <small className="text-muted">৳{Number(it.price || 0).toFixed(2)}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{it.qty || 1}</td>
                        <td className="text-right">৳{((it.price || 0) * (it.qty || 1)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3">
                <h5 className="mb-3">Order Summary</h5>
                <div className="d-flex mb-2">
                  <span>Subtotal</span>
                  <span className="ml-auto">৳{Number(totals.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="d-flex mb-2">
                  <span>Shipping</span>
                  <span className="ml-auto">Free</span>
                </div>
                <div className="d-flex font-weight-bold border-top pt-2">
                  <span>Grand Total</span>
                  <span className="ml-auto">৳{Number(totals.grandTotal || 0).toFixed(2)}</span>
                </div>

                <hr />
                <h6>Payment</h6>
                <div className="small mb-2">{paymentSummary}</div>

                <h6>Customer</h6>
                <div className="small">
                  <div><b>{customer?.name || "Guest"}</b></div>
                  {customer?.email && <div>{customer.email}</div>}
                  {customer?.city && <div>City: {customer.city}</div>}
                </div>

                <button className="btn btn-primary btn-block mt-3" onClick={() => navigate("/")}>
                  Continue shopping
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-muted small">
            You’ll receive updates when your order ships. If you have questions, reach out to support.
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;
