import { google } from "googleapis";
import ytdl from "ytdl-core";
import MyFile from "../../utils/MyFile";
import { join } from "path";
class ResultSearch {
  constructor(id, title, thumbail, channel, url) {
    this.id = id;
    this.title = title;
    this.thumbail = thumbail;
    this.channel = channel;
    this.url = url;
  }
}

class YoutubeModel {
  constructor(apikey) {
    this.youtube = google.youtube({
      version: "v3",
      auth: apikey,
    });
  }

  search(query, max = 10) {
    return new Promise((reslove, reject) => {
      this.youtube.search.list(
        {
          part: "id, snippet",
          q: query,
          type: "video",
          maxResults: max,
        },
        (err, res) => {
          if (err) return reject(err);
          const results = res.data.items.map((item) => {
            return new ResultSearch(
              item.id.videoId,
              item.snippet.title,
              item.snippet.thumbnails.default.url,
              item.snippet.channelTitle,
              "https://www.youtube.com/watch?v=" + item.id.videoId
            );
          });
          return reslove(results);
        }
      );
    });
  }

  /**
   *
   * @param {string} id
   * @param {'audio' | 'video'} type
   * @returns {Promise<MyFile>}
   */
  async download(id, type) {
    let info;
    try {
      info = await ytdl.getInfo(id);
    } catch (e) {
      // console.log(e);
      return Promise.reject({
        des: "Có lỗi xảy ra khi tìm kiếm video",
        err: e,
      });
    }
    const formats = ytdl.filterFormats(info.formats, (f) => {
      return this.getFormat(f, type);
    });
    if (formats.length == 0)
      return Promise.reject({
        des: "Không tìm thấy định dạng phù hợp",
        err: new Error("Không tìm thấy định dạng phù hợp"),
      });
    return new Promise((reslove, reject) => {
      const file = new MyFile(
        join(
          __dirname,
          "../../temp",
          `${id}.${type == "audio" ? "mp3" : "mp4"}`
        )
      );
      const stream = file.getWriteStream();
      ytdl
        .downloadFromInfo(info, { format: formats[0] })
        .on("error", (e) => {
          file.dispose()
          console.log(e)
          reject({
            des: "Có lỗi xảy ra khi tải xuống",
            err: e,
          });
        })
        .pipe(stream)
        .on("finish", () => {
          reslove(file);
        });
    });
  }

  getFormat(f, type) {
    switch (type) {
      case "video":
        return (
          f.hasAudio &&
          f.hasVideo &&
          f.container === "mp4"
        );
      case "audio":
        return f.contentLength < 25 * 1024 * 1024 && f.hasAudio;
      default:
        return false;
    }
  }
}

export default YoutubeModel;
