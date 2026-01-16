const express = require('express');
const router = express.Router();
const config = require('../config/config');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'GENEXUS-AI',
    version: '1.0.0',
    environment: config.server.environment,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    api: 'GENEXUS-AI API',
    version: '1.0.0',
    description: 'Professional API server integrating all Pollinations.ai capabilities',
    endpoints: {
      images: '/api/images',
      videos: '/api/videos',
      chat: '/api/chat',
      edit: '/api/edit',
      health: '/health'
    },
    documentation: 'See README.md for complete documentation',
    license: 'MIT License'
  });
});

// Version info
router.get('/version', (req, res) => {
  const packageJson = require('../../package.json');
  res.json({
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    author: packageJson.author,
    license: packageJson.license,
    dependencies: Object.keys(packageJson.dependencies).length,
    devDependencies: Object.keys(packageJson.devDependencies).length
  });
});

module.exports = router;