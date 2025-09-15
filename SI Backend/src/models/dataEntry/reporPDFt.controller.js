import Pdf from "./reportPDF.js";

//  Helper function for public file path
const getPublicPath = (field, files) => {
  return files[field]?.[0]?.filename ? `/uploads/${files[field][0].filename}` : null;
};

//  Create PDF (only one per user)
export const uploadPdf = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if PDF already exists
    const existing = await Pdf.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        message: "PDF already exists",
        pdf: existing,
      });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    const filePath = `/uploads/${req.files.file[0].filename}`; //  public path

    const newPdf = await Pdf.create({
      userId,
      filename: req.files.file[0].filename,
      originalName: req.files.file[0].originalname,
      filePath,               //  store file path in DB
      uploadDate: new Date(),
    });

    res.status(201).json({
      message: "PDF uploaded successfully",
      pdf: newPdf,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Get all PDFs of the current user
export const getPdf = async (req, res) => {
  try {
    const userId = req.user.id;
    const pdfs = await Pdf.find({ userId });
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get single PDF by ID
export const getPdfById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const pdfDoc = await Pdf.findOne({ _id: id, userId });
    if (!pdfDoc) return res.status(404).json({ error: "File not found or unauthorized" });

    const filePath = `uploads/${pdfDoc.filename}`;
    res.download(filePath, pdfDoc.originalName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Update existing PDF (replace file)
export const updatePdf = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const pdfDoc = await Pdf.findOne({ _id: id, userId });
    if (!pdfDoc) return res.status(404).json({ error: "File not found or unauthorized" });

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No new file uploaded!" });
    }

    const filePath = `/uploads/${req.files.file[0].filename}`; // public path

    pdfDoc.filename = req.files.file[0].filename;
    pdfDoc.originalName = req.files.file[0].originalname;
    pdfDoc.filePath = filePath; //  store updated path
    pdfDoc.uploadDate = new Date();

    await pdfDoc.save();

    res.status(200).json({
      message: "PDF updated successfully",
      pdf: pdfDoc,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deletePdfData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Pdf.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

