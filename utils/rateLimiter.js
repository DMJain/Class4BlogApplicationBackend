const userIps = new Map();

const blogCreationRateLimiter = (ip) => {
  const start = Date.now();
  const limit = userIps.get(ip);

  if (!limit) {
    userIps.set(ip, { creationCount: 1, lastCreationTIme: start });
    return false;
  }

  if (start - limit.lastCreationTIme > 60000) {
    userIps.set(ip, { creationCount: 1, lastCreationTIme: start });
    return false;
  }

  if (limit.creationCount < 5) {
    userIps.set(ip, {
      creationCount: limit.creationCount + 1,
      lastCreationTIme: start,
    });
    return false;
  }

  return true;
};

module.exports = { blogCreationRateLimiter };
