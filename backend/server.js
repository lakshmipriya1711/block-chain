const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const credentialRoutes = require('./routes/credentialRoutes');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const database = require('./models/database');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/backend', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/api/health', async (_req, res) => {
	try {
		await database.get('SELECT 1 AS connected');
		return res.json({ status: 'ok', service: 'academic-verifier', database: 'connected' });
	} catch (error) {
		return res.status(503).json({ status: 'error', service: 'academic-verifier', database: 'unavailable' });
	}
});
app.use('/api/auth', authRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/documents', documentRoutes);

app.listen(port, () => console.log(`Academic Verifier API listening on http://localhost:${port}`));
