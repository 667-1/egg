const Controller = require("egg").Controller;

class demo extends Controller {
  async login() {
    const { ctx } = this;
    let data = await ctx.curl("http://you.ofzx.com/wap/user/login", {
      methods: 'POST',
      dataType: 'text',
      data: {
        mobile: '15038589618',
        sms_code: '7712'
      }
    });
    ctx.body = data.data;
  }
  async demo() {
    const { ctx } = this;
    let data = await ctx.curl("https://you.ofzx.com/wap/Act/index", {
      dataType: "text",
      headers: {}
    });
    ctx.body = data;
  }
}

module.exports = demo;
