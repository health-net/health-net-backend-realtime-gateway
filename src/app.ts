import http from 'http';
import path from 'path';
import fs from 'fs';
import net from 'net';
import WebSocket from 'ws';
import mqtt from 'mqtt';
import { Broker } from './broker';
import { authorize } from './authorization';

const port = process.env.PORT || 3000;
const brokerHost = process.env.BROKER_HOST || 'localhost';
const brokerPort = (process.env.BROKER_PORT !== undefined) ? parseInt(process.env.BROKER_PORT) : 1883;

const httpServer = http.createServer();
const webSocketServer = new WebSocket.Server({ noServer: true });
const broker = new Broker(brokerHost, brokerPort);

httpServer.on('upgrade', (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
    try {
        authorize(request, fs.readFileSync(path.resolve(__dirname, '../keys/public-key.pem'), 'utf-8'));
        webSocketServer.handleUpgrade(request, socket, head, (webSocket: WebSocket) => {
            webSocketServer.emit('connection', webSocket, request);
        });
    } catch (error) {
        socket.destroy(error);
    }
});

webSocketServer.on('connection', (webSocket: WebSocket, request: http.IncomingMessage) => {
    const mqttClient = mqtt.connect(broker.url);
    if (request.url === undefined) {
        webSocket.close()
    }
    if (request.url?.startsWith('/')) {
        request.url = request.url.slice(1);
    }
    if (request.url?.endsWith('/set')) {
        webSocket.on('message', (data) => {
            mqttClient.publish(request.url || '', data.toString());
        });
    } else {
        mqttClient.on('connect', () => {
            mqttClient.subscribe(request.url || '');
        });
        mqttClient.on('message', (topic, message) => {
            webSocket.send(message.toString());
        });
    }
});

httpServer.listen(port, () => {
    console.log(`Health-Net Realtime Gateway listening on port ${port}`);
});
