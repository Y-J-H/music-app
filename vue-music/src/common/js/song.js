export default class Song {
  constructor ({
    songid,
    songmid,
    singer,
    songname,
    album,
    duration,
    image,
    url
  }) {
    this.id = songid
    this.mid = songmid
    this.singer = singer
    this.name = songname
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}
