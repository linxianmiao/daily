const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;
const COLLECTION = "trending_items";

// 随机获取1条，排除已看过的 _id 列表
const getRandomItem = async (event) => {
  const { excludeIds = [], category = '' } = event;
  console.log('[getRandomItem] category:', category, 'excludeIds count:', excludeIds.length);

  // 构建查询条件
  let where = {};
  if (excludeIds.length > 0) {
    where._id = _.nin(excludeIds);
  }
  if (category) {
    where.category = category;
  }

  // 先获取符合条件的总数
  const countRes = await db.collection(COLLECTION).where(where).count();
  const total = countRes.total;

  if (total === 0) {
    return { item: null, remaining: 0 };
  }

  // 随机跳过
  const skip = Math.floor(Math.random() * total);
  const res = await db.collection(COLLECTION).where(where).skip(skip).limit(1).get();

  return {
    item: res.data[0] || null,
    remaining: total - 1,
  };
};

// 读取词条（保留兼容）
const getKeywords = async (event) => {
  const { limit = 20, source } = event;
  let query = db.collection(COLLECTION);
  if (source && source !== "all") {
    query = query.where({ source });
  }
  const res = await query.orderBy("weight", "desc").limit(limit).get();
  return res.data;
};

// 写入单条词条（由爬虫脚本调用）
const addItem = async (event) => {
  const { item } = event;
  const res = await db.collection(COLLECTION).add({ data: item });
  return { id: res._id };
};

// 清空集合（由爬虫脚本调用）
const clearItems = async () => {
  let total = 0;
  while (true) {
    const res = await db.collection(COLLECTION).where({
      _id: _.exists(true),
    }).limit(1000).remove();
    total += res.stats.removed;
    if (res.stats.removed < 1000) break;
  }
  return { removed: total };
};

// 云函数入口
exports.main = async (event, context) => {
  switch (event.type) {
    case "getRandomItem":
      return await getRandomItem(event);
    case "getKeywords":
      return await getKeywords(event);
    case "addItem":
      return await addItem(event);
    case "clearItems":
      return await clearItems();
    default:
      return { error: "Unknown type: " + event.type };
  }
};
