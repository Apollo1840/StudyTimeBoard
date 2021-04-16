import HttpService from "./HttpService";
import { SERVER_BASE_URL, STUDYKING_URL } from "../shared/serverUrls.js";

export default class StudyKingService {
  static getStudyKing() {
    return new Promise((resolve, reject) => {
      HttpService.get(
        SERVER_BASE_URL + STUDYKING_URL,
        (data) => {
          resolve(JSON.parse(data));
        },
        (errorMsg) => {
          reject(errorMsg);
        }
      );
    });
  }
}
