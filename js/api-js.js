// API handling functions
class CryptoAPI {
    static async fetchPrice(coinId) {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
                {
                    headers: {
                        'accept': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return {
                price: data[coinId].usd,
                change24h: data[coinId].usd_24h_change
            };
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    }

    static async fetchHistoricalData(coinId) {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=minutes`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch historical data');
            }

            return await response.json();
        } catch (error) {
            console.error('Historical data error:', error);
            return null;
        }
    }
}

export default CryptoAPI;
