import { LAST_SAVED_HIST_TIME_KEY, SAVED_HIST_KEY } from "../constants.js";
import Chart from 'chart.js/auto';

export async function getHistData() {
    const response = await fetch(`http://localhost:5050/globalStatsHist`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        },
    });

    const histogramData = await response.json();

    if (response.status === 200) {
        localStorage.setItem(SAVED_HIST_KEY, JSON.stringify(histogramData))
        localStorage.setItem(LAST_SAVED_HIST_TIME_KEY, JSON.stringify(Date.now()))
        return histogramData
    } else {
        return null
    }
}

export function renderHist(histogramData, userProfit) {
    const canvas = document.getElementById('profitHistogramCanvas')
    const placeholder = document.getElementById('histogram-placeholder')
    if (histogramData === null) {
        placeholder.classList.remove('hidden')
        canvas.classList.add('hidden')
        return
    }
    placeholder.classList.add('hidden')
    canvas.classList.remove('hidden')

    let targetIndex = -1;
    let minDiff = Infinity;

    histogramData.forEach((bin, index) => {
        const binCenter = (bin.binStart + bin.binEnd) / 2;
        const diff = Math.abs(userProfit - binCenter);
        
        if (diff < minDiff) {
            minDiff = diff;
            targetIndex = index;
        }
    });

    const chartLabels = histogramData.map(bin => (bin.binStart + bin.binEnd) / 2)

    const chartCounts = histogramData.map(bin => bin.count)

    const backgroundColors = chartCounts.map((_, index) => 
        index === targetIndex ? 'rgba(231, 76, 60, 0.8)' : 'rgba(52, 152, 219, 0.8)'
    )

    const borderColors = chartCounts.map((_, index) => 
        index === targetIndex ? 'rgba(192, 57, 43, 1)' : 'rgba(41, 128, 185, 1)'
    )

    const youAreHerePlugin = {
        id: 'youAreHereLabel',
        afterDatasetsDraw(chart) {
            if (targetIndex === -1) return

            const ctx = chart.ctx
            const meta = chart.getDatasetMeta(0)
            const bar = meta.data[targetIndex]

            if (!bar) return

            ctx.save()
            ctx.fillStyle = '#e74c3c'
            ctx.font = 'bold 12px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.fillText('You are here', bar.x, bar.y - 8)
            ctx.restore()
        }
    }

    const ctx = document.getElementById('profitHistogramCanvas').getContext('2d')

    const profitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Frequency',
                data: chartCounts,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                barPercentage: 1.0,
                categoryPercentage: 1.0
            }]
        },
        options: {
            layout: {
                padding: {
                    right: 30,
                    top: 25 
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: (tooltipItems) => {
                            return `Profit: ${tooltipItems[0].label}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    title: {
                        display: true,
                        text: 'Net Profit'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Num People'
                    }
                }
            }
        },
        plugins: [youAreHerePlugin] 
    })
}