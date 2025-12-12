from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)  # Allow React frontend to make requests

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    """
    Fetch stock data for a predefined watchlist
    Returns: JSON with stock symbols, prices, and percent changes
    """
    # Your default watchlist - customize these!
    watchlist = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA']
    
    stocks_data = []
    
    for symbol in watchlist:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Get current price from info dict (multiple fallbacks)
            current_price = (
                info.get('currentPrice') or 
                info.get('regularMarketPrice') or 
                info.get('ask') or 
                info.get('bid') or
                0
            )
            
            # Get previous close
            previous_close = info.get('previousClose', current_price)
            
            if current_price == 0:
                raise ValueError(f"No price data for {symbol}")
                
            print(f"Got {symbol}: ${current_price:.2f}")
            
            # Calculate change percent
            if previous_close and previous_close != 0:
                change_percent = ((current_price - previous_close) / previous_close) * 100
            else:
                change_percent = 0
            
            # Get company name
            company_name = info.get('shortName') or info.get('longName') or symbol
            
            stocks_data.append({
                'symbol': symbol,
                'name': company_name,
                'price': round(float(current_price), 2) if current_price else 0,
                'change': round(float(change_percent), 2)
            })
            
            print(f"Successfully fetched {symbol}: ${current_price}, {change_percent}%")
            
        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            stocks_data.append({
                'symbol': symbol,
                'name': symbol,
                'price': 0,
                'change': 0
            })
    
    return jsonify(stocks_data)

@app.route('/api/stock/<symbol>/history', methods=['GET'])
def get_stock_history(symbol):
    """
    Fetch historical price data for a single stock
    Returns: JSON with timestamps and prices for charting
    """
    from flask import request
    
    # Get timeframe parameter (default to 1 year)
    timeframe = request.args.get('period', '1y')
    
    try:
        ticker = yf.Ticker(symbol)
        # Get historical data based on timeframe
        hist = yf.download(symbol, period=timeframe, interval='1d', progress=False)
        
        if hist.empty:
            return jsonify({'error': 'No data available'}), 404
        
        # Format data for Recharts
        chart_data = []
        for date, row in hist.iterrows():
            chart_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'price': round(float(row['Close']), 2)
            })
        
        return jsonify(chart_data)
        
    except Exception as e:
        print(f"Error fetching history for {symbol}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Stock API is running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
