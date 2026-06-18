
export function savedStatsExpired(lastTimeSavedStr) {
    if (lastTimeSavedStr === null) {
        return true
    }

    const lastTime = parseInt(lastTimeSavedStr, 10)
    const now = Date.now()
    const diffSec = Math.floor((now - lastTime) / 1000)

    if (diffSec > 100000) {
        return true
    } else {
        return false
    }
}