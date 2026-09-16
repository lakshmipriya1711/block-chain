const credentials = require('../models/credentials');

function listCredentials(_req, res) {
  res.json(credentials);
}

function verifyCredential(req, res) {
  const credential = credentials.find((item) => item.id.toLowerCase() === req.params.id.toLowerCase());
  if (!credential) return res.status(404).json({ message: 'Credential not found' });
  return res.json({ ...credential, verified: credential.status === 'verified' });
}

module.exports = { listCredentials, verifyCredential };
