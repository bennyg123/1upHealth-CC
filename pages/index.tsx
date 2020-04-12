import { useEffect, useState, ChangeEvent, useRef, FormEvent } from "react";
import axios from "axios";
import PatientInfo from "../components/PatientInfo";
import PatientData from "../components/PatientData";

// Helper method to get query string from URL
const getQueryParams = (params, url) => {
  let href = url;
  //this expression is to get the query strings
  let reg = new RegExp("[?&]" + params + "=([^&#]*)", "i");
  let queryString = reg.exec(href);
  return queryString ? queryString[1] : null;
};

// Main react component
const Index = () => {
  const [page, setPage] = useState(0);
  const accessTokenRef = useRef<HTMLInputElement>();
  const patientNameRef = useRef<HTMLInputElement>();
  const patientIDRef = useRef<HTMLInputElement>();

  const [maxPages, setMaxPages] = useState(0);
  const [patientData, setPatientData] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);

  // Defaults the patient ID to Jason Argonaut
  const [patientID, setPatientID] = useState("f8fedcd9e6e5");
  const [patientName, setPatientName] = useState("testuser");

  // Fetches the patient data to display
  const fetchPatientData = async (
    page: number,
    accessToken?: string,
    pID?: string,
    pName?: string
  ) => {
    const { data } = await axios.get(
      `/api/patientData?skip=${page * 10}${
        accessToken ? "&accessToken=" + accessToken : ""
      }${patientID || pID ? "&patientID=" + patientID || pID : ""}${
        patientName || pName ? "&patientName=" + patientName || pName : ""}`
    );
    //If theres an error, we error out to the console
    if (data.error) {
      console.error(data.errorMessage);
    }
    // Since the results are limited to 10 at the max at a time,
    // we get the number of pages by taking the upper limit of the total / 10
    if (maxPages === 0) {
      setMaxPages(Math.ceil(data.total / 10));
    }

    // Sets the patient data in a state variable
    setPatientData(data);
  };

  const fetchPatientInfo = async (accessToken?: string, pID?: string, pName?: string) => {
    // fetches the patient info
    const { data } = await axios.get(
      `/api/patientInfo?${accessToken ? "accessToken=" + accessToken : ""}${
        patientID || pID ? "&patientID=" + patientID || pID : ""
      }${patientName || pName ? "&patientName=" + patientName || pName : ""}`
    );
    // errors out if we get an error
    if (data.error) {
      console.error(data.errorMessage);
    }
    // Sets the patient info data
    setPatientInfo(data);
  };

  // On page change, we requery the api for the patient data
  const onPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const p = parseInt(e.target.value);
    setPage(p);
    fetchPatientData(p);
  };

  // When the user submits an access token and patient name we requery patient info and patient data
  const getPatientInfo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let accessToken = accessTokenRef?.current.value;
    let pName = patientNameRef?.current.value;
    let pID = patientNameRef?.current.value;

    // Sets the patient ID for future queries
    // The access token is already set via the cookie
    setPatientID(pID);
    setPatientName(pName);

    setPage(0);
    fetchPatientData(0, accessToken, pID);
    fetchPatientInfo(accessToken, pID);
  };

  // On component load , we get the data for jason argonaught
  useEffect(() => {
    let page = parseInt(
      getQueryParams("page", window?.location?.search) || "1"
    );

    page = Math.max(page, 1);

    setPage(page - 1);
    fetchPatientData(page - 1);
    fetchPatientInfo();
  }, []);

  return (
    <>
      <form onSubmit={getPatientInfo}>
        <input
          ref={accessTokenRef}
          placeholder={"Please enter access token"}
          required
          type="text"
        />
        <input
          ref={patientIDRef}
          placeholder={"Please enter patient ID"}
          required
          type="text"
        />
        <input
          ref={patientNameRef}
          placeholder={"Please enter patient name"}
          required
          type="text"
        />
        <input type="submit" />
      </form>
      <br />
      <PatientInfo patientInfo={patientInfo} />
      {maxPages > 1 && (
        <select value={page} onChange={onPageChange}>
          {new Array(maxPages).fill(0).map((v, i) => (
            <option key={i} value={i}>
              Page {i + 1}
            </option>
          ))}
        </select>
      )}
      {patientData?.entry && <PatientData patientData={patientData.entry} />}
    </>
  );
};

export default Index;
