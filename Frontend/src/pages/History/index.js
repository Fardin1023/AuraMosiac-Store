import { useEffect, useMemo, useState } from "react";
import { getMe, getMyOrders, getMyTransactions } from "../../api/api";
import { Link } from "react-router-dom";

const fmt = (n) => Number(n || 0).toFixed(2);
const WISHLIST_KEY = "aura_mosaic_wishlist";

const History = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [txs, setTxs] = useState([]);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");

  const wishlist = useMemo(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  // 👉 compute spent from txs (debits - credits)
  const spentComputed = useMemo(() => {
    return txs.reduce((sum, t) => {
      const amt = Number(t.amount || 0);
      return sum + (t.type === "debit" ? amt : -amt);
    }, 0);
  }, [txs]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const [meRes, oRes, tRes] = await Promise.all([
          getMe().catch(() => ({ data: null })),   // tolerate if not logged in
          getMyOrders().catch(() => ({ data: [] })),
          getMyTransactions().catch(() => ({ data: [] })),
        ]);

        if (cancelled) return;

        setUser(meRes.data?.user || meRes.data || null);
        setOrders(Array.isArray(oRes.data) ? oRes.data : []);
        setTxs(Array.isArray(tRes.data) ? tRes.data : []);
      } catch (e) {
        console.error(e);
        if (!cancelled) setErr("Failed to load history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="section container" style={{ maxWidth: 1100 }}>
      <div className="d-flex align-items-center mb-3">
        <h2 className="mb-0">Your History</h2>
        <div className="ml-auto small">
          <Link to="/" className="text-muted">← Continue shopping</Link>
        </div>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      {/* Profile */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex align-items-center">
          <img
            src={user?.picture || "https://i.pravatar.cc/80?img=5"}
            alt=""
            style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
            className="mr-3"
          />
          <div>
            <div className="h5 mb-0">{user?.name || "Guest"}</div>
            <div className="text-muted small">
              {user?.email || "Not signed in"}{user?.city ? ` • ${user.city}` : ""}
            </div>
          </div>
          <div className="ml-auto text-right">
            {/* 👇 show Total Spent */}
            <div className="small text-muted">Total Spent</div>
            <div className="h5 mb-0">Tk. {fmt(user?.spent ?? spentComputed)}</div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <h4 className="mb-0">Orders</h4>
            <span className="badge badge-pill badge-info ml-3">{orders.length}</span>
          </div>
          {loading ? (
            <p>Loading…</p>
          ) : orders.length === 0 ? (
            <p className="text-muted mb-0">No orders yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th className="text-right">Total (Tk.)</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{new Date(o.createdAt).toLocaleString()}</td>
                      <td>
                        {Array.isArray(o.items)
                          ? o.items.map((i) => i.name).slice(0, 4).join(", ")
                          : "-"}
                        {Array.isArray(o.items) && o.items.length > 4 ? " …" : ""}
                      </td>
                      <td><span className="badge badge-info text-uppercase">{o.status}</span></td>
                      <td className="text-right">{fmt(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <h4 className="mb-0">Transactions</h4>
            <span className="badge badge-pill badge-info ml-3">{txs.length}</span>
          </div>
          {loading ? (
            <p>Loading…</p>
          ) : txs.length === 0 ? (
            <p className="text-muted mb-0">No transactions yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th className="text-right">Amount (Tk.)</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((t) => (
                    <tr key={t._id}>
                      <td>{new Date(t.createdAt).toLocaleString()}</td>
                      <td className="text-capitalize">{t.type}</td>
                      <td>{t.description || "-"}</td>
                      <td className="text-right">{fmt(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Wishlist (from localStorage) */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <h4 className="mb-0">Wishlist</h4>
            <span className="badge badge-pill badge-info ml-3">{wishlist.length}</span>
            <div className="ml-auto">
              <Link to="/wishlist" className="btn btn-sm btn-outline-primary">Open wishlist</Link>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <p className="text-muted mb-0">No items saved yet.</p>
          ) : (
            <div className="row">
              {wishlist.slice(0, 8).map((p) => {
                const id = p._id || p.id || p.slug;
                const img =
                  (Array.isArray(p.images) && p.images[0]) ||
                  p.thumbnail || p.image || "";
                const name = p.name || p.title || "Product";
                const price = Number(p.price || p.newPrice || 0);

                return (
                  <div className="col-6 col-md-3 mb-3" key={id}>
                    <div className="card h-100">
                      {img && <img src={img} alt={name} className="card-img-top" />}
                      <div className="card-body">
                        <div className="small mb-1">{name}</div>
                        <div className="font-weight-bold">৳{fmt(price)}</div>
                        <Link to={`/product/${id}`} className="btn btn-sm btn-primary mt-2">
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default History;
