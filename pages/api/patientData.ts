import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import { getAccessToken, everythingEndpoint } from "./_utils";
import { PatientDataResponse } from "./_types/_patientData";
import mapPatientResources from "./_patientDataETL";

const getPatientData = async (req: NextApiRequest, res: NextApiResponse) => {
  const skip = req.query["skip"] as string;

  try {
    let accessToken = req.query["accessToken"] || req.cookies["access_token"];
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

    const { data }: { data: PatientDataResponse } = await axios.get(
      everythingEndpoint(skip, req.query["patientName"] as string),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({
      ...data,
      entry: mapPatientResources(data.entry),
    });
  } catch (e) {
    res.json({ error: true, errorMessage: e });
  }
};

export default getPatientData;
