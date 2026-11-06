
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const heroImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=90'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products')
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then(data => setProducts(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const addToCart = product => {
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
      if (product.stock < 1) return prev
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id, amount) => {
    setCart(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, Math.min(item.stock, item.quantity + amount)) }
        : item
    ))
  }

  const removeFromCart = id => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const toggleWishlist = product => {
    setWishlist(prev =>
      prev.some(item => item.id === product.id)
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product]
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredProducts = useMemo(() => products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || product.category === category)
  ), [products, search, category])

  const categoryItems = [
    { name: 'All', icon: '✳', subtitle: 'Explore everything' },
    { name: 'Fruits', icon: '🍎', subtitle: 'Nature’s sweetness' },
    { name: 'Vegetables', icon: '🥬', subtitle: 'Fresh from the farm' },
    { name: 'Dairy', icon: '🥛', subtitle: 'Daily essentials' }
  ]

  const goHome = () => {
    setShowCart(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="shop-app">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={goHome}>
            <span className="brand-name">ShopSphere<span>.</span></span>
            <span className="brand-tagline">FRESHNESS, SIMPLIFIED</span>
          </button>

          <nav className="header-nav">
            <button className={!showCart ? 'nav-link active' : 'nav-link'} onClick={goHome}>
              Home
            </button>
            <button className="cart-nav" onClick={() => setShowCart(true)}>
              <span>Bag</span>
              <span className="cart-count">{totalItems}</span>
            </button>
          </nav>
        </div>
      </header>

      {!showCart ? (
        <main>
          <section className="hero-wrap">
            <div className="hero-panel">
              <img className="hero-photo" src={heroImage} alt="Fresh market produce" />
              <div className="hero-shade" />
              <div className="hero-content">
                <span className="eyebrow hero-eyebrow">GOOD FOOD. GOOD DAYS.</span>
                <h1>Bring home<br /><em>the goodness.</em></h1>
                <p>Fresh fruits, crisp vegetables and everyday essentials — thoughtfully selected for your table.</p>
                <a href="#products" className="primary-button">Explore the market <span>↗</span></a>
                <div className="hero-note">
                  <span>Fresh picks</span>
                  <i />
                  <span>Everyday value</span>
                  <i />
                  <span>Easy shopping</span>
                </div>
              </div>
              <div className="hero-side-note">A FRESHER WAY TO SHOP</div>
            </div>
          </section>

          <section className="content-section category-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FIND YOUR FAVOURITES</span>
                <h2>Shop by category</h2>
              </div>
              <p>Everyday goodness, all in one place.</p>
            </div>

            <div className="category-grid">
              {categoryItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => {
                    setCategory(item.name)
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`category-card ${category === item.name ? 'selected' : ''}`}
                >
                  <span className="category-icon">{item.icon}</span>
                  <span className="category-copy">
                    <strong>{item.name === 'All' ? 'All products' : item.name}</strong>
                    <small>{item.subtitle}</small>
                  </span>
                  <span className="category-arrow">↗</span>
                </button>
              ))}
            </div>
          </section>

          <section className="content-section products-section" id="products">
            <div className="section-heading product-heading">
              <div>
                <span className="eyebrow">THE MARKET EDIT</span>
                <h2>Fresh finds for you</h2>
                <p>Simple ingredients. Better everyday choices.</p>
              </div>
              <label className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search the market..."
                />
              </label>
            </div>

            <div className="filter-row">
              {['All', 'Fruits', 'Vegetables', 'Dairy'].map(item => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={category === item ? 'filter-chip chosen' : 'filter-chip'}
                >
                  {item}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="message-panel">Preparing your fresh picks...</div>
            ) : error ? (
              <div className="message-panel">
                <strong>Products could not be loaded.</strong>
                <span>Start the FastAPI backend and refresh this page.</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="message-panel">
                <strong>No products found</strong>
                <span>Try a different search or category.</span>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <img src={product.image_url} alt={product.name} className="product-image" />
                      <span className="product-category">{product.category}</span>
                      <button
                        className="wishlist-button"
                        onClick={() => toggleWishlist(product)}
                        aria-label="Toggle wishlist"
                      >
                        {wishlist.some(item => item.id === product.id) ? '♥' : '♡'}
                      </button>
                    </div>
                    <div className="product-info">
                      <div>
                        <h3>{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                      </div>
                      <div className="product-bottom">
                        <div>
                          <strong className="product-price">₹{product.price}</strong>
                          <small className="stock-label">{product.stock} in stock</small>
                        </div>
                        <button
                          className="add-button"
                          onClick={() => addToCart(product)}
                          disabled={product.stock < 1}
                        >
                          {product.stock < 1 ? 'Sold out' : 'Add to bag +'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      ) : (
        <main className="cart-page">
          <button className="back-link" onClick={goHome}>← Continue shopping</button>
          <div className="cart-title">
            <span className="eyebrow">YOUR SELECTION</span>
            <h1>Your shopping bag</h1>
            <p>Review your items before you check out.</p>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-icon">◇</span>
              <h2>Your bag is waiting</h2>
              <p>Discover something fresh for your everyday table.</p>
              <button className="primary-button" onClick={goHome}>Explore products <span>↗</span></button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {cart.map(item => (
                  <article className="cart-item" key={item.id}>
                    <img src={item.image_url} alt={item.name} />
                    <div className="cart-item-details">
                      <span className="eyebrow">{item.category}</span>
                      <h3>{item.name}</h3>
                      <strong>₹{item.price}</strong>
                    </div>
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                      >+</button>
                    </div>
                    <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </article>
                ))}
              </div>

              <aside className="order-summary">
                <span className="eyebrow">YOUR ORDER</span>
                <h2>Order summary</h2>
                <div className="summary-line"><span>Items ({totalItems})</span><span>₹{totalPrice.toFixed(2)}</span></div>
                <div className="summary-line"><span>Delivery</span><span className="free-label">Free</span></div>
                <div className="summary-total"><span>Total</span><strong>₹{totalPrice.toFixed(2)}</strong></div>
                <button className="checkout-button" onClick={() => alert('Checkout demo: Payment integration is not enabled yet.')}>
                  Continue to checkout <span>→</span>
                </button>
                <p className="demo-note">Demo checkout · Payment integration not enabled</p>
              </aside>
            </div>
          )}
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-name">ShopSphere<span>.</span></span>
            <p>A little more freshness in<br />everyday living.</p>
          </div>
          <div className="footer-column">
            <strong>Explore</strong>
            <button onClick={goHome}>Home</button>
            <a href="#products" onClick={() => setShowCart(false)}>Shop products</a>
          </div>
          <div className="footer-column">
            <strong>Our promise</strong>
            <p>Thoughtful everyday essentials.<br />Simple shopping, made fresh.</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 ShopSphere. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default App
