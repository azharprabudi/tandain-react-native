import axios from "axios";

class APIOcr {
  constructor(API_KEY) {
    this.apiKey = API_KEY;
  }

  getTextFromImages(imageUrl, language = "eng", isOverlayRequired = true) {
    if (this.apiKey !== "") {
      const URL = `http://api.ocr.space/parse/imageurl?&apikey=${
        this.apiKey
      }&url=${imageUrl}&language=${language}&isOverlayRequired=${isOverlayRequired}`;
      return axios
        .get(URL)
        .then(({ data }) => data)
        .catch(e => e);
    }
  }
}

export default APIOcr;
