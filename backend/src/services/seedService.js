const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const Discount = require('../models/Discount');

const ensureSeedData = async () => {
  const categoryCount = await Category.countDocuments();
  const productCount = await Product.countDocuments();

  if (categoryCount > 0 || productCount > 0) {
    return { seeded: false };
  }

  const categories = await Category.insertMany([
    { name: 'Electronics', description: 'Smart devices and accessories.' },
    { name: 'Fashion', description: 'Wearable essentials and accessories.' },
    { name: 'Home', description: 'Comfortable living essentials.' },
    { name: 'Beauty', description: 'Skin care and wellness picks.' }
  ]);

  const [electronics, fashion, home, beauty] = categories;

  const products = await Product.insertMany([
    {
      name: 'Nova Pro Headphones',
      description: 'Wireless ANC headphones with adaptive sound tuning.',
      price: 249.99,
      discountPrice: 199.99,
      sku: 'NP-HEAD-01',
      stockQuantity: 42,
      soldQuantity: 120,
      category: electronics._id
    },
    {
      name: 'Aurora Smartwatch',
      description: 'Fitness-first smartwatch with health tracking suite.',
      price: 189.0,
      discountPrice: null,
      sku: 'AUR-SW-02',
      stockQuantity: 30,
      soldQuantity: 98,
      category: electronics._id
    },
    {
      name: 'Silk Road Blazer',
      description: 'Tailored blazer with breathable silk blend.',
      price: 149.0,
      discountPrice: 129.0,
      sku: 'SR-BLZ-09',
      stockQuantity: 16,
      soldQuantity: 45,
      category: fashion._id
    },
    {
      name: 'Lumen Desk Lamp',
      description: 'Minimalist lamp with adjustable color temperature.',
      price: 79.5,
      discountPrice: 59.5,
      sku: 'LUM-LMP-03',
      stockQuantity: 64,
      soldQuantity: 76,
      category: home._id
    },
    {
      name: 'Pure Glow Serum',
      description: 'Vitamin-rich serum for daily hydration and glow.',
      price: 58.0,
      discountPrice: null,
      sku: 'PG-SRM-21',
      stockQuantity: 80,
      soldQuantity: 150,
      category: beauty._id
    },
    {
      name: 'Cloud Knit Hoodie',
      description: 'Soft knit hoodie for everyday comfort.',
      price: 89.99,
      discountPrice: 69.99,
      sku: 'CK-HDY-07',
      stockQuantity: 24,
      soldQuantity: 52,
      category: fashion._id
    }
  ]);

  const [headphones, smartwatch, blazer, lamp, serum, hoodie] = products;

  await ProductImage.insertMany([
    {
      product: headphones._id,
      url: 'https://images.unsplash.com/photo-1518441989148-8fcbf1c8f3f5?auto=format&fit=crop&w=900&q=80',
      altText: 'Wireless headphones',
      isPrimary: true,
      position: 1
    },
    {
      product: headphones._id,
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      altText: 'Headphones detail',
      isPrimary: false,
      position: 2
    },
    {
      product: smartwatch._id,
      url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=80',
      altText: 'Smartwatch',
      isPrimary: true,
      position: 1
    },
    {
      product: blazer._id,
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      altText: 'Blazer',
      isPrimary: true,
      position: 1
    },
    {
      product: lamp._id,
      url: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=900&q=80',
      altText: 'Desk lamp',
      isPrimary: true,
      position: 1
    },
    {
      product: serum._id,
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      altText: 'Skincare serum',
      isPrimary: true,
      position: 1
    },
    {
      product: hoodie._id,
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      altText: 'Knit hoodie',
      isPrimary: true,
      position: 1
    }
  ]);

  const now = new Date();
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  await Discount.insertMany([
    {
      title: 'Nova Pro Launch Deal',
      description: 'Save on Nova Pro Headphones.',
      type: 'PERCENT',
      value: 20,
      startsAt: now,
      endsAt: twoWeeks,
      product: headphones._id,
      isActive: true
    },
    {
      title: 'Home Office Refresh',
      description: 'Limited-time desk lamp promo.',
      type: 'AMOUNT',
      value: 20,
      startsAt: now,
      endsAt: twoWeeks,
      product: lamp._id,
      isActive: true
    }
  ]);

  return { seeded: true };
};

module.exports = { ensureSeedData };
