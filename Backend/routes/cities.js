const express = require("express");
const router = express.Router();

/**
 * Bangladesh districts/cities (64) as simple { name } objects.
 * Adjust/append if you want thanas/metros instead of districts.
 */
const BD_CITIES = [
  // Barishal
  "Barguna","Barishal","Bhola","Jhalokati","Patuakhali","Pirojpur",
  // Chattogram
  "Bandarban","Brahmanbaria","Chandpur","Chattogram","Cumilla","Cox’s Bazar",
  "Feni","Khagrachhari","Lakshmipur","Noakhali","Rangamati",
  // Dhaka
  "Dhaka","Faridpur","Gazipur","Gopalganj","Kishoreganj","Madaripur",
  "Manikganj","Munshiganj","Narayanganj","Narsingdi","Rajbari","Shariatpur","Tangail",
  // Khulna
  "Bagerhat","Chuadanga","Jashore","Jhenaidah","Khulna","Kushtia",
  "Magura","Meherpur","Narail","Satkhira",
  // Mymensingh
  "Jamalpur","Mymensingh","Netrokona","Sherpur",
  // Rajshahi
  "Bogura","Joypurhat","Naogaon","Natore","Chapai Nawabganj","Pabna","Rajshahi","Sirajganj",
  // Rangpur
  "Dinajpur","Gaibandha","Kurigram","Lalmonirhat","Nilphamari","Panchagarh","Rangpur","Thakurgaon",
  // Sylhet
  "Habiganj","Moulvibazar","Sunamganj","Sylhet"
].map(name => ({ name }));

// GET /cities
router.get("/", (_req, res) => {
  res.json(BD_CITIES);
});

module.exports = router;
