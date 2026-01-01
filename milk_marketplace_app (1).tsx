import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, ShoppingCart, User, Home, Heart, Truck, Bell, Filter, Plus, Minus, Check } from 'lucide-react';

// TypeScript interfaces for better type safety
interface Farmer {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  price: number;
  milkType: string;
  description: string;
  quality: string;
  certifications: string[];
  iotData: {
    temperature: string;
    quality: string;
    lastChecked: string;
  };
  blockchainVerified: boolean;
}

interface CartItem {
  farmerId: number;
  farmerName: string;
  milkType: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: string;
  orderTime: string;
  deliveryEstimate: string;
}

const MilkMarketplaceApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'cart' | 'orders' | 'profile'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const farmers: Farmer[] = [
    {
      id: 1,
      name: "Green Valley Farm",
      location: "12 km away",
      rating: 4.8,
      reviews: 156,
      image: "🐄",
      price: 45,
      milkType: "Organic Whole Milk",
      description: "Fresh organic milk from grass-fed cows",
      quality: "A1 Protein Free",
      certifications: ["Organic", "Non-GMO"],
      iotData: { temperature: "4°C", quality: "Excellent", lastChecked: "2 mins ago" },
      blockchainVerified: true
    },
    {
      id: 2,
      name: "Sunshine Dairy",
      location: "8 km away",
      rating: 4.6,
      reviews: 89,
      image: "🐮",
      price: 42,
      milkType: "Fresh Whole Milk",
      description: "Traditional farming with modern quality control",
      quality: "Premium Grade",
      certifications: ["Local", "Fresh"],
      iotData: { temperature: "3°C", quality: "Excellent", lastChecked: "1 min ago" },
      blockchainVerified: true
    },
    {
      id: 3,
      name: "Happy Cow Ranch",
      location: "15 km away",
      rating: 4.9,
      reviews: 203,
      image: "🐄",
      price: 48,
      milkType: "A2 Organic Milk",
      description: "Special A2 protein milk from heritage cows",
      quality: "Premium A2",
      certifications: ["A2 Protein", "Organic", "Grass-Fed"],
      iotData: { temperature: "4°C", quality: "Superior", lastChecked: "Just now" },
      blockchainVerified: true
    }
  ];

  const aiRecommendations: string[] = [
    "Based on your previous orders, try Green Valley Farm's new A2 milk",
    "Peak demand predicted for weekend - order now for guaranteed delivery",
    "Quality alert: All farmers showing excellent IoT readings today"
  ];

  const addToCart = (farmer: Farmer, quantity: number = 1): void => {
    const existingItem = cart.find(item => item.farmerId === farmer.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.farmerId === farmer.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        farmerId: farmer.id,
        farmerName: farmer.name,
        milkType: farmer.milkType,
        price: farmer.price,
        quantity: quantity,
        image: farmer.image
      }]);
    }
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const toggleFavorite = (farmerId: number): void => {
    if (favorites.includes(farmerId)) {
      setFavorites(favorites.filter(id => id !== farmerId));
    } else {
      setFavorites([...favorites, farmerId]);
    }
  };

  const placeOrder = (): void => {
    const newOrder: Order = {
      id: Date.now(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: "Processing",
      orderTime: new Date().toLocaleTimeString(),
      deliveryEstimate: "Within 4 hours"
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setCurrentScreen('orders');
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.milkType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HomeScreen: React.FC = () => (
    <div className="p-4 space-y-6">
      {/* AI Recommendations Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <h3 className="font-bold mb-2">🤖 AI Recommendations</h3>
        <div className="text-sm space-y-1">
          {aiRecommendations.map((rec, index) => (
            <p key={index}>• {rec}</p>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search farmers or milk types..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Featured Farmers */}
      <div>
        <h2 className="text-xl font-bold mb-4">🏆 Featured Farmers</h2>
        <div className="space-y-4">
          {filteredFarmers.map(farmer => (
            <div key={farmer.id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{farmer.image}</span>
                    <div>
                      <h3 className="font-bold text-lg">{farmer.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{farmer.location}</span>
                        {farmer.blockchainVerified && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">⛓️ Blockchain Verified</span>}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="font-semibold text-blue-600">{farmer.milkType}</p>
                    <p className="text-sm text-gray-600">{farmer.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {farmer.certifications.map(cert => (
                        <span key={cert} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{cert}</span>
                      ))}
                    </div>
                  </div>

                  {/* IoT Data */}
                  <div className="bg-green-50 rounded-lg p-3 mb-3">
                    <h4 className="font-semibold text-green-800 mb-1">🔗 Live IoT Quality Data</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Temp:</span>
                        <span className="font-bold text-green-700 ml-1">{farmer.iotData.temperature}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quality:</span>
                        <span className="font-bold text-green-700 ml-1">{farmer.iotData.quality}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Updated:</span>
                        <span className="font-bold text-green-700 ml-1">{farmer.iotData.lastChecked}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{farmer.rating}</span>
                        <span className="text-sm text-gray-600">({farmer.reviews})</span>
                      </div>
                      <span className="font-bold text-xl text-green-600">₹{farmer.price}/L</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(farmer.id)}
                        className={`p-2 rounded-full transition-colors ${favorites.includes(farmer.id) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                        aria-label={favorites.includes(farmer.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(farmer.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => addToCart(farmer)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CartScreen: React.FC = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
          <button
            onClick={() => setCurrentScreen('home')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <h3 className="font-semibold">{item.farmerName}</h3>
                      <p className="text-sm text-gray-600">{item.milkType}</p>
                      <p className="text-green-600 font-bold">₹{item.price}/L</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const newCart = cart.map(cartItem =>
                            cartItem.farmerId === item.farmerId
                              ? { ...cartItem, quantity: cartItem.quantity - 1 }
                              : cartItem
                          ).filter(cartItem => cartItem.quantity > 0);
                          setCart(newCart);
                        }}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-lg min-w-[2rem] text-center">{item.quantity}L</span>
                      <button
                        onClick={() => {
                          setCart(cart.map(cartItem =>
                            cartItem.farmerId === item.farmerId
                              ? { ...cartItem, quantity: cartItem.quantity + 1 }
                              : cartItem
                          ));
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI-Powered Delivery Optimization */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-blue-800 mb-2">🤖 AI Delivery Optimization</h3>
            <div className="text-sm space-y-1">
              <p>• Optimal delivery time: Tomorrow 7-9 AM</p>
              <p>• Route optimized for freshness</p>
              <p>• 15% delivery discount applied automatically</p>
            </div>
          </div>

          {/* Blockchain Payment Security */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-green-800 mb-2">⛓️ Blockchain Security</h3>
            <div className="text-sm space-y-1">
              <p>• Smart contract ensures farmer payment</p>
              <p>• Complete supply chain transparency</p>
              <p>• Zero adulteration guarantee</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span>Subtotal:</span>
              <span className="font-bold">₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>AI-Optimized Delivery:</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all"
          >
            <Check className="w-5 h-5" />
            <span>Place Order with Smart Contract</span>
          </button>
        </>
      )}
    </div>
  );

  const OrdersScreen: React.FC = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">📦 Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-4 border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold">Order #{order.id.toString().slice(-4)}</h3>
                  <p className="text-sm text-gray-600">Placed at {order.orderTime}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* IoT Tracking */}
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <h4 className="font-semibold text-blue-800 mb-1">🔗 Live IoT Tracking</h4>
                <div className="text-sm space-y-1">
                  <p>• Milk temperature: 3.5°C ✅</p>
                  <p>• Quality sensors: All green ✅</p>
                  <p>• Estimated delivery: {order.deliveryEstimate}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.farmerName} - {item.quantity}L</span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ProfileScreen: React.FC = () => (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold">Welcome to MilkDirect</h2>
        <p className="text-gray-600">Fresh • Fair • Direct</p>
      </div>

      {/* Technology Features */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <h3 className="font-bold mb-2">🤖 AI Features Active</h3>
          <div className="text-sm space-y-1">
            <p>• Smart demand prediction enabled</p>
            <p>• Route optimization saving 30% delivery time</p>
            <p>• Personalized farmer recommendations</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4 text-white">
          <h3 className="font-bold mb-2">⛓️ Blockchain Security</h3>
          <div className="text-sm space-y-1">
            <p>• All transactions secured with smart contracts</p>
            <p>• Complete supply chain transparency</p>
            <p>• Guaranteed authentic, pure milk</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
          <h3 className="font-bold mb-2">🔗 IoT Quality Monitoring</h3>
          <div className="text-sm space-y-1">
            <p>• Real-time milk quality sensors</p>
            <p>• Cold chain temperature monitoring</p>
            <p>• Instant quality alerts and notifications</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-white border rounded-xl p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
          <span>🏆 Loyalty Program</span>
          <span className="text-blue-600 font-semibold">Gold Member</span>
        </button>
        <button className="w-full bg-white border rounded-xl p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
          <span>⚙️ AI Preferences</span>
          <span className="text-gray-400">→</span>
        </button>
        <button className="w-full bg-white border rounded-xl p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
          <span>🔔 IoT Notifications</span>
          <span className="text-gray-400">→</span>
        </button>
        <button className="w-full bg-white border rounded-xl p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
          <span>⛓️ Blockchain History</span>
          <span className="text-gray-400">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">🥛 MilkDirect</h1>
          <div className="flex items-center space-x-3">
            {cart.length > 0 && (
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
            )}
            <Bell className="w-6 h-6" />
          </div>
        </div>
        <p className="text-sm opacity-90">AI • Blockchain • IoT Powered</p>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-20 flex items-center space-x-2 animate-pulse">
          <Check className="w-5 h-5" />
          <span>Added to cart with blockchain verification!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-20">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'cart' && <CartScreen />}
        {currentScreen === 'orders' && <OrdersScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around py-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen('cart')}
            className={`flex flex-col items-center space-y-1 relative transition-colors ${currentScreen === 'cart' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </button>
          <button
            onClick={() => setCurrentScreen('orders')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'orders' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <Truck className="w-6 h-6" />
            <span className="text-xs">Orders</span>
          </button>
          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'profile' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilkMarketplaceApp;