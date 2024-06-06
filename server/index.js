const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const { errorHandler } = require('./utils/errorHandler');

dotenv.config({ path: './.env' });

app.use(express.json())
app.use(cors())
app.use(mongoSanitize())

// set handlers at routes

app.use('/users', userRouter)
app.use('/auth', authRouter)

// default handler
app.all('*', (req, res) => {
  res.status(404).json({
    error: `Can't find ${req.originalUrl} on this server`,
  })
})

app.use(errorHandler)

const PORT = process.env.PORT || 8090
const DB = process.env.DATABASE_URL

// connect to mongo db
mongoose.connect(DB).then(() => {
  console.log("Database connected successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('Database connection error:', err);
});


// System exit event listeners

process.on('uncaughtException', err => {
  console.log(err.name, err.message, err);
  console.log('UNCAUGHT EXCEPTION!💥 Shutting down...');
  process.exit(1)
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!💥 Shutting down...');
  process.exit(1)

});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(1)
})

module.exports = app;