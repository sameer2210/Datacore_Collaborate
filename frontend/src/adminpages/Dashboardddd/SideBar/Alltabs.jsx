import React, { useEffect, useState } from "react";
import axios from "../../../instant/backAxios";
import { useParams } from "react-router-dom";

const AllTabs = () => {
  const { section } = useParams(); // 👈 sidebar route param

  const [data, setData] = useState({
    company: [],
    production: [],
    operational: [],
    electrical: [],
    certifications: [],
    uploads: [],
    hvac: [],
    scada: [],
    thermal: [],
    equipment: [],
    pdf: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const backendurl = "http://localhost:8000"; // 👈 file links ke liye

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } };

        const [
          companyRes,
          prodRes,
          opRes,
          elecRes,
          certRes,
          uploadRes,
          hvacRes,
          scadaRes,
          thermalRes,
          equipRes,
          pdfRes,
          userRes,
        ] = await Promise.all([
          axios.get(`/admin/company`, headers),
          axios.get(`/admin/production`, headers),
          axios.get(`/admin/operational-data`, headers),
          axios.get(`/admin/electrical-data`, headers),
          axios.get(`/admin/certifications`, headers),
          axios.get(`/admin/upload-documents`, headers),
          axios.get(`/admin/hvac`, headers),
          axios.get(`/admin/scada`, headers),
          axios.get(`/admin/thermal-efficiency`, headers),
          axios.get(`/admin/equipment`, headers),
          axios.get(`/admin/pdf`, headers),
          axios.get(`/admin/all-user`, headers),
        ]);

        const uniqueUsers = Array.from(
          new Map(userRes.data.data.map((u) => [u.email, u])).values()
        );

        setData({
          company: companyRes.data.data,
          production: prodRes.data.data,
          operational: opRes.data.data,
          electrical: elecRes.data.data,
          certifications: certRes.data.data,
          uploads: uploadRes.data.data,
          hvac: hvacRes.data.data,
          scada: scadaRes.data.data,
          thermal: thermalRes.data.data,
          equipment: equipRes.data.data,
          pdf: pdfRes.data.data,
          users: uniqueUsers,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  if (loading) return <p className="text-center p-4">Loading data...</p>;





const DataTable = ({ title, headers, rows }) => (
  <div className="card shadow-sm rounded-3 border-0 mb-3">
    {/* Title / Heading */}
    <div
      className="card-header border-0 d-flex align-items-center"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 0%, #f1f3f5 100%)",
        borderLeft: "4px solid #343a40",
      }}
    >
      <h6
        className="mb-0 fw-semibold text-dark"
        style={{ fontSize: "17px" }}
      >
        {title}
      </h6>
    </div>

    {/* Table */}
    <div className="table-responsive custom-scrollbar">
      <table className="table table-sm align-middle mb-0">
        <thead
          style={{
            backgroundColor: "#f1f3f5",
            borderBottom: "2px solid #dee2e6",
          }}
        >
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="fw-semibold text-secondary text-uppercase py-2 px-2"
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((r, i) => (
              <tr
                key={i}
                className={`hover-row ${i % 2 === 0 ? "striped-row" : ""}`}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f3f5",
                }}
              >
                {r.map((cell, j) => (
                  <td
                    key={j}
                    className="py-2 px-2 text-dark"
                    style={{ fontSize: "14px", whiteSpace: "nowrap" }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center text-muted fst-italic py-3"
                style={{ fontSize: "13px" }}
              >
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Extra CSS */}
    <style>
      {`
        .hover-row:hover {
          background-color: #f8f9fa;
          transition: background-color 0.2s ease-in-out;
        }
        .striped-row {
          background-color: #fcfcfd;
        }

        /* Slim styled scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px; /* thin scrollbar */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ced4da;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #adb5bd;
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ced4da #f8f9fa;
        }
      `}
    </style>
  </div>
);










  // ✅ Render according to section
  const renderSection = () => {
    switch (section) {
      case "company":
        return (
          <DataTable
            title="Companies"
            headers={[
              "S.No",
              "Industry",
              "City",
              "Country",
              "Contact Person",
              "Address 1",
              "Address 2",
              "Location",
              "Establishment Year",
              "License Number",
              "Created At",
              "Updated At",
              "User ID",
            ]}
            rows={data.company.map((c, i) => [
              i + 1,
              c.industryName,
              c.city,
              c.country,
              c.contactPerson,
              c.address1,
              c.address2,
              c.location,
              c.establishmentYear,
              c.licenseNumber,
              new Date(c.createdAt).toLocaleDateString(),
              new Date(c.updatedAt).toLocaleDateString(),
              c.userId,
            ])}
          />
        );

      case "production":
        return (
          <DataTable
            title="Production"
            headers={[
              "S.No",
              "Final Products",
              "Raw Materials",
              "Technology Used",
              "Production Capacity",
              "Created At",
              "Updated At",
              "User ID",
            ]}
            rows={data.production.map((p, i) => [
              i + 1,
              p.finalProducts,
              p.rawMaterials,
              p.technologyUsed,
              p.productionCapacity,
              new Date(p.createdAt).toLocaleDateString(),
              new Date(p.updatedAt).toLocaleDateString(),
              p.user_id,
            ])}
          />
        );

      case "uploads":
        return (
          <DataTable
            title="Uploaded Documents"
            headers={[
              "S.No",
              "Bills",
              "Energy Balance",
              "GHG Report",
              "Manufacturing Desc",
              "Mass Balance",
              "Plant Layout",
              "Trade License",
              "Water Balance",
              "WWTP Layout",
              "Created At",
              "Updated At",
              "User ID",
            ]}
            rows={data.uploads.map((a, i) => [
              i + 1,
              (a.bills || []).map((bill, idx) => (
                <div key={idx}>
                  <a href={`${backendurl}${bill}`} target="_blank" rel="noreferrer">
                    View Bill {idx + 1}
                  </a>
                </div>
              )),
              a.energyBalance && (
                <a href={`${backendurl}${a.energyBalance}`} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
              a.ghgReport && (
                <a href={`${backendurl}${a.ghgReport}`} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
              a.manufacturingDesc && (
                <a href={`${backendurl}${a.manufacturingDesc}`} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
              a.massBalance && (
                <a href={`${backendurl}${a.massBalance}`} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
              a.plantLayout && (
                <a href={`${backendurl}${a.plantLayout}`} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
              a.tradeLicense && (
                <a href={`${backendurl}${a.tradeLicense}`} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
              a.waterBalance && (
                <a href={`${backendurl}${a.waterBalance}`} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
              a.wwtpLayout && (
                <a href={`${backendurl}${a.wwtpLayout}`} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
              a.createdAt && new Date(a.createdAt).toLocaleDateString(),
              a.updatedAt && new Date(a.updatedAt).toLocaleDateString(),
              a.userId,
            ])}
          />
        );

     

        case "operational":
  return (
    <DataTable
      title="Operational Data"
      headers={[
        "S.No",
        "Annual Production",
        "Shutdown Days",
        "Diesel Consumed",
        "Fuel Gas",
        "Grid Electricity",
        "Solar Power",
        "Fresh Water",
        "Recycled Water",
        "Heavy Oil Consumed",
        "Independent Power",
        "Direct Hire Employees",
        "Indirect Hire Employees",
        "Energy Investment",
        "Created At",
        "Updated At",
        "User ID",
      ]}
      rows={data.operational.map((o, i) => [
        i + 1,
        o.annualProduction,
        o.shutdownDays,
        o.dieselConsumed,
        o.fuelGasConsumed,
        o.gridElectricity,
        o.solarPower,
        o.freshWater,
        o.recycledWater,
        o.heavyOilConsumed,
        o.independentPower,
        o.directHireEmployees,
        o.indirectHireEmployees,
        o.energyInvestment,
        new Date(o.createdAt).toLocaleDateString(),
        new Date(o.updatedAt).toLocaleDateString(),
        o.userId,
      ])}
    />
  );


case "electrical":
  return (
    <DataTable
      title="Electrical Data"
      headers={[
        "S.No",
        "Load Date",
        "Load Time",
        "Loads",
        "Banks",
        "LV Panels",
        "MV Panels",
        "Filters",
        "Stabilizer Present",
        "Stabilizer Brand",
        "Stabilizer KVA",
        "VFD App Type",
        "VFD Date",
        "VFD Location",
        "VFD Model",
        "Failures",
        "Diagram File",
        "Load File",
        "Created At",
        "Updated At",
        "User ID",
      ]}
      rows={data.electrical.map((e, i) => [
        i + 1,
        e.loadDate,
        e.loadTime,
        e.loads?.join(", "),
        e.banks
          ?.map(
            (b) =>
              `Brand: ${b.brand}, KVA: ${b.kva}, Detuned: ${b.detuned}, Shunt: ${b.shunt}`
          )
          .join(" | "),
        e.lvPanels?.map((l) => `Size: ${l.size}, Qty: ${l.qty}`).join(" | "),
        e.mvPanels?.map((m) => `Size: ${m.size}, Qty: ${m.qty}`).join(" | "),
        e.filters
          ?.map(
            (f) =>
              `Type: ${f.type}, Panel: ${f.panel}, Installation: ${f.installation}, Model: ${f.model}`
          )
          .join(" | "),
        e.stabilizer?.present || "-",
        e.stabilizer?.brand || "-",
        e.stabilizer?.kva || "-",
        e.vfds?.appType || "-",
        e.vfds?.date || "-",
        e.vfds?.location || "-",
        e.vfds?.model || "-",
        e.failures,
        e.diagramFile ? (
          <a
            href={`${backendurl}${e.diagramFile}`}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>
        ) : (
          "-"
        ),
        e.loadFile ? (
          <a
            href={`${backendurl}${e.loadFile}`}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>
        ) : (
          "-"
        ),
        new Date(e.createdAt).toLocaleDateString(),
        new Date(e.updatedAt).toLocaleDateString(),
        e.userId,
      ])}
    />
  );


case "certifications":
  return (
    <DataTable
      title="Certifications"
      headers={[
        "S.No",
        "Benchmark Certifications",
        "ISO Certified",
        "Waste to Energy",
        "Wastewater Reuse",
        "Created At",
        "Updated At",
        "User ID",
      ]}
      rows={data.certifications.map((c, i) => [
        i + 1,
        c.benchmarkCertifications,
        c.isoCertified ? "Yes" : "No",
        c.wasteToEnergy ? "Yes" : "No",
        c.wastewaterReuse ? "Yes" : "No",
        new Date(c.createdAt).toLocaleDateString(),
        new Date(c.updatedAt).toLocaleDateString(),
        c.user_id,
      ])}
    />
  );


  case "hvac":
  return (
    <DataTable
      title="HVAC"
      headers={[
        "S.No",
        "AHUs",
        "FAHUs",
        "FCUs",
        "Chillers",
        "Chiller Type",
        "Calorifiers",
        "Cooling Towers",
        "VFDs",
        "Created At",
        "Updated At",
        "User ID",
      ]}
      rows={data.hvac.map((h, i) => [
        i + 1,
        h.ahus,
        h.fahus,
        h.fcus,
        h.chillers,
        h.chillerType,
        h.calorifiers,
        h.coolingTowers,
        h.vfds,
        new Date(h.createdAt).toLocaleDateString(),
        new Date(h.updatedAt).toLocaleDateString(),
        h.userId,
      ])}
    />
  );

  case "scada":
  return (
    <DataTable
      title="SCADA"
      headers={[
        "S.No",
        "SCADA Present",
        "SCADA Features",
        "Created At",
        "Updated At",
        "User ID",
      ]}
      rows={data.scada.map((s, i) => [
        i + 1,
        s.scadaPresent,
        s.scadaFeatures,
        new Date(s.createdAt).toLocaleDateString(),
        new Date(s.updatedAt).toLocaleDateString(),
        s.userId,
      ])}
    />
  );

case "thermal":
  return (
    <DataTable
      title="Thermal Efficiency"
      headers={[
        "S.No",
        "Cool Roof",
        "Cooled",
        "Roof Insulation",
        "Envelope Specs",
        "Window Films",
        "Created At",
        "Updated At",
        "User ID",
      ]}
      rows={data.thermal.map((t, i) => [
        i + 1,
        t.coolRoof,
        t.cooled,
        t.roofInsulation,
        t.envelopeSpecs,
        t.windowFilms,
        new Date(t.createdAt).toLocaleDateString(),
        new Date(t.updatedAt).toLocaleDateString(),
        t.userId,
      ])}
    />
  );


  case "equipment":
  return (
    <DataTable
      title="Equipment"
      headers={[
        "S.No",
        "Equipment Name",
        "Equipment Type",
        "Manufacturer",
        "Installation Year",
        "Rated Power",
        "Batch Duration",
        "Batches per Day",
        "Comments",
        "Created At",
        "Updated At",
        "User ID",
      ]}
      rows={data.equipment.map((eq, i) => [
        i + 1,
        eq.equipmentName,
        eq.equipmentType,
        eq.manufacturer,
        eq.installationYear,
        eq.ratedPower,
        eq.batchDuration,
        eq.batchesPerDay,
        eq.comments,
        new Date(eq.createdAt).toLocaleDateString(),
        new Date(eq.updatedAt).toLocaleDateString(),
        eq.userId,
      ])}
    />
  );


  case "pdf":
  return (
    <DataTable
      title="PDF Files"
      headers={[
        "S.No",
        "Filename",
        "Original Name",
        "File Path",
        "Upload Date",
        "User ID",
      ]}
      rows={data.pdf.map((p, i) => [
        i + 1,
        p.filename,
        p.originalName,
        p.filePath ? (
          <a
            href={`${backendurl}${p.filePath}`}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>
        ) : (
          "-"
        ),
        new Date(p.uploadDate).toLocaleDateString(),
        p.userId,
      ])}
    />
  );


      default:
        return <p className="text-center mt-5">Select a tab from sidebar</p>;
    }
  };

  return <div className="container py-4">{renderSection()}</div>;
};

export default AllTabs;
