import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import ShopHeader from '../components/shop/ShopHeader';
import SectionHeader from '../components/shop/SectionHeader';
import ProductGrid from '../components/shop/ProductGrid';
import ShopFooter from '../components/shop/ShopFooter';
import { fetchProductDetail } from '../util/catalog.api';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchProductDetail(id);
        setProduct(res?.product ?? null);
        setRelated(res?.related ?? []);
        setError('');
      } catch {
        setError('Unable to load product.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const maxQty = useMemo(() => product?.stockQuantity ?? 0, [product]);

  const handleQuantity = (next) => {
    const normalized = Math.min(Math.max(next, 1), maxQty || 1);
    setQuantity(normalized);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <ShopHeader />
        <main className="section-shell py-10">
          <div className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <ShopHeader />
        <main className="section-shell py-10">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {error || 'Product not found.'}
          </div>
        </main>
      </div>
    );
  }

  const images = product.images ?? [];
  const hasDiscount = Boolean(product.discountPrice);
  const price = product.discountPrice || product.price;

  return (
    <div className="flex min-h-screen flex-col">
      <ShopHeader />
      <main className="flex flex-col gap-14 py-10">
        <section className="section-shell space-y-8">
          <nav className="text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <span className="mx-2">/</span>
            <span>{product.category?.name || 'Category'}</span>
            <span className="mx-2">/</span>
            <span className="text-slate-900">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              {images.length > 0 ? (
                <div className="space-y-4">
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    navigation
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    className="rounded-3xl"
                  >
                    {images.map((image) => (
                      <SwiperSlide key={image.id}>
                        <img
                          src={image.url}
                          alt={image.altText || product.name}
                          className="h-96 w-full rounded-3xl object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    modules={[Thumbs]}
                    spaceBetween={12}
                    slidesPerView={4}
                  >
                    {images.map((image) => (
                      <SwiperSlide key={`thumb-${image.id}`}>
                        <img
                          src={image.url}
                          alt={image.altText || product.name}
                          className="h-20 w-full rounded-2xl object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="flex h-96 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400">
                  No images available
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{product.category?.name}</p>
                <h1 className="mt-3 font-display text-3xl text-slate-900">{product.name}</h1>
                <p className="mt-3 text-sm text-slate-500">{product.description}</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-semibold text-slate-900">{formatCurrency(price)}</span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</span>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    <p className="text-xs uppercase text-slate-400">SKU</p>
                    <p className="font-semibold text-slate-900">{product.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-400">Stock</p>
                    <p className="font-semibold text-slate-900">{product.stockQuantity}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-400">Sold</p>
                    <p className="font-semibold text-slate-900">{product.soldQuantity}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-400">Category</p>
                    <p className="font-semibold text-slate-900">{product.category?.name}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                    <button
                      className="h-8 w-8 rounded-full border border-slate-200 text-slate-600"
                      onClick={() => handleQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <span className="min-w-[32px] text-center text-sm font-semibold text-slate-900">{quantity}</span>
                    <button
                      className="h-8 w-8 rounded-full border border-slate-200 text-slate-600"
                      onClick={() => handleQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="flex-1 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
                  >
                    Add to cart
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-400">Quantity adjusts to available stock.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell space-y-8">
          <SectionHeader
            eyebrow="Related"
            title="You may also like"
            description="Products from the same category."
          />
          <ProductGrid items={related} emptyMessage="No related products." />
        </section>
      </main>
      <ShopFooter />
    </div>
  );
};

export default ProductDetailPage;
