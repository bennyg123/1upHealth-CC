import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken, patientResourceEndpoint } from "./_utils";
import { serialize } from "cookie";

const getPatientInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let accessToken = (req.query["accessToken"] ||
      req.cookies["access_token"]) as string;
    let expiresIn = "0";

    if (!accessToken) {
      const tokenResponse = await getAccessToken(
        req.query["patientName"] as string
      );
      accessToken = tokenResponse.accessToken;
      expiresIn = tokenResponse.expiresIn;

      res.setHeader(
        "Set-Cookie",
        serialize("access_token", accessToken, {
          path: "/",
          maxAge: parseInt(expiresIn) - 50,
        })
      );
    }

    const { data } = await axios.get(
      patientResourceEndpoint(accessToken, req.query["patientName"] as string)
    );

    res.json(data);
  } catch (e) {
    res.json({ error: true, errorMessage: e });
  }
};

export default getPatientInfo;
