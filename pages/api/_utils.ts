import axios from "axios";

const CLIENT_ID = process.env.__CLIENT_ID__;
const CLIENT_SECRET = process.env.__CLIENT_SECRET__;
const PATIENT_NAME = process.env.__PATIENT_NAME__;
const PATIENT_ID = process.env.__PATIENT_ID__;

const API_ENDPOINT = "https://api.1up.health";
const getAccessTokenEndpoint = (patientName?: string) =>
  `${API_ENDPOINT}/user-management/v1/user/auth-code?app_user_id=${
    patientName || PATIENT_NAME
  }&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

const accessCodeEndpoint = (accessCode: string) =>
  `${API_ENDPOINT}/fhir/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${accessCode}&grant_type=authorization_code`;

export const patientResourceEndpoint = (
  accessCode: string,
  patientName?: string
) =>
  `${API_ENDPOINT}/fhir/dstu2/Patient/${
    patientName || PATIENT_ID
  }?access_token=${accessCode}`;

export const everythingEndpoint = (skip?: string, patientName?: string) =>
  `${API_ENDPOINT}/fhir/dstu2/Patient/${patientName || PATIENT_ID}/$everything${
    skip ? "?_skip=" + skip : ""
  }`;

export const getAccessToken = async (patientName?: string) => {
  const {
    data: { code: accessCode },
  } = await axios.post(getAccessTokenEndpoint(patientName));

  const {
    data: { access_token: accessToken, expires_in: expiresIn },
  } = await axios.post(accessCodeEndpoint(accessCode));

  return {
    accessToken,
    expiresIn,
  };
};
