import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StockTracker() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [selectedStock, setSelectedStock] = useState(null)
  const [chartData, setChartData] = useState([])
  const [chartLoading, setChartLoading] = useState(false)
  const [timeframe, setTimeframe] = useState('1y')

  // Fetch stock data from Flask backend
  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/stocks')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data')
      }
      
      const data = await response.json()
      setStocks(data)
      setLastUpdate(new Date().toLocaleTimeString())
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching stocks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    fetchStocks()
  }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchStocks, 60000)
    return () => clearInterval(interval)
  }, [])

  // Fetch chart data for selected stock
  const fetchChartData = async (symbol, period = timeframe) => {
    try {
      setChartLoading(true)
      const response = await fetch(`http://localhost:5000/api/stock/${symbol}/history?period=${period}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch chart data')
      }
      
      const data = await response.json()
      setChartData(data)
    } catch (err) {
      console.error('Error fetching chart:', err)
      setChartData([])
    } finally {
      setChartLoading(false)
    }
  }

  // Handle stock card click
  const handleStockClick = (stock) => {
    if (selectedStock?.symbol === stock.symbol) {
      // Close chart if same stock clicked
      setSelectedStock(null)
      setChartData([])
    } else {
      // Open chart for new stock
      setSelectedStock(stock)
      setTimeframe('1y')
      fetchChartData(stock.symbol, '1y')
    }
  }

  // Handle timeframe change
  const handleTimeframeChange = (period) => {
    setTimeframe(period)
    if (selectedStock) {
      fetchChartData(selectedStock.symbol, period)
    }
  }

  if (loading && stocks.length === 0) {
    return (
      <div className="stock-tracker">
        <h2>Stock Tracker</h2>
        <p>Loading stock data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="stock-tracker">
        <h2>Stock Tracker</h2>
        <p className="error">Error: {error}</p>
        <p>Make sure the Flask backend is running on port 5000</p>
        <button onClick={fetchStocks}>Retry</button>
      </div>
    )
  }

  return (
    <div className="stock-tracker">
      <div className="stock-header">
        <h2>Stock Watchlist</h2>
        <div className="stock-controls">
          {lastUpdate && <span className="last-update">Last updated: {lastUpdate}</span>}
          <button onClick={fetchStocks} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="stock-grid">
        {stocks.map((stock) => (
          <div 
            key={stock.symbol} 
            className={`stock-card ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
            onClick={() => handleStockClick(stock)}
            style={{ cursor: 'pointer' }}
          >
            <div className="stock-symbol">{stock.symbol}</div>
            <div className="stock-name">{stock.name}</div>
            <div className="stock-price">${stock.price.toFixed(2)}</div>
            <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      {selectedStock && (
        <div className="chart-container">
          <div className="chart-header">
            <h3>{selectedStock.symbol} - Price History</h3>
            <div className="timeframe-buttons">
              {['1mo', '3mo', '6mo', '1y', '5y'].map((period) => (
                <button
                  key={period}
                  className={`timeframe-btn ${timeframe === period ? 'active' : ''}`}
                  onClick={() => handleTimeframeChange(period)}
                >
                  {period === '1mo' ? '1M' : period === '3mo' ? '3M' : period === '6mo' ? '6M' : period === '1y' ? '1Y' : '5Y'}
                </button>
              ))}
            </div>
            <button className="close-btn" onClick={() => { setSelectedStock(null); setChartData([]); setTimeframe('1y') }}>Close</button>
          </div>
          
          {chartLoading ? (
            <p>Loading chart...</p>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2d5f3f" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No chart data available</p>
          )}
        </div>
      )}
    </div>
  )
}
