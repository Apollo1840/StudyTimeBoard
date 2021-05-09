import HttpService from "./HttpService";
import { SERVER_BASE_URL, NUM_STARS_URL } from "../shared/serverUrls.js";

export default class c {
  // Get logged minutes of all users of last week
  static getNumberStars() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + NUM_STARS_URL,
        (data) => {
          resolve(data);
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }
}
