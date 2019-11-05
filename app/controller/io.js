const Controller = require("egg").Controller;

class scoketIo extends Controller {
  async socket() {
    const { ctx } = this;
    console.log(this);
    const message = ctx.args[0];
    await ctx.socket.emit("res", `Hi! I've got your message: ${message}`);
  }
}

module.exports = scoketIo;
