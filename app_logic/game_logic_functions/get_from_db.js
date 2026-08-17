

export async function getLatestChartId() {
    const response = await fetch(`/currentChartId`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        },
    });

    const currentChartId = await response.json();

    if (response.status === 200) {
        
        return currentChartId
    } else {
        return null
    }
}

export async function getLatestChartData(dataType) {
    const response = await fetch(`/currentChartData?dataType=${dataType}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        },
    });

    const currentChartData = await response.json();

    if (response.status === 200) {
        return currentChartData
    } else {
        return null
    }
}