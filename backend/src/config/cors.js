const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;

