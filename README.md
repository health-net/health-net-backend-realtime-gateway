# Health-Net Backend Realtime Gateway

WebSocket-MQTT Bridge (with authentication).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

```
node.js
```

### Installing

Install npm project dependencies
```
npm install
```

## Deployment

1. Add valid public-key.pem certificate in /keys
2. Set environment variables inline and run service

## Details
### Environment Variables
| Name         | Description      | Default value |
|--------------|------------------|---------------|
| SERVICE_PORT | The service port |  3000         |
| BROKER_HOST  | The broker host  | localhost     |
| BROKER_PORT  | The broker port  | 1883          |
