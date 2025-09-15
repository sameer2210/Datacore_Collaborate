import React, { useContext, useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";
import { FormContext } from "../context/FormContext";
import logo from "../assets/images/logo.png";
import { formatHeading } from "../utils/formatHeading";

function PdfPreview() {
  const { allFormData } = useContext(FormContext);
  const [filename, setFilename] = useState("form-data.pdf"); // default filename

  const formatValue = (value) => {
    if (!value) return "-";
    if (value.name) return value.name;
    if (Array.isArray(value))
      return value
        .map((item) => (item?.name ? item.name : JSON.stringify(item)))
        .join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const generatePdf = async () => {
    const doc = new jsPDF();
    let y = 45;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- Add header ---
    doc.addImage(logo, "PNG", 10, 8, 25, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Invotron Pvt. Limited", pageWidth - 15, 18, { align: "right" });
    doc.setLineWidth(0.5);
    doc.line(10, 30, pageWidth - 10, 30);

    // --- Add content ---
    Object.entries(allFormData || {}).forEach(([sectionName, sectionData]) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(formatHeading(sectionName), 10, y);
      y += 8;

      Object.entries(sectionData || {}).forEach(([key, value]) => {
        const textValue = formatValue(value);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`${formatHeading(key)}:`, 15, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(textValue, 60, y);

        y += 6;
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 45;
        }
      });

      doc.line(10, y, pageWidth - 10, y);
      y += 8;
    });

    // --- Save locally ---
    doc.save(filename);

    // --- Upload to backend ---
    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], filename, { type: "application/pdf" });
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/data-entry/save-pdf", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("PDF uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("PDF upload failed!");
    }
  };

  // --- Download from backend ---
  const downloadPdf = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/data-entry/download-pdf/${filename}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed!");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Enter PDF filename"
        className="form-control mb-2"
      />
      <button className="btn btn-custom w-100 mb-2" onClick={generatePdf}>
        Generate & Upload PDF
      </button>
      <button className="btn btn-secondary w-100" onClick={downloadPdf}>
        Download PDF from Backend
      </button>
    </div>
  );
}

export default PdfPreview;
