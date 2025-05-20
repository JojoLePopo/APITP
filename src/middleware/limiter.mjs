import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Trop de requêtes, réessayez plus tard.'
});

export default limiter;
