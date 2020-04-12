import { useEffect, useState, ChangeEvent, useRef, FormEvent } from "react";
import axios from "axios";
import PatientInfo from "../components/PatientInfo";
import PatientData from "../components/PatientData";

const getQueryParams = (params, url) => {
  let href = url;
  //this expression is to get the query strings
  let reg = new RegExp("[?&]" + params + "=([^&#]*)", "i");
  let queryString = reg.exec(href);
  return queryString ? queryString[1] : null;
};

const Index = () => {
  const [page, setPage] = useState(0);
  const accessTokenRef = useRef<HTMLInputElement>();
  const patientNameRef = useRef<HTMLInputElement>();
  const [maxPages, setMaxPages] = useState(0);
  const [patientData, setPatientData] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);

  const fetchPatientData = async (
    page: number,
    accessToken?: string,
    patientName?: string
  ) => {
    const { data, error, errorMessage } = await axios.get(
      `/api/patientData?skip=${page * 10}${
        accessToken ? "&accessToken=" + accessToken : ""
      }
      ${patientName ? "&patientName=" + patientName : ""}`
    );
    if (error) {
      console.error(errorMessage);
    }
    if (maxPages === 0) {
      setMaxPages(Math.ceil(data.total / 10));
    }
    setPatientData(data);
  };

  const fetchPatientInfo = async (
    accessToken?: string,
    patientName?: string
  ) => {
    const { data, error, errorMessage } = await axios.get(
      `/api/patientInfo?${accessToken ? "accessToken=" + accessToken : ""}
      ${patientName ? "&patientName=" + patientName : ""}`
    );
    if (error) {
      console.error(errorMessage);
    }
    setPatientInfo(data);
  };

  const onPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const p = parseInt(e.target.value);
    setPage(p);
    fetchPatientData(p);
  };

  const getPatientInfo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let accessToken = accessTokenRef?.current.value;
    let patientName = patientNameRef?.current.value;

    setPage(0);
    fetchPatientData(0, accessToken, patientName);
    fetchPatientInfo(accessToken, patientName);
  };

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
