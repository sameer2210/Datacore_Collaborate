import ElectricalData from "./electricalData.js";

//  Create Electrical Data
export const createElectricalData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if already exists (optional)
    const existing = await ElectricalData.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        message: "Electrical data already exists",
        record: existing
      });
    }

    const files = req.files;

    //  Helper for public path (like Document Upload)
    const getPublicPath = (field) => {
      return files[field]?.[0]?.filename ? `/uploads/${files[field][0].filename}` : null;
    };

    const {
      loadDate,
      loadTime,
      mvPanels,
      lvPanels,
      capacitorBanks,
      harmonicFilters,
      stabilizer,
      loads,
      vfds,
      totalFailures
    } = req.body;

    const newData = new ElectricalData({
      userId,
      diagramFile: getPublicPath("diagramFile"),
      loadFile: getPublicPath("loadFile"),
      loadDate,
      loadTime,
      mvPanels: JSON.parse(mvPanels || "[]"),
      lvPanels: JSON.parse(lvPanels || "[]"),
      banks: JSON.parse(capacitorBanks || "[]"),
      filters: JSON.parse(harmonicFilters || "[]"),
      stabilizer: JSON.parse(stabilizer || "{}"),
      loads: JSON.parse(loads || "[]"),
      vfds: JSON.parse(vfds || "{}"),
      failures: Number(totalFailures) || 0
    });

    await newData.save();

    res.status(201).json({
      message: "Electrical data saved successfully ",
      data: newData
    });
  } catch (error) {
    console.error(" Error saving electrical data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  Get all records for user
export const getElectricalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await ElectricalData.find({ userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get single record by ID
export const getElectricalDataById = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await ElectricalData.findOne({ _id: req.params.id, userId });

    if (!data) {
      return res.status(404).json({ error: "Electrical data not found or unauthorized" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(" Get by ID error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  Update Electrical Data
export const updateElectricalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const record = await ElectricalData.findOne({ _id: id, userId });
    if (!record) {
      return res.status(404).json({ error: "Not found or unauthorized" });
    }

    const files = req.files;
    const getPublicPath = (field) => {
      return files[field]?.[0]?.filename ? `/uploads/${files[field][0].filename}` : null;
    };

    const {
      loadDate,
      loadTime,
      mvPanels,
      lvPanels,
      capacitorBanks,
      harmonicFilters,
      stabilizer,
      loads,
      vfds,
      totalFailures
    } = req.body;

    //  Update file paths if new files uploaded
    if (files.diagramFile) record.diagramFile = getPublicPath("diagramFile");
    if (files.loadFile) record.loadFile = getPublicPath("loadFile");

    //  Update text fields
    if (loadDate) record.loadDate = loadDate;
    if (loadTime) record.loadTime = loadTime;
    if (mvPanels) record.mvPanels = JSON.parse(mvPanels);
    if (lvPanels) record.lvPanels = JSON.parse(lvPanels);
    if (capacitorBanks) record.banks = JSON.parse(capacitorBanks);
    if (harmonicFilters) record.filters = JSON.parse(harmonicFilters);
    if (stabilizer) record.stabilizer = JSON.parse(stabilizer);
    if (loads) record.loads = JSON.parse(loads);
    if (vfds) record.vfds = JSON.parse(vfds);
    if (totalFailures) record.failures = Number(totalFailures);

    await record.save();
    res.json({ message: "Electrical data updated successfully ", data: record });
  } catch (error) {
    console.error(" Error updating electrical data:", error);
    res.status(400).json({ error: error.message });
  }
};

//  Delete Electrical Data
export const deleteElectricalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await ElectricalData.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ error: "Not found or unauthorized" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};






