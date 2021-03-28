const upbitSocket = () => {
    return new Promise(function(resolve, reject) {
        const connect = new WebSocket('wss://api.upbit.com/websocket/v1')
        connect.binaryType = 'arraybuffer'
        connect.onopen = function() {
            resolve(connect)
        }
        connect.onerror = function(error) {
            reject(error)
        }
    })
}

export {
    upbitSocket
}
