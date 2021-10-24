/** @format */

export const NEARBY_USER_SUCCESS = "NEARBY_USER_SUCCESS";
export const NEARBY_USER_FAIL = " NEARBY_USER_FAIL";

const BASE_URL = "http://192.168.96.1:3000";

export const nearByUser = (geoData) => {
  const { radius, lat, lng, limit = 5, offset = 0 } = geoData;

  return async (dispatch) => {
    // logic to make a post to REGISTER the user
    const result = await fetch(
      `${BASE_URL}/api/geo-data/nearby-users?limit=${limit}&offset=${offset}&radius=${radius}&lat=${lat}&lng=${lng}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resultData = await result.json();
    console.log("resultData", resultData);
    if (resultData.success) {
      dispatch({
        type: NEARBY_USER_SUCCESS,
        payload: resultData,
      });
    } else {
      dispatch({
        type: NEARBY_USER_FAIL,
      });
    }

    return resultData;
  };
};
