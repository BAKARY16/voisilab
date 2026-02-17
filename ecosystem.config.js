module.exports = {
  apps: [
    {
      name: 'voisilab-backend',
      cwd: './server',
      script: 'dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3500
      }
    },
    {
      name: 'voisilab-frontend',
      cwd: './front-end',
      script: 'node_modules/.bin/next',
      args: 'start -p 3501',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3501
      }
    },
    {
      name: 'voisilab-admin',
      cwd: './admins',
      script: 'node_modules/.bin/serve',
      args: '-s dist -l 3502',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
