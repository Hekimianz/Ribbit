const express = require('express');
const PORT = 8000;
const app = express();
const prisma = require('./config/prismaClient');

app.get('/', (req, res) => res.send('test'));

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
