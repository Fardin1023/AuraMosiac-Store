const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv/config');

app.use(cors());
app.options('*', cors());

// middleware
app.use(bodyParser.json());

// Routes
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/products');
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// Mount routes
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);


// Chatbot Route (with HuggingFace Falcon)
// ========================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // HuggingFace Falcon API call
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

    console.log("HF Response:", response.data); // Debug log

    // Extract text reply
    const reply = response.data[0]?.generated_text || "⚠️ Sorry, I didn’t get that.";

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong with the chatbot" });
  }
});


// ========================
// Database + Server
// ========================
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Database Connected');
    // Start server after DB connection
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("❌ Database connection error:", err);
});

