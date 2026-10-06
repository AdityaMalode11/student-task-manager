const http = require('http');
const client = require('prom-client');

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
    name: 'task_manager_http_requests_total',
    help: 'Total HTTP requests received'
});

register.registerMetric(httpRequestCounter);

const server = http.createServer(async (req, res) => {
    httpRequestCounter.inc();

    if (req.url === '/metrics') {
        res.setHeader('Content-Type', register.contentType);
        res.end(await register.metrics());
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Student Task Manager Metrics Server is running');
});

const PORT = 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Metrics server running on port ${PORT}`);
});
