let usage = {};

module.exports = (req, res, next) => {
  const ip = req.ip;
  if (!usage[ip]) usage[ip] = 0;
  if (usage[ip] >= 3) return res.status(429).send('LIMIT');
  usage[ip]++;
  next();
};
