import axios from "axios";

class APIMaps {
  constructor(API_KEY) {
    this.apiKey = API_KEY;
  }

  static getUrlAutoComplete(
    API_KEY = "",
    query,
    returnType,
    language,
    types,
    components
  ) {
    let URL = `https://maps.googleapis.com/maps/api/place/autocomplete/${returnType}?input=${query}&types=${types}&language=${language}&components=${components}`;
    if (API_KEY !== "") {
      URL += `&key=${API_KEY}`;
    }
    return URL;
  }

  static getUrlGetLonglat(
    API_KEY = "",
    placeId,
    returnType,
    language,
    region,
    fields
  ) {
    let URL = `https://maps.googleapis.com/maps/api/place/details/${returnType}?placeid=${placeId}&language=${language}&region=${region}&fields=${fields}`;
    if (API_KEY !== "") {
      URL += `&key=${API_KEY}`;
    }
    return URL;
  }

  getQueryAutoComplete(
    query,
    returnType = "json",
    language = "id",
    types = "address",
    components = "country:id"
  ) {
    const URL = APIMaps.getUrlAutoComplete(
      this.apiKey,
      query,
      returnType,
      language,
      types,
      components
    );
    return axios
      .get(URL)
      .then(({ data }) => data)
      .catch(e => e);
  }

  getLonglatFromPlaceId(
    placeId,
    returnType = "json",
    language = "en",
    region = "id",
    fields = "geometry"
  ) {
    const URL = APIMaps.getUrlGetLonglat(
      this.apiKey,
      placeId,
      returnType,
      language,
      region,
      fields
    );
    return axios
      .get(URL)
      .then(({ data }) => data)
      .catch(e => e);
  }

  getAddressFromLatLong(latitude, longitude, returnType = "json") {
    let URL = `http://maps.googleapis.com/maps/api/geocode/${returnType}?sensor=true`;
    if (latitude !== "" && longitude !== "") {
      URL += latlng = `&latlng=${latitude},${longitude}`;
    }
    return axios
      .get(URL)
      .then(({ data }) => data)
      .catch(e => e);
  }
}

export default APIMaps;
