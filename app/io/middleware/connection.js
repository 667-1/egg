const md5 = require("md5-node");

module.exports = app => {
  return async (ctx, next) => {
    const nsp = ctx.app.io.of("/websocket");

    // ctx.socket.on("success", info => {
    //   // ctx.socket.send("socket连接成功!");
    // });
    // let id = info.id;

    ctx.socket.on("login", info => {
      console.log(info);
      // const token = info.token;
      ctx.service.io.findUser(info.name).then(res => {
        console.log(res);
        const data = {
          name: info.name,
          password: info.password,
          avatar: info.avatar,
          time: new Date().toLocaleString(),
          token: md5(info.name + parseInt(new Date().getTime() / 1000)),
          limit: md5(
            info.name + parseInt(new Date().getTime() / 1000 + 60 * 60)
          )
        };
        if (!res.length) {
          ctx.service.io.inserUser(data).then(res => {
            ctx.socket.send({
              type: "login",
              status: 200,
              name: data.name,
              token: data.token
            });
            // ctx.socket.join("room", () => {
            //   nsp.to("room").send(`欢迎${info.name}加入！`);
            // });
          });
        } else if (
          info.name != res[0].name ||
          info.password != res[0].password
        ) {
          ctx.socket.send({
            type: "loginerr",
            status: 100
          });
        } else {
          ctx.service.login.updateUser({
            id: res[0].id,
            ...data,
            limit: res[0].limit
          });
          ctx.socket.send({
            type: "login",
            status: 200,
            name: data.name,
            token: data.token
          });
          // console.log(id);
          // console.log(ctx.socket.id);
          // ctx.service.io.findMsg(info.name).then(res => {
          //   ctx.socket.join("room", () => {
          //     nsp.to("room").send(`尊贵的${info.name}欢迎回来！`);
          //     res.forEach(item => {
          //       nsp.to("room").send(item);
          //     });
          //   });
          // });
        }
      });
    });

    // ctx.socket.on("token", info => {
    //   ctx.service.io.findUser(info.name).then(res => {
    //     console.log("testtoken", res);
    //     const now = md5(info.name + parseInt(new Date().getTime()));
    //     console.log(now);
    //     // const now = 'a78e1e3a6988ff558628f5ad2bd26297';
    //     const limit = (res[0] && res[0].limit) || "";
    //     if (now == limit) {
    //       ctx.socket.disconnect();
    //     }
    //   });
    // });

    ctx.socket.on("online", info => {
      console.log("online", info);
      const room = "room" + info.roomid;
      ctx.service.io
        .insertMsg({
          name: info.name,
          time: info.time,
          message: info.message,
          roomid: info.roomid,
          avatar: info.avatar
        })
        .then(res => {
          // ctx.socket.send({
          //   type: "message",
          //   list: info
          // });
          // ctx.service.io.findMsg(info).then(res => {
          //   ctx.socket.send({
          //     type: "message",
          //     list: res
          //   });
          // });
          nsp.to(room).send({
            type: "updatemsg",
            info: info
          });
        });
    });

    ctx.socket.on("findroom", () => {
      ctx.service.io.findRoom().then(res => {
        // nsp.to("room").send(res);
        console.log(res);
        ctx.socket.send({
          type: "room",
          list: res
        });
      });
    });

    ctx.socket.on("joinroom", info => {
      console.log(info);
      const room = "room" + info.roomid;
      ctx.socket.join(room, () => {
        // nsp.to(room).send(`欢迎${info.name}加入！`);
        // nsp.adapter.clients([room], (err, clients) => {
        //   console.log(err, clients);
        // });
        ctx.service.io.findUser(info.name).then(res => {
          ctx.service.login
            .updateUser({ ...res[0], roomid: info.roomid })
            .then(() => {
              ctx.service.io.findRoomUser(info.roomid).then(res => {
                // console.log("login", res);
                nsp.to(room).send({
                  type: "onlineusers",
                  num: res.length
                });
              });
            });
        });

        ctx.service.io.findJoinRoom(info.roomid).then(res => {
          console.log(res);
          nsp.to(room).send({
            type: "roomname",
            name: res[0].name
          });
        });
        ctx.service.io.findMsg(info).then(res => {
          ctx.socket.send({
            type: "message",
            list: res
          });
        });
      });
    });

    ctx.socket.on("leaveroom", info => {
      const room = "room" + info.roomid;
      // console.log("leave", info);
      ctx.service.io.findUser(info.name).then(res => {
        ctx.service.login.updateUser({ ...res[0], roomid: 0 }).then(() => {
          ctx.service.io.findRoomUser(info.roomid).then(res => {
            console.log("leave", res);
            nsp.to(room).send({
              type: "onlineusers",
              num: res.length
            });
          });
        });
      });
    });
    // await next();
    // execute when disconnect.
    console.log("disconnection!");
  };
};
