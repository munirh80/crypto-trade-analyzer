import CryptoAPI from './api.js';

class CryptoAnalyzer {
    constructor() {
        this.updateInterval = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('startAnalysis')?.addEventListener('click', () => this.startAnalysis());
    }

    async startAnalysis() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        const coinId = document.getElementById('coinSelect').value;
        const entryPrice = parseFloat(document.getElementById('entryPrice').value);
        const positionType = document.getElementById('positionType').value;

        if (!this.validateInputs(entryPrice)) return;

        document.getElementById('results').classList.remove('hidden');
        
        await this.updateAnalysis(coinId, entryPrice, positionType);
        this.updateInterval = setInterval(() => {
            this.updateAnalysis(coinId, entryPrice, positionType);
        }, 30000);
    }

    validateInputs(entryPrice) {
        if (!entryPrice || isNaN(entryPrice)) {
            alert('Please enter a valid entry price');
            return false;
        }
        return true;
    }

    async updateAnalysis(coinId, entryPrice, positionType) {
        const priceData = await CryptoAPI.fetchPrice(coinId);
        if (!priceData) return;

        const historicalData = await CryptoAPI.fetchHistoricalData(coinId);
        if (!historicalData) return;

        this.updateDisplay(priceData, historicalData, entryPrice, positionType);
    }

    updateDisplay(priceData, historicalData, entryPrice, positionType) {
        // Update price information
        const pnl = this.calculatePNL(priceData.price, entryPrice, positionType);
        this.updatePriceDisplay(priceData, pnl);
        
        // Update technical analysis
        const analysis = this.analyzeTechnicals(historicalData, pnl);
        this.updateSignals(analysis);
    }

    calculatePNL(currentPrice, entryPrice, positionType) {
        return positionType === 'long' 
            ? ((currentPrice - entryPrice) / entryPrice) * 100
            : ((entryPrice - currentPrice) / entryPrice) * 100;
    }

    analyzeTechnicals(historicalData, pnl) {
        // Add your technical analysis logic here
        return {
            isBreakout: Math.abs(pnl) > 2,
            signal: pnl >= 2 ? 'TAKE PROFIT' : pnl <= -1 ? 'STOP LOSS' : 'HOLD'
        };
    }

    updatePriceDisplay(priceData, pnl) {
        document.getElementById('currentPrice').textContent = `$${priceData.price.toFixed(2)}`;
        document.getElementById('pnl').textContent = `${pnl.toFixed(2)}%`;
        document.getElementById('priceChange').textContent = `${priceData.change24h.toFixed(2)}%`;
    }

    updateSignals(analysis) {
        const signalElement = document.getElementById('signal');
        signalElement.textContent = analysis.signal;
        signalElement.className = `text-xl font-bold ${
            analysis.signal === 'TAKE PROFIT' ? 'text-green-600' :
            analysis.signal === 'STOP LOSS' ? 'text-red-600' :
            'text-gray-600'
        }`;
    }
}

// Initialize the analyzer
document.addEventListener('DOMContentLoaded', () => {
    new CryptoAnalyzer();
});
