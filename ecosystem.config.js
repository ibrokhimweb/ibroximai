module.exports = {
  apps: [
    {
      name: 'ibroximai',
      script: 'dist/index.js', // build qilingan fayl
      cwd: '/var/www/ibroxim/bots/ibroximai',
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
