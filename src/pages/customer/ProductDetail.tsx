import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield } from 'lucide-react';

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

  const [quantity, setQuantity] = React.useState(1);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Additional images would go here */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.tags.map(tag => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
            {product.originalPrice && (
              <Badge className="bg-green-100 text-green-800">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1" size="lg" disabled={!product.isInStock}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <ul className="space-y-1">
                {product.details.map((detail, index) => (
                  <li key={index} className="text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator />

          {/* Shipping & Returns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-gray-600">Orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Quality Guarantee</p>
                <p className="text-sm text-gray-600">100% satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Tabs would go here */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Facts</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Serving Size</dt>
                <dd>{product.nutrition.servingSize}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Calories</dt>
                <dd>{product.nutrition.calories}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Caffeine</dt>
                <dd>{product.nutrition.caffeine}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>
              Customer feedback and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Overall Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Reviews</span>
                <span>{product.reviewCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Similar products will be displayed here based on category and customer preferences.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;
