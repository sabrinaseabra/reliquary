const AWS = require('aws-sdk');
const { logger } = require('./logger');

/**
 * List the versions ids for the secret specified
 * @param secretName
 * @param region
 */
const listVersions = (secretName, region = 'us-east-1') => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  client.listSecretVersionIds({ SecretId: secretName, MaxResults: 10, IncludeDeprecated: true },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        logger.info('%O', data);
      }
    });
};

module.exports = { listVersions };
