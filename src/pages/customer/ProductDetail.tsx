import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Minus, Plus } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();

  // Mock product data - in real app this would come from API
  const product = {
    id: '1',
    name: 'Premium Coffee Beans - Ethiopian',
    price: 24.99,
    originalPrice: 29.99,
    image: '/placeholder.svg',
    category: 'Beverages',
    rating: 4.8,
    reviewCount: 127,
    isInStock: true,
    tags: ['organic', 'fair-trade'],
    description: 'Single-origin Ethiopian coffee beans with notes of blueberry and chocolate. Carefully roasted to bring out the unique flavor profile of this exceptional coffee.',
    details: [
      'Single-origin from Yirgacheffe region',
      'Medium roast with blueberry and chocolate notes',
      'Fair trade certified',
      'Roasted fresh weekly'
    ],
    nutrition: {
      servingSize: '1 cup (240ml)',
      calories: 2,
      caffeine: '95mg'
    }
  };

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const statusLabel = product.isInStock ? 'IN STOCK' : 'BACK ORDER';
  const actionLabel = product.isInStock ? 'ORDER' : 'RESERVE';
  const itemId = id ?? product.id;
  const tagLabel = product.tags.join(' / ');

  return (
    <div className="space-y-10 text-black">
      <div className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.2em] text-black/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/products" className="hover:underline underline-offset-4">
            Products
          </Link>
          <span className="text-black/30">/</span>
          <span>{product.category}</span>
          <span className="text-black/30">/</span>
          <span>Item {itemId}</span>
        </div>
        <span className={product.isInStock ? 'text-black' : 'text-black/40'}>{statusLabel}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Product Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-black/50">
              {tagLabel}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-black/60">
              <div className="flex items-center gap-0.5 text-black">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-black fill-current'
                        : 'text-black/20'
                    }`}
                  />
                ))}
              </div>
              <span className="tabular-nums">{product.rating}</span>
              <span className="text-black/40">({product.reviewCount})</span>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <span className="text-3xl font-semibold tabular-nums">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-black/40 line-through tabular-nums">
                ${product.originalPrice}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-[11px] uppercase tracking-[0.2em] text-black/60">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 border-y border-black/10 py-4">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-[0.2em] text-black/50">Qty</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-7 w-7 items-center justify-center border border-black/10 text-black/60 transition hover:border-black/30 hover:text-black disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-6 text-center tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="flex h-7 w-7 items-center justify-center border border-black/10 text-black/60 transition hover:border-black/30 hover:text-black"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em]">
              <button
                type="button"
                disabled={!product.isInStock}
                className="underline underline-offset-4 transition hover:text-black/70 disabled:opacity-30 disabled:no-underline"
              >
                {actionLabel}
              </button>
              <button type="button" className="underline underline-offset-4 transition hover:text-black/70">
                Save
              </button>
            </div>
            <p className="text-[11px] text-black/50">
              {product.isInStock ? 'Ships within 24 hours.' : 'Available for back order.'}
            </p>
          </div>

          {/* Product Details */}
          <div className="grid gap-6 text-sm">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-black/60">
                Description
              </h3>
              <p className="mt-2 text-black/70">{product.description}</p>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-black/60">
                Details
              </h3>
              <ul className="mt-2 space-y-2 text-black/70">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/40"></span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-black/60">
                Nutrition
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-black/70">
                <span className="text-black/50">Serving size</span>
                <span className="text-right">{product.nutrition.servingSize}</span>
                <span className="text-black/50">Calories</span>
                <span className="text-right tabular-nums">{product.nutrition.calories}</span>
                <span className="text-black/50">Caffeine</span>
                <span className="text-right">{product.nutrition.caffeine}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
