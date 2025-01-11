const Redis = require('ioredis');
const redis = new Redis();

async function cacheSupermarketUsers(supermarketId, users) {
  await redis.set(`users:supermarket:${supermarketId}`, JSON.stringify(users));
}

async function getSupermarketUsers(supermarketId) {
  const users = await redis.get(`users:supermarket:${supermarketId}`);
  return users ? JSON.parse(users) : null;
}

async function cacheChainUsers(chainId, users) {
  await redis.set(`users:chain:${chainId}`, JSON.stringify(users));
}

async function getChainUsers(chainId) {
  const users = await redis.get(`users:chain:${chainId}`);
  return users ? JSON.parse(users) : null;
}
