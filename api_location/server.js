// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000; // API will run on port 5000

app.use(cors());

// List of cities
const cities = [
  "Mirpur",
  "Uttara",
  "Gulshan",
  "Banani",
  "Dhanmondi",
  "Bashundhara",
  "Mohammadpur",
  "Motijheel",
  "Wari",
  "Jatrabari",
  "Badda",
  "Khilkhet",
  "Tejgaon",
  "Lalbagh",
  "Chowkbazar",
  "Ramna",
  "Agargaon",
  "Dhaka Cantonment",
  "Mohakhali"
];

// Root
app.get('/', (req, res) => {
  res.send('City API is running! Use /cities to get the list or /cities?name=mirpur to search.');
});

// Cities endpoint (with optional search) - returns objects
app.get('/cities', (req, res) => {
  const { name } = req.query;
  
  // Convert strings to objects
  const cityObjects = cities.map(city => ({ name: city }));

  if (name) {
    const filtered = cityObjects.filter(cityObj =>
      cityObj.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filtered.length > 0 ? filtered : [{ name: "No match found" }]);
  }

  res.json(cityObjects);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
