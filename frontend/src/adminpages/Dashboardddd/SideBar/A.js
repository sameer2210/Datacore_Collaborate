

import React, { useEffect, useState } from "react";
import axios from "../../../instant/backAxios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../../loginpages/Header";
import { useNavigate } from "react-router-dom";


const backendurl = "http://localhost:8000"

const AllTabs = () => {
  const navigate = useNavigate();

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

        // Unique users by email
        const uniqueUsers = Array.from(
          new Map(userRes.data.data.map((u) => [u.email, u])).values()
        );

        console.log(companyRes.data.data,
          prodRes.data.data,
          opRes.data.data,
          elecRes.data.data,
          certRes.data.data,
          uploadRes.data.data,
          hvacRes.data.data,
          scadaRes.data.data,
          thermalRes.data.data,
          equipRes.data.data,
          pdfRes.data.data,
          uniqueUsers,);

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

  return (
    <div className="container py-4">
  
      <h1 className="mb-5 fw-bold text-center mt-5">User Data</h1>

 

      {/* Tabs */}
      <ul className="nav nav-tabs  mb-3" id="dashboardTabs" role="tablist">
        {[
          "company",
          "production",
          "operational",
          "electrical",
          "certifications",
          "uploads",
          "hvac",
          "scada",
          "thermal",
          "equipment",
          "pdf",
          "users",
        ].map((tab, i) => (
          <li className="nav-item" role="presentation" key={tab}>
            <button
              className={`nav-link ${i === 0 ? "active" : ""}`}
              id={`${tab}-tab`}
              data-bs-toggle="tab"
              data-bs-target={`#${tab}`}
              type="button"
              role="tab"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content" id="dashboardTabsContent">
        {/* Company */}
        <div
          className="tab-pane fade show active"
          id="company"
          role="tabpanel"
          aria-labelledby="company-tab"
        >
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Companies</h5>
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.No</th>
                      <th className="fw-bold w-15">Industry</th>
                      <th className="fw-bold w-10">City</th>
                      <th className="fw-bold w-10">Country</th>
                      <th className="fw-bold w-15">Contact Person</th>
                      <th className="fw-bold w-15">Address 1</th>
                      <th className="fw-bold w-15">Address 2</th>
                      <th className="fw-bold w-10">Location</th>
                      <th className="fw-bold w-10">Establishment Year</th>
                      <th className="fw-bold w-10">License Number</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.company.map((c, i) => (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td>{c.industryName}</td>
                        <td>{c.city}</td>
                        <td>{c.country}</td>
                        <td>{c.contactPerson}</td>
                        <td>{c.address1}</td>
                        <td>{c.address2}</td>
                        <td>{c.location}</td>
                        <td>{c.establishmentYear}</td>
                        <td>{c.licenseNumber}</td>
                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
                        <td>{c.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            </div>
          </div>
        </div>

        {/* Production */}
        <div className="tab-pane fade" id="production" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Production</h5>
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th className="fw-bold w-15">S.no</th>
                      <th className="fw-bold w-15">Final Products</th>
                      <th className="fw-bold w-20">Raw Materials</th>
                      <th className="fw-bold w-20">Technology Used</th>
                      <th className="fw-bold w-15">Production Capacity</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.production.map((p, i) => (
                      <tr key={p._id}>
                        <td>{i + 1}</td>
                        <td>{p.finalProducts}</td>
                        <td>{p.rawMaterials}</td>
                        <td>{p.technologyUsed}</td>
                        <td>{p.productionCapacity}</td>
                        <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                        <td>{p.user_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Operational */}
        <div className="tab-pane fade" id="operational" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Operational Data</h5>
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-10">Annual Production</th>
                      <th className="fw-bold w-10">Shutdown Days</th>
                      <th className="fw-bold w-10">Diesel Consumed</th>
                      <th className="fw-bold w-10">Fuel Gas</th>
                      <th className="fw-bold w-10">Grid Electricity</th>
                      <th className="fw-bold w-10">Solar Power</th>
                      <th className="fw-bold w-10">Fresh Water</th>
                      <th className="fw-bold w-10">Recycled Water</th>
                      <th className="fw-bold w-10">Heavy Oil Consumed</th>
                      <th className="fw-bold w-10">Independent Power</th>
                      <th className="fw-bold w-10">Direct Hire Employees</th>
                      <th className="fw-bold w-10">Indirect Hire Employees</th>
                      <th className="fw-bold w-10">Energy Investment</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.operational.map((o, i) => (
                      <tr key={o._id}>
                        <td>{i + 1}</td>
                        <td>{o.annualProduction}</td>
                        <td>{o.shutdownDays}</td>
                        <td>{o.dieselConsumed}</td>
                        <td>{o.fuelGasConsumed}</td>
                        <td>{o.gridElectricity}</td>
                        <td>{o.solarPower}</td>
                        <td>{o.freshWater}</td>
                        <td>{o.recycledWater}</td>
                        <td>{o.heavyOilConsumed}</td>
                        <td>{o.independentPower}</td>
                        <td>{o.directHireEmployees}</td>
                        <td>{o.indirectHireEmployees}</td>
                        <td>{o.energyInvestment}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(o.updatedAt).toLocaleDateString()}</td>
                        <td>{o.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Electrical */}
        <div className="tab-pane fade" id="electrical" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Electrical Data</h5>
              <div className=" table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-15">Load Date</th>
                      <th className="fw-bold w-10">Load Time</th>
                      <th className="fw-bold w-15">Loads</th>
                      <th className="fw-bold w-25">Banks</th>
                      <th className="fw-bold w-10">LV Panels</th>
                      <th className="fw-bold w-10">MV Panels</th>
                      <th className="fw-bold w-15">Filters</th>
                      <th className="fw-bold w-10">Stabilizer Present</th>
                      <th className="fw-bold w-10">Stabilizer Brand</th>
                      <th className="fw-bold w-10">Stabilizer KVA</th>
                      <th className="fw-bold w-10">VFD App Type</th>
                      <th className="fw-bold w-10">VFD Date</th>
                      <th className="fw-bold w-10">VFD Location</th>
                      <th className="fw-bold w-10">VFD Model</th>
                      <th className="fw-bold w-10">Failures</th>
                      <th className="fw-bold w-10">Diagram File</th>
                      <th className="fw-bold w-10">Load File</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.electrical.map((e, i) => (
                      <tr key={e._id}>
                        <td>{i + 1}</td>
                        <td>{e.loadDate}</td>
                        <td>{e.loadTime}</td>
                        <td>{e.loads?.join(", ")}</td>
                        <td>
                          {e.banks?.map(
                            (b) =>
                              `Brand: ${b.brand}, KVA: ${b.kva}, Detuned: ${b.detuned}, Shunt: ${b.shunt}`
                          ).join(" | ")}
                        </td>
                        <td>
                          {e.lvPanels?.map((l) => `Size: ${l.size}, Qty: ${l.qty}`).join(" | ")}
                        </td>
                        <td>
                          {e.mvPanels?.map((m) => `Size: ${m.size}, Qty: ${m.qty}`).join(" | ")}
                        </td>
                        <td>
                          {e.filters?.map(
                            (f) =>
                              `Type: ${f.type}, Panel: ${f.panel}, Installation: ${f.installation}, Model: ${f.model}`
                          ).join(" | ")}
                        </td>
                        <td>{e.stabilizer?.present}</td>
                        <td>{e.stabilizer?.brand || "-"}</td>
                        <td>{e.stabilizer?.kva || "-"}</td>
                        <td>{e.vfds?.appType}</td>
                        <td>{e.vfds?.date}</td>
                        <td>{e.vfds?.location}</td>
                        <td>{e.vfds?.model}</td>
                        <td>{e.failures}</td>
                        <td>
                          {e.diagramFile ? (
                            <a href={`${backendurl}${e.diagramFile}`} target="_blank" rel="noreferrer">
                              View
                            </a>
                          ) : "-"}
                        </td>
                        <td>
                          {e.loadFile ? (
                            <a href={`${backendurl}${e.loadFile}`} target="_blank" rel="noreferrer">
                              View
                            </a>
                          ) : "-"}
                        </td>
                        <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(e.updatedAt).toLocaleDateString()}</td>
                        <td>{e.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="tab-pane fade" id="certifications" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Certifications</h5>
              <div className=" table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-10">Benchmark Certifications</th>
                      <th className="fw-bold w-10">ISO Certified</th>
                      <th className="fw-bold w-10">Waste to Energy</th>
                      <th className="fw-bold w-10">Wastewater Reuse</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.certifications.map((c, i) => (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td>{c.benchmarkCertifications}</td>
                        <td>{c.isoCertified}</td>
                        <td>{c.wasteToEnergy}</td>
                        <td>{c.wastewaterReuse}</td>
                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
                        <td>{c.user_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>

        {/* HVAC */}
        <div className="tab-pane fade" id="hvac" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">HVAC</h5>
              <div className=" table-responsive">
                <table className="table table-striped table-boardered">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-10">AHUs</th>
                      <th className="fw-bold w-10">FAHUs</th>
                      <th className="fw-bold w-10">FCUs</th>
                      <th className="fw-bold w-10">Chillers</th>
                      <th className="fw-bold w-10">Chiller Type</th>
                      <th className="fw-bold w-10">Calorifiers</th>
                      <th className="fw-bold w-10">Cooling Towers</th>
                      <th className="fw-bold w-10">VFDs</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>

                    </tr>
                  </thead>
                  <tbody>
                    {data.hvac.map((h, i) => (
                      <tr key={h._id}>
                        <td>{i + 1}</td>
                        <td>{h.ahus}</td>
                        <td>{h.fahus}</td>
                        <td>{h.fcus}</td>
                        <td>{h.chillers}</td>
                        <td>{h.chillerType}</td>
                        <td>{h.calorifiers}</td>
                        <td>{h.coolingTowers}</td>
                        <td>{h.vfds}</td>
                        <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(h.updatedAt).toLocaleDateString()}</td>
                        <td>{h.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SCADA */}
        <div className="tab-pane fade" id="scada" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">SCADA</h5>
              <div className=" table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-10">SCADA Present</th>
                      <th className="fw-bold w-10">SCADA Features</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.scada.map((s, i) => (
                      <tr key={s._id}>
                        <td>{i + 1}</td>
                        <td>{s.scadaPresent}</td>
                        <td>{s.scadaFeatures}</td>
                        <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(s.updatedAt).toLocaleDateString()}</td>
                        <td>{s.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>

        {/* Thermal */}
        <div className="tab-pane fade" id="thermal" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Thermal Efficiency</h5>
              <div className=" table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-10">Cool Roof</th>
                      <th className="fw-bold w-10">Cooled</th>
                      <th className="fw-bold w-10">Roof Insulation</th>
                      <th className="fw-bold w-10">Envelope Specs</th>
                      <th className="fw-bold w-10">Window Films</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.thermal.map((t, i) => (
                      <tr key={t._id}>
                        <td>{i + 1}</td>
                        <td>{t.coolRoof}</td>
                        <td>{t.cooled}</td>
                        <td>{t.roofInsulation}</td>
                        <td>{t.envelopeSpecs}</td>
                        <td>{t.windowFilms}</td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(t.updatedAt).toLocaleDateString()}</td>
                        <td>{t.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div className="tab-pane fade" id="equipment" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Equipment</h5>
              <div className=" table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-10">Equipment Name</th>
                      <th className="fw-bold w-10">Equipment Type</th>
                      <th className="fw-bold w-10">Manufacturer</th>
                      <th className="fw-bold w-10">Installation Year</th>
                      <th className="fw-bold w-10">Rated Power</th>
                      <th className="fw-bold w-10">Batch Duration</th>
                      <th className="fw-bold w-10">Batches per Day</th>
                      <th className="fw-bold w-10">Comments</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.equipment.map((eq, i) => (
                      <tr key={eq._id}>
                        <td>{i + 1}</td>
                        <td>{eq.equipmentName}</td>
                        <td>{eq.equipmentType}</td>
                        <td>{eq.manufacturer}</td>
                        <td>{eq.installationYear}</td>
                        <td>{eq.ratedPower}</td>
                        <td>{eq.batchDuration}</td>
                        <td>{eq.batchesPerDay}</td>
                        <td>{eq.comments}</td>
                        <td>{new Date(eq.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(eq.updatedAt).toLocaleDateString()}</td>
                        <td>{eq.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>

        {/* PDF */}
        <div className="tab-pane fade" id="pdf" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">PDF Documents</h5>
              <div className=" table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-10">Filename</th>
                      <th className="fw-bold w-10">Original Name</th>
                      <th className="fw-bold w-10">File Path</th>
                      <th className="fw-bold w-10">Upload Date</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pdf.map((p, i) => (
                      <tr key={p._id}>
                        <td>{i + 1}</td>
                        <td>{p.filename}</td>
                        <td>{p.originalName
                        }</td>
                        <td>

                          <a href={`${backendurl}${p.filePath}`} target="_blank" rel="noreferrer">
                            View
                          </a>

                        </td>
                        <td>{new Date(p.uploadDate).toLocaleDateString()}</td>

                        <td>{p.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>




        {/* upload */}

      <div className="tab-pane fade" id="uploads" role="tabpanel">
  <div className="card shadow-sm mb-3">
    <div className="card-body">
      <h5 className="card-title">Project Documents</h5>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th className="fw-bold w-5">S.no</th>
              <th className="fw-bold w-10">Bills</th>
              <th className="fw-bold w-10">Energy Balance</th>
              <th className="fw-bold w-10">GHG Report</th>
              <th className="fw-bold w-10">Manufacturing Desc</th>
              <th className="fw-bold w-10">Mass Balance</th>
              <th className="fw-bold w-10">Plant Layout</th>
              <th className="fw-bold w-10">Trade License</th>
              <th className="fw-bold w-10">Water Balance</th>
              <th className="fw-bold w-10">WWTP Layout</th>
              <th className="fw-bold w-10">Created At</th>
              <th className="fw-bold w-10">Updated At</th>
              <th className="fw-bold w-10">User ID</th>
            </tr>
          </thead>
          <tbody>
            {(data.uploads || []).map((a, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  {(a.bills || []).map((bill, idx) => (
                    <div key={idx}>
                      <a
                        href={`${backendurl}${bill}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Bill {idx + 1}
                      </a>
                    </div>
                  ))}
                </td>
                <td>
                  {a.energyBalance && (
                    <a
                      href={`${backendurl}${a.energyBalance}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>
                <td>
                  {a.ghgReport && (
                    <a
                      href={`${backendurl}${a.ghgReport}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>
                <td>
                  {a.manufacturingDesc && (
                    <a
                      href={`${backendurl}${a.manufacturingDesc}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>
                <td>
                  {a.massBalance && (
                    <a
                      href={`${backendurl}${a.massBalance}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>
                <td>
                  {a.plantLayout && (
                    <a
                      href={`${backendurl}${a.plantLayout}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>
                <td>
                  {a.tradeLicense && (
                    <a
                      href={`${backendurl}${a.tradeLicense}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>
                <td>
                  {a.waterBalance && (
                    <a
                      href={`${backendurl}${a.waterBalance}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>
                <td>
                  {a.wwtpLayout && (
                    <a
                      href={`${backendurl}${a.wwtpLayout}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>
                <td>{a.createdAt && new Date(a.createdAt).toLocaleDateString()}</td>
                <td>{a.updatedAt && new Date(a.updatedAt).toLocaleDateString()}</td>
                <td>{a.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>



        {/* Users */}
        <div className="tab-pane fade" id="users" role="tabpanel">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Users</h5>
              <div className=" table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="fw-bold w-5">S.no</th>
                      <th className="fw-bold w-10">Email</th>
                      <th className="fw-bold w-10">Role</th>
                      <th className="fw-bold w-10">Verified</th>
                      <th className="fw-bold w-10">Created At</th>
                      <th className="fw-bold w-10">Updated At</th>
                      <th className="fw-bold w-10">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((u, i) => (
                      <tr key={u._id}>
                        <td>{i + 1}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.isVerified ? "Yes" : "No"}</td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(u.updatedAt).toLocaleDateString()}</td>
                        <td>{u._id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
   

    </div>
  );
};

export default AllTabs;

