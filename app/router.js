"use strict";

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller, io } = app;
  router.get("/test", controller.home.test);
  router.post("/login", controller.login.login);
  router.get("/demo", controller.demo.demo);
  // router.get("/socket", controller.io.socket);
  // io.of('/websocket').route('socket', controller.io.socket);
};
