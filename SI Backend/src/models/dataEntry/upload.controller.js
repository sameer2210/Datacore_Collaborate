import Upload from "./upload.js";

//  Create Upload (Only one per user)
export const createUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    // Check if already exists
    const existing = await Upload.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        message: 'Upload record already exists',
        record: existing
      });
    }

    // Helper to get public path
    const getPublicPath = (field) => {
      return files[field]?.[0]?.filename ? `/uploads/${files[field][0].filename}` : null;
    };

    const newUpload = new Upload({
      userId,
      tradeLicense: getPublicPath('tradeLicense'),
      plantLayout: getPublicPath('plantLayout'),
      ghgReport: getPublicPath('ghgReport'),
      wwtpLayout: getPublicPath('wwtpLayout'),
      manufacturingDesc: getPublicPath('manufacturingDesc'),
      waterBalance: getPublicPath('waterBalance'),
      massBalance: getPublicPath('massBalance'),
      energyBalance: getPublicPath('energyBalance'),
      bills: files.bills ? files.bills.map(f => `/uploads/${f.filename}`) : [],
    });

    await newUpload.save();

    res.status(201).json({
      message: 'Documents uploaded successfully',
      record: newUpload
    });
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload documents', error: error.message });
  }
};


//  Get all uploads for current user
export const getUploads = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await Upload.find({  userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get single upload by ID (with user check)
export const getUploadById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const record = await Upload.findOne({ _id: id,  userId });
    if (!record) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update existing upload
export const updateUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const record = await Upload.findOne({ _id: id, userId });
    if (!record) {
      return res.status(404).json({ error: "Not found or unauthorized" });
    }

    const files = req.files;

    //  Helper to get public path
    const getPublicPath = (field) => {
      return files[field]?.[0]?.filename ? `/uploads/${files[field][0].filename}` : null;
    };

    // Update file paths with public URL
    if (files.tradeLicense) record.tradeLicense = getPublicPath("tradeLicense");
    if (files.plantLayout) record.plantLayout = getPublicPath("plantLayout");
    if (files.ghgReport) record.ghgReport = getPublicPath("ghgReport");
    if (files.wwtpLayout) record.wwtpLayout = getPublicPath("wwtpLayout");
    if (files.manufacturingDesc) record.manufacturingDesc = getPublicPath("manufacturingDesc");
    if (files.waterBalance) record.waterBalance = getPublicPath("waterBalance");
    if (files.massBalance) record.massBalance = getPublicPath("massBalance");
    if (files.energyBalance) record.energyBalance = getPublicPath("energyBalance");
    if (files.bills) {
      record.bills = files.bills.map((file) => `/uploads/${file.filename}`);
    }

    // (Optional) Update userId if sent in request body — be cautious
    if (req.body.userId) {
      record.userId = req.body.userId;
    }

    await record.save();
    res.json({ message: "Upload updated successfully", record });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


//  Delete (if belongs to user)
export const deleteUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Upload.findOneAndDelete({ _id: id,  userId });
    if (!deleted) return res.status(404).json({ error: "Not found or unauthorized" });

    res.json({ message: "Deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



