import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken, patientResourceEndpoint } from "./_utils";
import { serialize } from "cookie";

/*
Queries the API for the patient profile info,
*/

const getPatientInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // If no access token exists or is passed in, we get an access token and set it in the cookie
    let accessToken = (req.query["accessToken"] ||
      req.cookies["access_token"]) as string;
    let expiresIn = "0";

    if (!accessToken) {
      const tokenResponse = await getAccessToken(
        req.query["patientID"] as string
      );
      accessToken = tokenResponse.accessToken;
      expiresIn = tokenResponse.expiresIn;

      res.setHeader(
        "Set-Cookie",
        serialize("access_token", accessToken, {
          path: "/",
          // to account for network delays the cookie is expired a bit early
          maxAge: parseInt(expiresIn) - 50,
        })
      );
    }

    // Once we have an access token we query the api for the patient profile info
    const { data } = await axios.get(
      patientResourceEndpoint(accessToken, req.query["patientID"] as string)
    );

    // returns the data
    res.json(data);
  } catch (e) {
    res.json({ error: true, errorMessage: e });
  }
};

export default getPatientInfo;
