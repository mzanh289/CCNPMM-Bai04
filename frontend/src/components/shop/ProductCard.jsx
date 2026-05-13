import { Link } from 'react-router-dom';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const ProductCard = ({ product }) => {
  const primaryImage = product?.imageUrls?.[0];
  console.log('PRIMARY IMAGE:', primaryImage);
  console.log('PRODUCT:', product);
  const price = product?.price ?? 0;
  const discountPrice = product?.discountPrice ?? product?.discount?.value ? product?.discountPrice : null;

  return (
    <Link
      to={`/products/${product?.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product?.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
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
