import { Constants, Notifications } from "expo";
import uniqueId from "lodash/uniqueId";
import has from "lodash/has";

// my module
import APIOcr from "../constants/APIOcr";
import APIImgur from "../constants/APIImgur";
import APIKeys from "../constants/APIKeys";

const INITIAL_STATE = {
  list: []
};

export const SAVE_MARKER_POSITION = "SAVE_MARKER_POSITION";
export const REMOVE_MARKER_POSITION = "REMOVE_MARKER_POSITION";

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_MARKER_POSITION:
      return {
        list: [...state.list, action.payload.data]
      };
    case REMOVE_MARKER_POSITION:
      return state.list.filter(
        item => item.markerId !== action.payload.data.id
      );
    default:
      return state;
  }
};

/* delete marker */
export const deleteMarkerPosition = (
  id,
  pushNotificationId,
  callbackSuccess,
  callbackError
) => {
  return async dispatch => {
    try {
      // remove push notification using id notification
      await Notifications.dismissNotificationAsync(pushNotificationId);

      // do remove
      dispatch({
        type: REMOVE_MARKER_POSITION,
        payload: { data: { id } }
      });
      callbackSuccess();
    } catch (e) {
      callbackError(e);
    }
  };
};

export const submitForm = (data, callback, callbackError) => {
  return async dispatch => {
    try {
      let finalData = {
        note: data.note,
        maps: data.maps,
        reminderAt: data.reminderAt,
        useReminder: data.useReminder
      };

      const deviceId = Constants.deviceId;

      // declare img url api
      const mAPIImgur = new APIImgur(APIKeys.imgurClientId);

      // creating album
      if (data.images.length > 0) {
        const title = deviceId.substr(-5);
        const description = `this image from device ${deviceId} and from application tandain`;
        const album = await mAPIImgur.createAlbum(title, description);

        if (has(album, "data")) {
          // creating album success
          const { id, deletehash } = album.data;
          finalData = {
            ...finalData,
            album: {
              id,
              deletehash
            }
          };

          // save image to album
          let imageFirstLink = "";
          for (let i = 0; i < data.images.length; i++) {
            const saveImage = await mAPIImgur.addImageToAlbum(
              data.images[i].image,
              deletehash
            );
            // get first image link to get ocr value
            if (i === 0) {
              imageFirstLink = saveImage.data.link;
            }
          }

          if (imageFirstLink !== "") {
            // get text from first image
            const mAPIOcr = new APIOcr(APIKeys.ocr);
            const result = await mAPIOcr.getTextFromImages(imageFirstLink);

            // ocr success
            if (has(result, "ParsedResults")) {
              let ocr = [];

              // get content nested from ocr API
              let { ParsedResults } = result;
              if (ParsedResults.length > 0) {
                ParsedResults = ParsedResults[0];
                if (has(ParsedResults, "TextOverlay")) {
                  ParsedResults = ParsedResults.TextOverlay;
                  if (has(ParsedResults, "Lines")) {
                    for (let i = 0; i < ParsedResults.Lines.length; i++) {
                      ocr.push({
                        word: ParsedResults.Lines[i]
                      });
                    }
                  }
                }
              }

              finalData = {
                ...finalData,
                ocr
              };
            }
          }
        }
      }

      // use reminder
      if (data.useReminder) {
        // local notificatoin for expo
        const localNotification = {
          title: "Saatnya menuju lokasi yang anda tandai",
          body: data.maps.address,
          android: {
            sound: true,
            priority: "high",
            sticky: false,
            vibrate: true
          }
        };

        // change time value to timestamp
        const { date, time } = data.reminderAt;
        const [day, month, year] = date.split("/");
        const [hours, minutes] = time.split(":");

        // scheduling option
        const schedulingOptions = {
          time: new Date(
            Number(year),
            Number(month),
            Number(day),
            Number(hours),
            Number(minutes)
          ).getTime()
        };

        // add notification
        const id = await Notifications.scheduleLocalNotificationAsync(
          localNotification,
          schedulingOptions
        );

        finalData = {
          ...finalData,
          pushNotificationId: id
        };
      }

      // add id for remove the marker
      finalData = {
        ...finalData,
        markerId: uniqueId(`marker_${new Date().getTime()}_`)
      };

      // save data marker
      dispatch({
        type: SAVE_MARKER_POSITION,
        payload: { data: finalData }
      });

      callback();
    } catch (e) {
      callbackError(e);
    }
  };
};
