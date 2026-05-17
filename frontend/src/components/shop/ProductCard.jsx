import { Link } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const ProductCard = ({ product }) => {
  const images = Array.isArray(product?.imageUrls) ? product.imageUrls.filter(Boolean) : [];
  const hasMultipleImages = images.length > 1;
  const price = product?.price ?? 0;
  const discountPrice = product?.discountPrice ?? product?.discount?.value ? product?.discountPrice : null;

  return (
    <Link
      to={`/products/${product?.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {images.length > 0 ? (
          hasMultipleImages ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }}
              loop
              slidesPerView={1}
              className="h-full w-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={`${product?.id ?? 'product'}-${index}`} className="h-full w-full">
                  <img
                    src={image}
                    alt={product?.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={images[0]}
              alt={product?.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
        )}
        {discountPrice && (
          <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {product?.category?.name || 'Category'}
        </p>
        <h4 className="text-lg font-semibold text-slate-900 line-clamp-2">{product?.name}</h4>
        <p className="text-sm text-slate-500 line-clamp-2">{product?.description}</p>
        <div className="mt-auto flex items-center gap-3">
          <span className="text-lg font-semibold text-slate-900">{formatCurrency(discountPrice || price)}</span>
          {discountPrice && <span className="text-sm text-slate-400 line-through">{formatCurrency(price)}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
