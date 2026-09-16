const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const credentialRoutes = require('./routes/credentialRoutes');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'academic-verifier' }));
app.use('/api/credentials', credentialRoutes);

app.listen(port, () => console.log(`Academic Verifier API listening on http://localhost:${port}`));
