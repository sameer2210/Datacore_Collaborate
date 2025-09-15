import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import axios from "../instant/axios";
import logo from "../assets/images/logo.png";
import { formatHeading } from "../utils/formatHeading";
import Header from "./Header";

function PdfPreview() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [pdfId, setPdfId] = useState(null);

  // Fetch existing PDF info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/pdf", { withCredentials: true });
        if (res.data?.length > 0) {
          const pdf = res.data[0];
          setData(pdf);
          setPdfId(pdf._id || pdf.id);
        }
      } catch (err) {
        console.error("Error fetching PDF:", err.message);
      }
    };
    fetchData();
  }, []);

  // Fetch all form data from backend
  const fetchAllData = async () => {
    const endpoints = [
      { key: "company", url: "/company" },
      { key: "production", url: "/production" },
      { key: "operationalData", url: "/operational-data" },
      { key: "electricalData", url: "/electrical-data" },
      { key: "certifications", url: "/certifications" },
      { key: "uploads", url: "/upload-documents" },
      { key: "hvac", url: "/hvac" },
      { key: "scada", url: "/scada" },
      { key: "thermalEfficiency", url: "/thermal-efficiency" },
      { key: "equipment", url: "/equipment" },
    ];

    try {
      const responses = await Promise.all(
        endpoints.map((ep) =>
          axios.get(ep.url, { withCredentials: true }).then((res) => ({
            key: ep.key,
            data: res.data || {},
          }))
        )
      );

      const combinedData = {};
      responses.forEach((item) => (combinedData[item.key] = item.data));
      return combinedData;
    } catch (err) {
      console.error("Error fetching API data:", err);
      return {};
    }
  };

  // Recursive section renderer
  const addSection = (doc, data, y, indent = 0) => {
    const unwantedKeys = ["_id", "id", "userId", "__v"];

    Object.entries(data).forEach(([key, value]) => {
      if (unwantedKeys.includes(key)) return;

      const xKey = 15 + indent;

      // Render key
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const splitKey = doc.splitTextToSize(`${formatHeading(key)}:`, 50);
      doc.text(splitKey, xKey, y);
      const keyHeight = splitKey.length * 6;

      // Render value
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);

      if (Array.isArray(value)) {
        if (!value.length) {
          doc.text("No data", xKey + 45, y);
          y += 6;
        } else {
          value.forEach((item, index) => {
            if (typeof item === "object" && item !== null) {
              y += 6;
              doc.text(`Item ${index + 1}:`, xKey + 45, y);
              y += 6;
              y = addSection(doc, item, y, indent + 20);
            } else {
              doc.text(String(item), xKey + 45, y);
              y += 6;
            }
          });
        }
      } else if (typeof value === "object" && value !== null) {
        y += 6;
        y = addSection(doc, value, y, indent + 20);
      } else {
        const splitVal = doc.splitTextToSize(String(value || "-"), 120);
        doc.text(splitVal, xKey + 45, y);
        y += Math.max(keyHeight, splitVal.length * 6);
      }

      if (y > doc.internal.pageSize.height - 20) {
        doc.addPage();
        y = 45;
      }
    });

    return y;
  };

  // Generate PDF blob
  const generatePdfFile = async () => {
    const allData = await fetchAllData();
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let y = 45;

    // Header
    const addHeader = () => {
      doc.addImage(logo, "PNG", 10, 8, 25, 20);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Invotron Pvt. Limited", pageWidth - 15, 18, { align: "right" });
      doc.setLineWidth(0.5);
      doc.line(10, 30, pageWidth - 10, 30);
    };

    // Footer
    const addFooter = (pageNum, totalPages) => {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, {
        align: "center",
      });
    };

    addHeader();

    // Add all sections
    Object.entries(allData).forEach(([sectionName, sectionData]) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 64, 48);
      doc.setFont("helvetica", "bold");
      doc.text(formatHeading(sectionName), 10, y);
      y += 8;
      doc.setTextColor(0, 0, 0);

      if (sectionData && Object.keys(sectionData).length) {
        y = addSection(doc, sectionData, y);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text("No data available", 15, y);
        y += 6;
      }

      doc.setDrawColor(200);
      doc.line(10, y, pageWidth - 10, y);
      y += 8;
    });

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addHeader();
      addFooter(i, totalPages);
    }

    return new File([doc.output("blob")], "all-data.pdf", { type: "application/pdf" });
  };

  // Upload or update PDF
  const handlePdfUpload = async () => {
    setLoading(true);
    try {
      const file = await generatePdfFile();
      const formData = new FormData();
      formData.append("file", file);

      if (pdfId) {
        await axios.put(`/pdf/${pdfId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        alert(" PDF updated successfully!");
      } else {
        await axios.post("/pdf", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        alert(" PDF created successfully!");
      }  
        window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ PDF upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <div className="p-4 mx-auto" style={{ maxWidth: "400px" }}>
      {/* Create & Save PDF */}
      <button
        type="button"
        className={`btn btn-success w-100 mb-3 ${loading ? "disabled" : ""}`}
        onClick={handlePdfUpload}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Creating PDF...
          </>
        ) : (
          "Create & Save PDF"
        )}
      </button>

      {/* Download PDF */}
      {data?.filePath && (
        <a
          href={`http://localhost:8000${data.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-100"
          style={{ textDecoration: "none" }}
        >
          Download PDF
        </a>
      )}
    </div>
    </>
  );
}

export default PdfPreview;


