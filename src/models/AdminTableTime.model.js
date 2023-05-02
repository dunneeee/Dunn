import axios from "axios";
import { parse } from "node-html-parser";
import MyTime from "../../utils/MyTime";
class AdminTableTime {
  constructor(cookie) {
    this.cookie = cookie;
    this.tkb = [];
  }
  autoCall(ms) {
    const stopId = setInterval(async () => {
      const data = await this.callData()
      if(data) this.tkb = data
    }, ms);
    return () => {
      clearInterval(stopId);
    };
  }

  async getHTML() {
    try {
      const { data } = await axios.get("https://daotao.vku.udn.vn/sv/tkb", {
        headers: { cookie: this.cookie },
      });
      const table = parse(data).querySelector("table");
      const nodeList = table.querySelectorAll("tr");
      const days = nodeList.shift().querySelectorAll("th");
      return {
        days,
        datas: nodeList,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getData(params) {
    let temp = [
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
        "Chủ Nhật",
    ];
    let { days, datas } = params;
    days.shift();
    days = days.map((e, i) => {
      const t = e.textContent.match(/\d{2}\/\d{2}\/\d{4}/)[0] || "";
      const [dd, mm, yyyy] = t.split("/");
      const day = temp[i];

      return {
        day,
        dd,
        mm,
        yyyy,
      };
    });
    const newData = [];
    datas.forEach((e, i) => {
      const tds = e.querySelectorAll("td");
      tds.shift();
      const row = [];
      tds.forEach((te, ie) => {
        const lesson = Number(te.getAttribute("rowspan")) || 0;
        const t = te.innerHTML.match(/<.*>.*<\/.*>/)?.[0] || null;
        const room = t == null ? "" : te.innerHTML.slice(t.length).trim();
        row.push({
          lesson,
          name: te.querySelector("h2")?.textContent || "",
          room,
        });
      });
      newData.push(row);
    });
    return {
      days,
      datas: newData,
    };
  }

  formatData(params) {
    const { days, datas } = params;
    const row = datas.length;
    const col = datas[0].length;
    for (let i = 0; i < row; ++i) {
      const temp = [];
      for (let j = 0; j < col; ++j) {
        if (datas[i][j].lesson > 1) {
          temp.push({
            row: i,
            col: j,
            les: datas[i][j].lesson,
          });
        }
      }
      for (let k = 0; k < temp.length; k++) {
        datas[temp[k].row + 1].splice(temp[k].col, 0, {
          ...datas[temp[k].row][temp[k].col],
          lesson: --temp[k].les,
        });
      }
    }
    const result = {};
    const times = [
      {
        h: 7,
        m: 30,
        s: 0,
      },
      {
        h: 8,
        m: 30,
        s: 0,
      },
      {
        h: 9,
        m: 30,
        s: 0,
      },
      {
        h: 10,
        m: 30,
        s: 0,
      },
      {
        h: 11,
        m: 30,
        s: 0,
      },
      {
        h: 13,
        m: 0,
        s: 0,
      },
      {
        h: 14,
        m: 0,
        s: 0,
      },
      {
        h: 15,
        m: 0,
        s: 0,
      },
      {
        h: 16,
        m: 0,
        s: 0,
      },
      {
        h: 17,
        m: 0,
        s: 0,
      },
    ];
    for (let j = 0; j < col; ++j) {
      let t = [];
      for (let i = 0; i < row; ++i) {
        t.push({
          ...datas[i][j],
          lessonName: "Tiết " + (i + 1),
          start: times[i],
        });
      }
      result[days[j].day] = {
        time: {
          ...days[j],
        },
        datas: t,
      };
    }
    return [days.map((e) => e.day), result];
  }

  async test() {
    const html = await this.getHTML();
    const data = this.getData(html);
    const res = this.formatData(data);
    console.log(res[1]);
  }

  async callData() {
    const html = await this.getHTML();
    if (!html) return null;
    return this.formatData(this.getData(html));
  }

  async init() {
    this.tkb = await this.callData();
    return this.autoCall(1000 * 60 * 60);
  }

  getNow() {
    let day = MyTime.getDay();
    if(day === 0) day = 6;
    else day -= 1; 
    const [days, data] = this.tkb;
    const now = days[day];
    return data[now];
  }

  getDay(day) {
    const [days, data] = this.tkb;
    if(day === 0) day = 6;
    else day -= 1;
    return data[days[day]];
  }

  getWeek() {
    return this.tkb[1];
  }
}

export default AdminTableTime;
