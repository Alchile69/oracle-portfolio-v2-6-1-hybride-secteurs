export default function handler(req, res) {
  res.status(200).json({
    indicators: {
      growth: 2.5,
      inflation: 2.8,
      unemployment: 7.5
    },
    last_update: new Date().toISOString()
  });
}

