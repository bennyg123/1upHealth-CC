type Props = {
  patientInfo?: {
    birthDate: string;
    deceasedBoolean: boolean;
    name: {
      given: string[];
      text: string;
      family: string[];
      use: string;
    }[];
    gender: string;
    maritalStatus: {
      text: string;
    };
    careProvider: {
      display: string;
    }[];
  };
};

const PatientInfo = ({ patientInfo }: Props) => {
  return patientInfo ? (
    <div className="patientInfo">
      <div className="patientInfo__profile">
        <img src="/generic.jpg" />
      </div>
      <div className="patientInfo__details">
        <h4>
          {" "}
          Name: <span>{patientInfo.name[0].text}</span>
        </h4>
        <h4>
          {" "}
          Birth Date: <span>{patientInfo.birthDate}</span>
        </h4>
        <h4>
          {" "}
          Gender: <span>{patientInfo.gender}</span>
        </h4>
        <h4>
          {" "}
          Marital Status: <span>{patientInfo.maritalStatus.text}</span>
        </h4>
        <h4>
          {" "}
          Care Provider: <span>{patientInfo.careProvider[0].display}</span>
        </h4>
      </div>

      <style jsx>{`
        .patientInfo {
          display: flex;
        }

        .patientInfo__profile {
          margin-left: auto;
        }

        .patientInfo__details {
          margin-left: 4rem;
          margin-right: auto;
        }
      `}</style>
    </div>
  ) : (
    <div className="patientInfo__loading">Loading Patient Info</div>
  );
};

export default PatientInfo;
