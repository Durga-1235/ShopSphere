import { useEffect, useState } from 'react'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products')
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then(data => setProducts(data))
      .catch(() => alert('Backend connection failed'))
      .finally(() => setLoading(false))
  }, [])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Available stock limit reached')
          return prev
        }
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id, amount) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, item.quantity + amount)) }
          : item
      )
    )
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const toggleWishlist = (product) => {
    setWishlist(prev =>
      prev.some(item => item.id === product.id)
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product]
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  )

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || product.category === category)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 md:px-16 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">ShopSphere.</h1>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowCart(false)}
            className="px-4 py-2 rounded-full hover:bg-green-50"
          >
            Home
          </button>
          <button
            onClick={() => setShowCart(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-full"
          >
            🛒 Cart ({totalItems})
          </button>
        </div>
      </nav>

      {showCart ? (
        <section className="px-6 md:px-16 py-12">
          <h2 className="text-3xl font-bold mb-8">Your Shopping Cart</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl flex justify-between items-center gap-4">
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-green-600">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-100 rounded">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-100 rounded">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl h-fit">
                <h3 className="text-xl font-bold mb-5">Order Summary</h3>
                <p className="flex justify-between mb-3">
                  Items <span>{totalItems}</span>
                </p>
                <p className="flex justify-between text-xl font-bold border-t pt-4">
                  Total <span>₹{totalPrice.toFixed(2)}</span>
                </p>
                <button
                  onClick={() => alert('Checkout demo: Order flow ready for integration.')}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-full"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="mx-6 md:mx-16 mt-8 rounded-3xl bg-green-50 p-8 md:p-16">
            <p className="text-green-700 font-semibold mb-4">FRESHNESS DELIVERED TO YOUR DOOR</p>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
              Fresh groceries, <span className="text-green-600">happy living.</span>
            </h2>
            <p className="text-gray-600 mt-5 text-lg">
              Shop fresh fruits, vegetables and daily essentials at affordable prices.
            </p>
            <a href="#products" className="inline-block mt-7 bg-green-600 text-white px-8 py-3 rounded-full">
              Shop Now →
            </a>
          </section>

          <section className="px-6 md:px-16 mt-12">
            <h2 className="text-3xl font-bold mb-5">Shop by Category</h2>
            <div className="flex flex-wrap gap-3">
              {['All', 'Fruits', 'Vegetables', 'Dairy'].map(item => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-6 py-3 rounded-full ${category === item ? 'bg-green-600 text-white' : 'bg-white border'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section id="products" className="px-6 md:px-16 mt-12 mb-16">
            <div className="flex flex-col md:flex-row justify-between gap-5 mb-7">
              <h2 className="text-3xl font-bold">Popular Products</h2>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="border rounded-full px-5 py-3 w-full md:w-72"
              />
            </div>

            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white p-5 rounded-2xl shadow-sm">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="flex justify-between mt-4">
                      <p className="text-green-600">{product.category}</p>
                      <button onClick={() => toggleWishlist(product)} className="text-xl">
                        {wishlist.some(item => item.id === product.id) ? '❤️' : '♡'}
                      </button>
                    </div>
                    <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                    <div className="flex justify-between items-center mt-5">
                      <p className="text-xl font-bold">₹{product.price}</p>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-green-600 text-white px-5 py-2 rounded-full"
                      >
                        Add to Cart
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Stock: {product.stock}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <footer className="bg-gray-900 text-white text-center py-7">
        <h2 className="text-xl font-bold text-green-400">ShopSphere.</h2>
        <p className="text-gray-400 mt-2">Fresh choices. Happy shopping.</p>
        <p className="text-gray-500 text-sm mt-4">© 2026 ShopSphere. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App