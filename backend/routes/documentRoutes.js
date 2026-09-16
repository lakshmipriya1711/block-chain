const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const { uploadDocument, verifyDocument } = require('../controllers/documentController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype === 'application/pdf')
});

router.post('/upload', requireAuth, (req, res, next) => upload.single('document')(req, res, (error) => {
  if (error?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'PDF must be smaller than 10 MB.' });
  if (error || !req.file) return res.status(400).json({ message: 'Only PDF files are accepted.' });
  return next();
}), uploadDocument);
router.get('/:id', verifyDocument);

module.exports = router;