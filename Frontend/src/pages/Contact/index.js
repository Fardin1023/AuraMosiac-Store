import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // You can wire this to your backend later. For now, a friendly confirmation:
    alert("Thanks! We’ve received your message and will get back to you shortly.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="hd mb-3">Contact Us</h2>
        <p className="text-muted">Questions, feedback, or partnership ideas? We’d love to hear from you.</p>

        <div className="row mt-4">
          <div className="col-md-7">
            <form onSubmit={onSubmit} className="card p-3 shadow-sm border-0">
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={onChange} className="form-control" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={onChange} className="form-control" required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={onChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows="5" value={form.message} onChange={onChange} className="form-control" required />
              </div>
              <button className="btn btn-green mt-2" type="submit">Send Message</button>
            </form>
          </div>

          <div className="col-md-5">
            <div className="card p-3 shadow-sm border-0">
              <h5>Support</h5>
              <p className="mb-2">Email: support@auramosaic.com</p>
              <p className="mb-2">Phone: +880-1740734780</p>
              <p className="mb-0">Hours: Sun–Thu, 9:00 am – 12:00 pm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
