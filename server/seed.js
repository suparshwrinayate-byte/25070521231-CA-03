require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Medicine.deleteMany({});
  const today = new Date();
  const days = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  await Medicine.insertMany([
    { name: 'Paracetamol 500mg', brand: 'HealWell', category: 'Tablet', batchNumber: 'PCM-2401', quantity: 120, minimumStock: 25, expiryDate: days(420), supplier: 'City Pharma' },
    { name: 'Vitamin C', brand: 'NutriCare', category: 'Tablet', batchNumber: 'VTC-119', quantity: 8, minimumStock: 15, expiryDate: days(240), supplier: 'Wellness Distributors' },
    { name: 'Cough Relief Syrup', brand: 'BreatheEasy', category: 'Syrup', batchNumber: 'CRS-882', quantity: 18, minimumStock: 10, expiryDate: days(18), supplier: 'City Pharma' },
    { name: 'Antiseptic Cream', brand: 'CarePlus', category: 'Ointment', batchNumber: 'ASC-042', quantity: 4, minimumStock: 8, expiryDate: days(-12), supplier: 'Medi Supply Co.' },
    { name: 'Saline Eye Drops', brand: 'ClearView', category: 'Drops', batchNumber: 'SED-751', quantity: 35, minimumStock: 10, expiryDate: days(700), supplier: 'Wellness Distributors' },
    { name: 'Amoxicillin 250mg', brand: 'MedCore', category: 'Capsule', batchNumber: 'AMX-551', quantity: 45, minimumStock: 12, expiryDate: days(95), supplier: 'Medi Supply Co.' }
  ]);
  console.log('Demo medicines inserted.');
  await mongoose.disconnect();
}
seed().catch(err => { console.error(err); process.exit(1); });
