const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const database = require('../models/database');

const uploadDirectory = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Please select a PDF file.' });
  const documentId = `DOC-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
  const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
  const fileName = `${documentId}.pdf`;
  const filePath = path.join(uploadDirectory, fileName);
  try {
    await fs.promises.writeFile(filePath, req.file.buffer);
    await database.run('INSERT INTO documents (id, user_id, original_name, file_path, sha256) VALUES (?, ?, ?, ?, ?)', [documentId, req.user.sub, req.file.originalname, filePath, hash]);
    return res.status(201).json({ id: documentId, fileName: req.file.originalname, sha256: hash, verified: true, message: 'PDF uploaded and verified.' });
  } catch (error) {
    await fs.promises.rm(filePath, { force: true });
    return res.status(500).json({ message: 'Unable to save this PDF.' });
  }
}

async function verifyDocument(req, res) {
  const document = await database.get('SELECT id, original_name, sha256, status, created_at FROM documents WHERE id = ?', [req.params.id.toUpperCase()]);
  if (!document) return res.status(404).json({ message: 'Document not found.' });
  return res.json({ ...document, fileName: document.original_name, verified: document.status === 'verified' });
}

module.exports = { uploadDocument, verifyDocument };