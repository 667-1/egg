const Controller = require("egg").Controller;
const md5 = require("md5-node");

class login extends Controller {
  async login() {
    const { ctx } = this;
    let params = ctx.request.body;
    const res = await ctx.service.login.findUser(params);
    const data = {
      ...params,
      time: Date.parse(new Date()) / 1000,
      token: md5(params.name + parseInt(new Date().getTime() / 1000)),
      limit: md5(params.name + parseInt(new Date().getTime() / 1000 + 1 * 60))
    };
    console.log(res);
    if (res && res.length) {
      // let limit = md5(
      //   res[0].name + parseInt(new Date().getTime() / 1000 + 1 * 60)
      // );
      // console.log(limit);
      // if (limit != res[0].limit) {
      //   ctx.body = "过期了！";
      // } else {
      //   ctx.body = "登陆成功!";
      // }
      await ctx.service.login.updateUser({ id: res[0].id, ...data });
    } else {
      await ctx.service.login.insertUser(data);
    }
    ctx.body = {
      msg: "登陆成功！",
      token: data.token
    };
  }
}

module.exports = login;
