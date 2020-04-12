import axios from "axios";

// Environment variables to default to Jason Argonaut
const CLIENT_ID = process.env.__CLIENT_ID__;
const CLIENT_SECRET = process.env.__CLIENT_SECRET__;
const PATIENT_NAME = process.env.__PATIENT_NAME__;
const PATIENT_ID = process.env.__PATIENT_ID__;

const API_ENDPOINT = "https://api.1up.health";

// Helper methods to generate API Endpoints

const getAccessTokenEndpoint = (patientID?: string) =>
  `${API_ENDPOINT}/user-management/v1/user/auth-code?app_user_id=${
    patientID || PATIENT_NAME
  }&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

const accessCodeEndpoint = (accessCode: string) =>
  `${API_ENDPOINT}/fhir/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${accessCode}&grant_type=authorization_code`;

export const patientResourceEndpoint = (
  accessCode: string,
  patientID?: string
) =>
  `${API_ENDPOINT}/fhir/dstu2/Patient/${
    patientID || PATIENT_ID
  }?access_token=${accessCode}`;

export const everythingEndpoint = (skip?: string, patientID?: string) =>
  `${API_ENDPOINT}/fhir/dstu2/Patient/${patientID || PATIENT_ID}/$everything${
    skip ? "?_skip=" + skip : ""
  }`;

// Helper method to generate an access token from a patientID

export const getAccessToken = async (patientID?: string) => {
  const {
    data: { code: accessCode },
  } = await axios.post(getAccessTokenEndpoint(patientID));

  const {
    data: { access_token: accessToken, expires_in: expiresIn },
  } = await axios.post(accessCodeEndpoint(accessCode));

  return {
    accessToken,
    expiresIn,
  };
};
