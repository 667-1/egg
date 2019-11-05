"use strict";

const Controller = require("egg").Controller;
const cheerio = require("cheerio");

class HomeController extends Controller {
  async test() {
    const { ctx } = this;

    let url = ctx.query.url;
    let id = url.split("id=")[1];
    let data = await ctx.curl(url, { dataType: "text" });
    const $ = cheerio.load(data.data);

    let title = $(".player__info_tit").text();
    let timg = $(".player__cover_img").attr("src");
    let time = $(".player__info_desc").text();

    let songList = [];
    let singerList = [];
    let rankList = [];
    $(".mod_song_list .song_list__txt").each((index, item) => {
      songList.push(item.children[0].data);
    });
    $(".mod_song_list .song_list__desc").each((index, item) => {
      singerList.push(item.children[0].data);
    });
    songList.forEach((item, index) => {
      let obj = {};
      obj.name = item;
      obj.author = singerList[index];
      obj.rank = index;
      rankList.push(obj);
    });

    let Rankres = await ctx.service.home.findRank(id);
    let Rankrow = {
      type: title,
      date: time,
      type_id: id
    };
    this.updateRank(Rankrow, Rankres, ctx);

    this.delRankList({ type_id: id }, ctx);
    rankList.forEach((item, index) => {
      let Listrow = {
        type_id: id,
        songname: item.name,
        singer: item.author,
        rank: index
      };
      this.updateRankList(Listrow, ctx);
    });

    ctx.body = { title, timg, time, rankList };
  }

  async updateRank(Rankrow, Rankres, ctx) {
    if (Rankres.length) {
      await ctx.service.home.updateRank({ ...Rankrow, id: Rankres[0].id });
    } else {
      await ctx.service.home.insertRank(Rankrow);
    }
  }

  async delRankList(Listrow, ctx) {
    return await ctx.service.home.delList(Listrow);
  }

  async updateRankList(Listrow, ctx) {
    await ctx.service.home.insertList(Listrow);
  }
}

module.exports = HomeController;
