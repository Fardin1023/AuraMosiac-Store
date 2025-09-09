import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const CompleteProfile = () => {
  const { user, setUser, setisHeaderFooterShow } = useContext(MyContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    picture: user?.picture || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // hide header/footer if you prefer a focused page
    setisHeaderFooterShow?.(false);
    return () => setisHeaderFooterShow?.(true);
  }, [setisHeaderFooterShow]);

  const updateField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_BASE}/users/me`,
        { ...form, isProfileComplete: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.user) {
        setUser(res.data.user);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="card p-4 shadow border-0">
          <h3 className="mb-3">Welcome! Let’s complete your profile</h3>
          <p className="text-muted mb-4">We’ll use this information to personalize your shopping experience.</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Name</label>
                <input name="name" className="form-control" value={form.name} onChange={updateField} required />
              </div>
              <div className="form-group col-md-6">
                <label>Email</label>
                <input name="email" type="email" className="form-control" value={form.email} onChange={updateField} required readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Phone</label>
                <input name="phone" className="form-control" value={form.phone} onChange={updateField} placeholder="e.g. 017XXXXXXXX" />
              </div>
              <div className="form-group col-md-6">
                <label>City</label>
                <input name="city" className="form-control" value={form.city} onChange={updateField} placeholder="e.g. Dhaka" />
              </div>
            </div>

            <div className="form-group">
              <label>Avatar URL (optional)</label>
              <input name="picture" className="form-control" value={form.picture} onChange={updateField} placeholder="https://…" />
            </div>

            <button className="btn btn-primary btn-lg" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save & Continue"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CompleteProfile;
