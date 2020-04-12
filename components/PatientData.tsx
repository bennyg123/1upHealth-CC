const PatientData = ({
  patientData,
}: {
  patientData: {
    type: string;
    details: { [keys: string]: string };
  }[];
}) => {
  // Displays a simple representation of the patient data from the $everything query
  return (
    <>
      <ul className="patientData">
        {patientData.map((r, i) => (
          <li key={i} className="patientData__details">
            <h5>{r.type}</h5>
            {Object.keys(r.details).map((k, i) => (
              <div key={i}>
                <span>
                  <b>{k}</b> : {r.details[k]}`
                </span>
                <br />
              </div>
            ))}
          </li>
        ))}
      </ul>
      <style jsx>{`
        .patientData {
          display: flex;
          flex-wrap: wrap;
        }

        .patientData__details {
          max-width: 20rem;
          margin: 1rem;
          word-wrap: break-word;
        }
      `}</style>
    </>
  );
};

export default PatientData;
