const configs = {
  development: {
    SERVER_URI: 'http://localhost:5000',
  },
  production: {
    SERVER_URI: 'HEROKU_URI',
  },
};

module.exports.config = configs[process.env.NODE_ENV];
