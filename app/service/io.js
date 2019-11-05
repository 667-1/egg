const Service = require("egg").Service;

class IoService extends Service {
  async findUser(name) {
    const res = await this.app.mysql.query(
      "select * from user where name = ?",
      name
    );
    return res;
  }

  async findRoomUser(roomid) {
    const res = await this.app.mysql.query(
      "select * from user where roomid = ?",
      roomid
    );
    return res;
  }

  async inserUser(data) {
    await this.app.mysql.insert("user", data);
  }

  async findMsg(info) {
    const res = await this.app.mysql.select("message", {
      where: { roomid: info.roomid }
    });
    return res;
  }

  async insertMsg(data) {
    await this.app.mysql.insert("message", data);
  }

  async findRoom() {
    const res = await this.app.mysql.query("select * from rooms");
    return res;
  }

  async findJoinRoom(id) {
    const res = await this.app.mysql.query(
      "select * from rooms where id = ?",
      id
    );
    return res;
  }
}

module.exports = IoService;
