export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const healthData = {
    status: 'healthy',
    services: [
      {
        name: 'API Gateway',
        status: 'operational',
        responseTime: 45
      },
      {
        name: 'Database',
        status: 'operational',
        responseTime: 12
      },
      {
        name: 'Cache',
        status: 'operational',
        responseTime: 8
      }
    ],
    uptime: '99.9%',
    timestamp: new Date().toISOString(),
    version: '2.6.1'
  };

  res.status(200).json(healthData);
}

