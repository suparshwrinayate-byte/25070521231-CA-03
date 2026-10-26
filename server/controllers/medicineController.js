const Medicine = require('../models/Medicine');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.getMedicines = asyncHandler(async (req, res) => {
  const { search = '', category = '', status = '', sort = 'expiryDate' } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (search.trim()) {
    const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ name: { $regex: safe, $options: 'i' } }, { brand: { $regex: safe, $options: 'i' } }, { batchNumber: { $regex: safe, $options: 'i' } }];
  }
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const soon = new Date(now); soon.setDate(soon.getDate() + 30);
  if (status === 'expired') filter.expiryDate = { $lt: now };
  if (status === 'expiring') filter.expiryDate = { $gte: now, $lte: soon };
  if (status === 'low') filter.$expr = { $lte: ['$quantity', '$minimumStock'] };
  if (status === 'healthy') { filter.expiryDate = { $gt: soon }; filter.$expr = { $gt: ['$quantity', '$minimumStock'] }; }
  const allowedSort = ['expiryDate', 'name', 'quantity', 'createdAt'];
  const sortField = allowedSort.includes(sort) ? sort : 'expiryDate';
  const medicines = await Medicine.find(filter).sort({ [sortField]: 1 });
  res.json({ success: true, count: medicines.length, data: medicines });
});

exports.getStats = asyncHandler(async (_req, res) => {
  const medicines = await Medicine.find();
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const soon = new Date(now); soon.setDate(soon.getDate() + 30);
  res.json({ success: true, data: {
    totalProducts: medicines.length,
    totalUnits: medicines.reduce((sum, m) => sum + m.quantity, 0),
    expired: medicines.filter(m => new Date(m.expiryDate) < now).length,
    expiringSoon: medicines.filter(m => new Date(m.expiryDate) >= now && new Date(m.expiryDate) <= soon).length,
    lowStock: medicines.filter(m => m.quantity <= m.minimumStock).length
  }});
});

exports.createMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.create(req.body);
  res.status(201).json({ success: true, message: 'Medicine added successfully', data: medicine });
});

exports.updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
  res.json({ success: true, message: 'Medicine updated successfully', data: medicine });
});

exports.deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findByIdAndDelete(req.params.id);
  if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
  res.json({ success: true, message: 'Medicine deleted successfully' });
});
