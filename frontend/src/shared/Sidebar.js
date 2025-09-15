import { Link, useLocation } from "react-router-dom";

const steps = [
  { number: 1, label: "Company Information", path: "/company" },
  { number: 2, label: "Production Details", path: "/productiondetails" },
  { number: 3, label: "Certifications & Compliance", path: "/certifications" },
  { number: 4, label: "Mandatory Documents Upload", path: "/documentsupload" },
  { number: 5, label: "Operational Data", path: "/operationaldata" },
  { number: 6, label: "Electrical Infrastructure", path: "/electrical" },
  { number: 7, label: "HVAC & Refrigeration", path: "/hvac" },
  { number: 8, label: "SCADA / BMS Systems", path: "/scada" },
  { number: 9, label: "Building Envelope / Thermal Efficiency", path: "/building" },
  { number: 10, label: "Major Batch Equipment", path: "/equipment" },
//   { number: 11, label: "Overview", path: "/overview" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="step-sidebar">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`step ${location.pathname === step.path ? "active" : ""}`}
        >
          <Link
            to={step.path}
            className={`d-flex align-items-center text-decoration-none fw-bold ${
              location.pathname === step.path ? "text-dark" : "text-secondary"
            }`}
          >
            <div className="circle">{step.number}</div>
            {step.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
