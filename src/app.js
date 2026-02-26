const express = require('express');
const authRoutes = require('./routes/authRoutes');
const pivotRoutes = require('./routes/pivotRoutes');
const irrigationRoutes = require('./routes/irrigationRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();


app.use(express.json());


app.use('/auth', authRoutes);


app.use(authMiddleware);
app.use('/pivots', pivotRoutes);
app.use('/irrigations', irrigationRoutes);


app.use((req, res) => {
  return res.status(404).json({ message: 'Rota não encontrada.' });
});

app.use(errorMiddleware);

module.exports = app;
