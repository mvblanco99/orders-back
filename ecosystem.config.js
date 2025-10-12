module.exports = {
  apps: [
    {
      name: 'orders-back',
      script: './dist/src/main.js',
      max_memory_restart: '1024M',
      instances: 1,
      autorestart: true,
      watch: false,
      error_file: './logs/err.log',
    },
  ],
};