const Service = require("egg").Service;

class HomeService extends Service {
  async findRank(id) {
    const res = await this.app.mysql.query(
      "select * from rank where type_id = ?",
      id
    );
    return res;
  }
  async insertRank(data) {
    await this.app.mysql.insert("rank", data);
  }
  async updateRank(data) {
    await this.app.mysql.update("rank", data);
  }

  async delList(data) {
    const res = await this.app.mysql.delete("list", {
      type_id: data.type_id
    });
    return res;
  }

  async insertList(data) {
    await this.app.mysql.insert("list", data);
  }
}

module.exports = HomeService;
