module.exports = async function teardown() {
  await global.server.context.driver.close();
  await global.server.stop();
}