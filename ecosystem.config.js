module.exports = {
  apps: [
    {
      name: 'saas-backend-api',
      script: './dist/index.js',
      instances: 'max', // Scales to number of CPU cores
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
      },
      // Graceful shutdown: Wait 30s for inflight requests
      kill_timeout: 30000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};