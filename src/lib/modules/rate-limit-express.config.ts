import rateLimit from 'express-rate-limit';

export const configureRateLimit = () => {
  return rateLimit({
    windowMs: (Number(process.env.REMEMBER_IP_MINUTES) || 15) * 60 * 1000,
    max: Number(process.env.NUMBER_REQUEST_PER_IP) || 100,
    message: {
      isSuccess: false,
      message: 'Too many requests, please try again later.'
    }
  });
};