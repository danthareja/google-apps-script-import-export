module.exports = {
  DEFAULT_SUBDIR: 'src',
  STORAGE_FILE: getUserHome() + '/.gapps',
  CONFIG_NAME: 'gas-tools.json',
  WEBSERVER_PORT: 2386,
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
