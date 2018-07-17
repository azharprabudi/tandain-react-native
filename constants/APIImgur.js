import axios from "axios";

class APIImgur {
  constructor(API_KEY) {
    this.apiKey = API_KEY;
  }

  createAlbum(title = "", description = "", privacy = "public") {
    const URL = "https://api.imgur.com/3/album";
    if (this.apiKey !== "") {
      return axios
        .post(
          URL,
          {
            title,
            description,
            privacy
          },
          {
            headers: {
              Authorization: `Client-ID ${this.apiKey}`
            }
          }
        )
        .then(({ data }) => data)
        .catch(e => e);
    }
  }

  addImageToAlbum(image, album, type = "base64") {
    const URL = "https://api.imgur.com/3/image";
    if (this.apiKey !== "") {
      return axios
        .post(
          URL,
          {
            image,
            album,
            type
          },
          {
            headers: {
              Authorization: `Client-ID ${this.apiKey}`
            }
          }
        )
        .then(({ data }) => data)
        .catch(e => e);
    }
  }

  getImageInAlbum(album) {
    if (this.apiKey !== "") {
      const URL = `https://api.imgur.com/3/album/${album}/images`;
      return axios
        .get(URL, {
          headers: {
            Authorization: `Client-ID ${this.apiKey}`
          }
        })
        .then(({ data }) => data)
        .catch(e => e);
    }
  }
}

export default APIImgur;
