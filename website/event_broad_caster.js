

export class EventBroadCaster {
    constructor() {
        this.events = {}
    }

    on(event, callbackFunc) {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(callbackFunc)
    }

    distribute(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callBackFunc => {
                callBackFunc(data)
            })
        }
    }
}