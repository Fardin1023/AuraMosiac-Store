const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv/config');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

// Routes
const categoryRoutes   = require('./routes/category');
const productRoutes    = require('./routes/products');
const aiRoutes         = require('./routes/ai');
const authRoutes       = require("./routes/auth");
const userRoutes       = require("./routes/users");

// ✅ NEW
const orderRoutes       = require("./routes/orders");
const transactionRoutes = require("./routes/transactions");
const citiesRoutes      = require("./routes/cities"); // ← add this

// Mount routes
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// ✅ NEW
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/cities', citiesRoutes); // ← serves http://localhost:4000/cities and :5000/cities

// Chatbot Route (unchanged)
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data[0]?.generated_text || "⚠️ Sorry, I didn’t get that.";
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong with the chatbot" });
  }
});

const MAIN_PORT = Number(process.env.PORT || 4000);
const AUTH_PORT = Number(process.env.AUTH_PORT || 5000);

// DB + Servers
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Database Connected');

  // products/api (existing)
  app.listen(MAIN_PORT, () => {
    console.log(`🚀 API listening at http://localhost:${MAIN_PORT}`);
  });

  // second listener so frontend auth calls (5000) work too
  if (AUTH_PORT !== MAIN_PORT) {
    app.listen(AUTH_PORT, () => {
      console.log(`🔑 Auth mirror also at http://localhost:${AUTH_PORT}`);
    });
  }
})
.catch((err) => {
  console.log("❌ Database connection error:", err);
});
