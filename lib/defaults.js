module.exports = {
  DEFAULT_SUBDIR: 'gaps_src',
  PACKAGES_PATH: 'gaps_packages',
  PACKAGES_ROOT: 'https://storage.googleapis.com/gaps-packages/lab',
  STORAGE_FILE: getUserHome() + '/.gaps',
  CONFIG_NAME: 'config.json',
  WEBSERVER_PORT: 2386,
  DEFAULT_TARGET: 'dev'
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}