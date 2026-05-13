const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImage = require('../models/ProductImage');
const Discount = require('../models/Discount');

const normalizeNumber = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildSearchFilter = ({ search }) => {
  if (!search) {
    return {};
  }

  const regex = new RegExp(search, 'i');
  return {
    $or: [{ name: regex }, { description: regex }]
  };
};

const buildProductFilters = ({
  categoryId,
  minPrice,
  maxPrice,
  discounted,
  bestSelling,
  newest,
  inStock
}) => {
  const filters = {
    isActive: true
  };

  if (categoryId) {
    filters.category = categoryId;
  }

  if (inStock === true) {
    filters.stockQuantity = { $gt: 0 };
  }

  if (discounted === true) {
    filters.discountPrice = { $ne: null };
  }

  if (minPrice !== null || maxPrice !== null) {
    filters.price = {};
    if (minPrice !== null) {
      filters.price.$gte = minPrice;
    }
    if (maxPrice !== null) {
      filters.price.$lte = maxPrice;
    }
  }

  return filters;
};

const buildSort = ({ sort }) => {
  switch (sort) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'newest':
      return { createdAt: -1 };
    case 'best_selling':
      return { soldQuantity: -1 };
    default:
      return { createdAt: -1 };
  }
};

const getCategories = async () => {
  return Category.find({ isActive: true }).sort({ name: 1 });
};

const getProducts = async (query) => {
  const page = Math.max(normalizeNumber(query.page, 1), 1);
  const limit = Math.min(Math.max(normalizeNumber(query.limit, 12), 1), 60);
  const search = query.search?.trim();
  const categoryId = query.categoryId?.trim();
  const minPrice = normalizeNumber(query.minPrice, null);
  const maxPrice = normalizeNumber(query.maxPrice, null);
  const discounted = query.discounted === 'true';
  const bestSelling = query.bestSelling === 'true';
  const newest = query.newest === 'true';
  const inStock = query.inStock === 'true';

  const filters = buildProductFilters({
    categoryId,
    minPrice,
    maxPrice,
    discounted,
    bestSelling,
    newest,
    inStock
  });

  const searchFilter = buildSearchFilter({ search });

  const combinedFilter = {
    ...filters,
    ...searchFilter
  };

  const sort = buildSort({ sort: query.sort });

  const [items, total] = await Promise.all([
    Product.find(combinedFilter)
      .populate('category')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(combinedFilter)
  ]);

  const productIds = items.map((item) => item._id);
  const images = await ProductImage.find({ product: { $in: productIds } }).sort({ position: 1 });
  const imagesByProduct = images.reduce((acc, img) => {
    const key = img.product.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(img);
    return acc;
  }, {});

  const mappedItems = items.map((item) => ({
    ...item.toJSON(),
    images: imagesByProduct[item._id.toString()] ?? []
  }));

  return {
    items: mappedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getLatestProducts = async (limit = 8) => {
  const items = await Product.find({ isActive: true })
    .populate('category')
    .sort({ createdAt: -1 })
    .limit(limit);

  const productIds = items.map((item) => item._id);
  const images = await ProductImage.find({ product: { $in: productIds } }).sort({ position: 1 });
  const imagesByProduct = images.reduce((acc, img) => {
    const key = img.product.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(img);
    return acc;
  }, {});

  return items.map((item) => ({
    ...item.toJSON(),
    images: imagesByProduct[item._id.toString()] ?? []
  }));
};

const getBestSellingProducts = async (limit = 8) => {
  const items = await Product.find({ isActive: true })
    .populate('category')
    .sort({ soldQuantity: -1, createdAt: -1 })
    .limit(limit);

  const productIds = items.map((item) => item._id);
  const images = await ProductImage.find({ product: { $in: productIds } }).sort({ position: 1 });
  const imagesByProduct = images.reduce((acc, img) => {
    const key = img.product.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(img);
    return acc;
  }, {});

  return items.map((item) => ({
    ...item.toJSON(),
    images: imagesByProduct[item._id.toString()] ?? []
  }));
};

const getPromotionProducts = async (limit = 8) => {
  const now = new Date();

  const discounts = await Discount.find({
    isActive: true,
    startsAt: { $lte: now },
    endsAt: { $gte: now }
  })
    .populate({
      path: 'product',
      populate: { path: 'category' }
    })
    .limit(limit);

  const products = discounts
    .map((discount) => ({
      ...discount.product?.toJSON(),
      discount: discount.toJSON()
    }))
    .filter((item) => item.id);

  const productIds = products.map((item) => item.id);
  const images = await ProductImage.find({ product: { $in: productIds } }).sort({ position: 1 });
  const imagesByProduct = images.reduce((acc, img) => {
    const key = img.product.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(img);
    return acc;
  }, {});

  return products.map((item) => ({
    ...item,
    images: imagesByProduct[item.id] ?? []
  }));
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate('category');
  if (!product) {
    return null;
  }

  const images = await ProductImage.find({ product: productId }).sort({ position: 1 });
  const now = new Date();
  const discount = await Discount.findOne({
    product: productId,
    isActive: true,
    startsAt: { $lte: now },
    endsAt: { $gte: now }
  });

  return {
    ...product.toJSON(),
    images,
    discount: discount ? discount.toJSON() : null
  };
};

const getRelatedProducts = async (productId, categoryId, limit = 6) => {
  const items = await Product.find({
    _id: { $ne: productId },
    category: categoryId,
    isActive: true
  })
    .populate('category')
    .sort({ soldQuantity: -1, createdAt: -1 })
    .limit(limit);

  const productIds = items.map((item) => item._id);
  const images = await ProductImage.find({ product: { $in: productIds } }).sort({ position: 1 });
  const imagesByProduct = images.reduce((acc, img) => {
    const key = img.product.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(img);
    return acc;
  }, {});

  return items.map((item) => ({
    ...item.toJSON(),
    images: imagesByProduct[item._id.toString()] ?? []
  }));
};

module.exports = {
  getCategories,
  getProducts,
  getLatestProducts,
  getBestSellingProducts,
  getPromotionProducts,
  getProductById,
  getRelatedProducts
};
