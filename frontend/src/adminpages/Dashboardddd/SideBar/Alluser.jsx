import React, { useEffect, useState } from "react";
import axios from "../../../instant/axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
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
  const [selectedUser, setSelectedUser] = useState(null);

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

        // ✅ Remove admin@gmail.com from users
        const uniqueUsers = Array.from(
          new Map(userRes.data.data.map((u) => [u.email, u])).values()
        ).filter((u) => u.email !== "admin@gmail.com");

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

  const filterByUser = (arr) => {
    if (!selectedUser) return [];
    return arr.filter((item) => {
      const uid = item.userId || item.user_id;
      return uid === selectedUser._id;
    });
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") {
      if (Array.isArray(value)) return value.map(renderValue).join(", ");
      return Object.values(value).map(renderValue).join(", ");
    }
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return value.toString();
  };

  const renderVerticalDetails = (dataset) => {
    if (!dataset.length) return <p className="text-muted">No data available</p>;
    const item = dataset[0];
    return (
      <div className="row g-2">
        {Object.entries(item).map(([key, val]) => (
          <div className="col-12 d-flex border-bottom py-1" key={key}>
            <div className="fw-bold text-secondary" style={{ width: "200px" }}>
              {key}
            </div>
            <div className="flex-grow-1">{renderValue(val)}</div>
          </div>
        ))}
      </div>
    );
  };

  const handleDeleteUser = async (userId, email) => {
    if (window.confirm(`Are you sure you want to delete ${email} and ALL their data?`)) {
      try {
        await axios.delete(`/admin/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData((prev) => ({
          ...prev,
          users: prev.users.filter((u) => u._id !== userId),
        }));

        alert("User and all related data deleted successfully!");
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(null);
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Show All Users List */}
      {!selectedUser && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-light fw-bold">All Users</div>
          <div
            className="table-responsive"
            style={{ maxHeight: "75vh", overflowY: "auto" }}
          >
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>S.no</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user, idx) => (
                  <tr key={user._id}>
                    <td>{idx + 1}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Delete User"
                        onClick={() => handleDeleteUser(user._id, user.email)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Show Selected User Details */}
      {selectedUser && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold">{selectedUser.email} - Details</h5>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setSelectedUser(null)}
            >
              Back to Users
            </button>
          </div>

          <div className="row g-4">
            {Object.entries({
              Company: data.company,
              Production: data.production,
              Operational: data.operational,
              Electrical: data.electrical,
              Certifications: data.certifications,
              Uploads: data.uploads,
              HVAC: data.hvac,
              SCADA: data.scada,
              Thermal: data.thermal,
              Equipment: data.equipment,
              PDF: data.pdf,
            }).map(([title, dataset]) => (
              <div className="col-12" key={title}>
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-light fw-bold">{title}</div>
                  <div className="card-body">
                    {renderVerticalDetails(filterByUser(dataset))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
