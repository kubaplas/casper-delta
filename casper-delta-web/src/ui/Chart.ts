import { createChart, IChartApi, ISeriesApi, UTCTimestamp, LineSeries, LineType, AreaSeries } from 'lightweight-charts';

export class MarketChart {
    private chart: IChartApi;
    private shortRatioSeries: ISeriesApi<'Area'>;
    private longRatioSeries: ISeriesApi<'Area'>;
    private priceSeries: ISeriesApi<'Line'>;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) throw new Error(`Container ${containerId} not found`);

        this.chart = createChart(container, {
            layout: {
                background: { color: 'transparent' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: 'rgba(51, 65, 85, 0.05)' },
                horzLines: { color: 'rgba(51, 65, 85, 0.05)' },
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
                autoScale: false, // Fix scale for ratio
            },
        });

        // 1. Short Ratio Background (Red, constant 100%)
        this.shortRatioSeries = this.chart.addSeries(AreaSeries, {
            lineColor: 'transparent',
            topColor: 'rgba(239, 68, 68, 0.8)',
            bottomColor: 'rgba(239, 68, 68, 0.8)',
            lineWidth: 1,
            priceScaleId: 'left',
            lineType: LineType.WithSteps,
            lastValueVisible: false,
            priceLineVisible: false,
        });

        // 2. Long Ratio Foreground (Green, ratio%)
        this.longRatioSeries = this.chart.addSeries(AreaSeries, {
            lineColor: 'transparent',
            topColor: 'rgba(16, 185, 129, 0.8)',
            bottomColor: 'rgba(16, 185, 129, 0.8)',
            lineWidth: 1,
            priceScaleId: 'left',
            lineType: LineType.WithSteps,
            lastValueVisible: false,
            priceLineVisible: false,
        });

        // 3. Price Series (Right Axis) - Orange
        this.priceSeries = this.chart.addSeries(LineSeries, {
            color: '#f97316',
            lineWidth: 2,
            title: 'Price',
            priceScaleId: 'right',
            lineType: LineType.Simple,
            priceFormat: {
                type: 'price',
                precision: 6,
                minMove: 0.000001,
            },
        });

        // Apply fixed ratio scale
        this.chart.priceScale('left').applyOptions({
            visible: true,
            autoScale: false,
            scaleMargins: {
                top: 0.1,
                bottom: 0.1,
            },
        });

        // Ensure the range is exactly 0-100
        this.chart.priceScale('left').applyOptions({
            autoScale: false,
        });
        this.chart.priceScale('left').setVisibleRange({
            from: 0,
            to: 100,
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

            if (!Array.isArray(data) || data.length === 0) return;

            const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            const priceData: any[] = [];
            const shortRatioData: any[] = [];
            const longRatioData: any[] = [];

            sortedData.forEach((row: any) => {
                const time = (Math.floor(new Date(row.timestamp + "Z").getTime() / 1000)) as UTCTimestamp;

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

                // Ratio calculation
                const longLiq = parseFloat(row.long_liquidity) / 1e9;
                const shortLiq = parseFloat(row.short_liquidity) / 1e9;
                const total = longLiq + shortLiq;

                // Default to 50% if no liquidity
                const ratio = total > 0 ? (longLiq / total) * 100 : 50;

                shortRatioData.push({ time, value: 100 });
                longRatioData.push({ time, value: ratio });
            });

            this.shortRatioSeries.setData(shortRatioData);
            this.longRatioSeries.setData(longRatioData);
            this.priceSeries.setData(priceData);

            this.chart.timeScale().fitContent();
        } catch (error) {
            console.error('Failed to fetch market history:', error);
        }
    }
}
