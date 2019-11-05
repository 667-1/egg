const Service = require("egg").Service;

class LoginService extends Service {
  async findUser(params) {
    const res = await this.app.mysql.select("user", {
      where: { name: params.name, password: params.password }
    });
    return res;
  }
  async insertUser(data) {
    await this.app.mysql.insert("user", data);
  }
  async updateUser(data) {
    await this.app.mysql.update("user", data);
  }
}

module.exports = LoginService;
