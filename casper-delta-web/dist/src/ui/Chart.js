import { createChart, LineSeries, LineType, AreaSeries } from 'lightweight-charts';
export class MarketChart {
    constructor(containerId) {
        const container = document.getElementById(containerId);
        if (!container)
            throw new Error(`Container ${containerId} not found`);
        this.chart = createChart(container, {
            layout: {
                background: { color: 'transparent' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: 'rgba(51, 65, 85, 0.1)' },
                horzLines: { color: 'rgba(51, 65, 85, 0.1)' },
            },
            width: container.clientWidth,
            height: container.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: 'rgba(51, 65, 85, 0.3)',
            },
            rightPriceScale: {
                visible: true,
                borderColor: 'rgba(51, 65, 85, 0.3)',
            },
            leftPriceScale: {
                visible: true,
                borderColor: 'rgba(51, 65, 85, 0.3)',
            },
        });
        // Price Series (Right Axis) - Simple Jagged Line
        this.priceSeries = this.chart.addSeries(LineSeries, {
            color: '#f97316', // Orange
            lineWidth: 2,
            title: 'Price',
            priceScaleId: 'right',
            lineType: LineType.Simple, // Reverted to jagged
            priceFormat: {
                type: 'price',
                precision: 6,
                minMove: 0.000001,
            },
        });
        // Long Liquidity Series (Left Axis) - Filled Area
        this.longLiquiditySeries = this.chart.addSeries(AreaSeries, {
            lineColor: '#10b981', // Emerald/Green
            topColor: 'rgba(16, 185, 129, 0.4)',
            bottomColor: 'rgba(16, 185, 129, 0.05)',
            lineWidth: 1,
            title: 'Long Liquidity',
            priceScaleId: 'left',
            lineType: LineType.Simple, // Reverted to jagged
            priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
            autoscaleInfoProvider: (original) => {
                const res = original();
                if (res !== null) {
                    res.priceRange.minValue = 0;
                }
                return res;
            },
        });
        // Short Liquidity Series (Left Axis) - Filled Area
        this.shortLiquiditySeries = this.chart.addSeries(AreaSeries, {
            lineColor: '#ef4444', // Red
            topColor: 'rgba(239, 68, 68, 0.4)',
            bottomColor: 'rgba(239, 68, 68, 0.05)',
            lineWidth: 1,
            title: 'Short Liquidity',
            priceScaleId: 'left',
            lineType: LineType.Simple, // Reverted to jagged
            priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
            autoscaleInfoProvider: (original) => {
                const res = original();
                if (res !== null) {
                    res.priceRange.minValue = 0;
                }
                return res;
            },
        });
        window.addEventListener('resize', () => {
            this.chart.applyOptions({
                width: container.clientWidth,
                height: container.clientHeight,
            });
        });
    }
    async refresh() {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0)
                return;
            const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            const priceData = [];
            const longLiqData = [];
            const shortLiqData = [];
            sortedData.forEach((row) => {
                const time = (Math.floor(new Date(row.timestamp + "Z").getTime() / 1000));
                // Price scaling
                const rawPrice = parseFloat(row.price);
                let price = rawPrice / 1e9;
                if (price < 0.0001) {
                    const altPrice = rawPrice / 1e5;
                    if (altPrice >= 0.0001 && altPrice <= 1000) {
                        price = altPrice;
                    }
                }
                priceData.push({ time, value: price });
                // Liquidity scaling
                const longLiq = parseFloat(row.long_liquidity) / 1e9;
                const shortLiq = parseFloat(row.short_liquidity) / 1e9;
                longLiqData.push({ time, value: longLiq });
                shortLiqData.push({ time, value: shortLiq });
            });
            this.priceSeries.setData(priceData);
            this.longLiquiditySeries.setData(longLiqData);
            this.shortLiquiditySeries.setData(shortLiqData);
            this.chart.timeScale().fitContent();
        }
        catch (error) {
            console.error('Failed to fetch market history:', error);
        }
    }
}
