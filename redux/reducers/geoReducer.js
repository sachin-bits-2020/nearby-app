/** @format */

import { NEARBY_USER_FAIL, NEARBY_USER_SUCCESS } from "../actions/geoAction";

const initialState = {
  nearByUsers: [],
  errors: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NEARBY_USER_SUCCESS:
      console.log("NEARBY_USER_SUCCESS", action);
      return {
        ...state,
        nearByUsers: action.payload.users,
      };
    case NEARBY_USER_FAIL:
      return {
        ...state,
        errors: true,
      };
  }

  return state;
}
