import React, { useEffect, useState } from "react";
import axios from "../../../instant/backAxios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BD4", "#FF6F61"];

const AdminDashboard = () => {
  const [data, setData] = useState({
    company: [], production: [], operational: [], electrical: [],
    certifications: [], uploads: [], hvac: [], scada: [],
    thermal: [], equipment: [], pdf: [], users: [],
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        const [
          companyRes, prodRes, opRes, elecRes, certRes, uploadRes,
          hvacRes, scadaRes, thermalRes, equipRes, pdfRes, userRes,
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
          users: userRes.data.data,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  if (loading) return <p className="text-center py-4 small text-muted">Loading data...</p>;

  const today = new Date();
  const newUsersToday = data.users.filter(u => {
    const created = new Date(u.createdAt);
    return (
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear()
    );
  });

  const barData = [
    { name: "Users", count: data.users.length },
    { name: "Companies", count: data.company.length },
    { name: "Uploads", count: data.uploads.length },
    { name: "Equipment", count: data.equipment.length },
    { name: "Production", count: data.production.length },
    { name: "Operational", count: data.operational.length },
    { name: "Electrical", count: data.electrical.length },
    { name: "Certifications", count: data.certifications.length },
    { name: "HVAC", count: data.hvac.length },
    { name: "SCADA", count: data.scada.length },
    { name: "Thermal", count: data.thermal.length },
    { name: "PDFs", count: data.pdf.length },
  ];

  const pieData = [
    { name: "Users", value: data.users.length },
    { name: "Uploads", value: data.uploads.length },
    { name: "Equipment", value: data.equipment.length },
  ];

  return (
    <div className="container-fluid py-3">

      {/* Stats Cards */}
      <div className="row mb-4 g-3">
        {[
          { label: "Total Users", value: data.users.length, icon: "👤", gradient: "linear-gradient(135deg,#4facfe,#00f2fe)" },
          { label: "New Today", value: newUsersToday.length, icon: "✨", gradient: "linear-gradient(135deg,#43e97b,#38f9d7)" },
          { label: "Total Companies", value: data.company.length, icon: "🏢", gradient: "linear-gradient(135deg,#fbc2eb,#a6c1ee)" },
          { label: "Total Uploads", value: data.uploads.length, icon: "📂", gradient: "linear-gradient(135deg,#fddb92,#d1fdff)" },
        ].map((item, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
              <div
                className="p-2 d-flex justify-content-between align-items-center"
                style={{ background: item.gradient, color: "#fff" }}
              >
                <div className="fw-semibold small">{item.label}</div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "34px",
                    height: "34px",
                    background: "rgba(255,255,255,0.25)",
                    fontSize: "1.2rem",
                  }}
                >
                  {item.icon}
                </div>
              </div>

              <div className="p-3">
                <div className="fw-bold fs-4 mb-1">{item.value}</div>
                <div className="small text-muted">Overview of {item.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mb-4 g-3">
        {/* Bar Chart */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100" style={{ minHeight: "320px" }}>
            <div className="small fw-bold text-center mb-3">📈 Data Counts</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                <Bar dataKey="count" fill="#0088FE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100" style={{ minHeight: "320px" }}>
            <div className="small fw-bold text-center mb-3">🧩 Users vs Uploads vs Equipment</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
