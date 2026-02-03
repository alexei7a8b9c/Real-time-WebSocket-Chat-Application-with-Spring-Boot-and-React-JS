import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

class WebSocketService {
    constructor() {
        this.client = null
        this.connected = false
        this.subscriptions = []
    }
    connect(onConnectCallback, onErrorCallback) {
        const socket = new SockJS('/ws')
        this.client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log('STOMP: ' + str),
            onConnect: (frame) => {
                this.connected = true
                console.log('Connected: ' + frame)
                if (onConnectCallback) onConnectCallback()
            },
            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message'])
                console.error('Details: ' + frame.body)
                if (onErrorCallback) onErrorCallback(frame)
            },
            onWebSocketClose: () => {
                this.connected = false
                console.log('Connection closed')
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error: ', event)
                if (onErrorCallback) onErrorCallback(event)
            }
        })
        this.client.activate()
    }
    disconnect() {
        if (this.client) {
            this.subscriptions.forEach(sub => sub.unsubscribe())
            this.subscriptions = []
            this.client.deactivate()
            this.connected = false
        }
    }
    subscribe(destination, callback) {
        if (this.client && this.connected) {
            const subscription = this.client.subscribe(destination, (message) => {
                try {
                    const body = JSON.parse(message.body)
                    callback(body)
                } catch (e) {
                    console.error('Failed to parse message:', e)
                    callback(message.body)
                }
            })
            this.subscriptions.push(subscription)
            return subscription
        }
    }
    send(destination, body) {
        if (this.client && this.connected) {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(body)
            })
            return true
        }
        console.error('Cannot send - not connected')
        return false
    }
    isConnected() {
        return this.connected
    }
}

export default new WebSocketService()