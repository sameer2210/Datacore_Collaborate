
import React, { useState, useRef, useContext, useEffect } from "react";
import { Button, Form, Row, Col, InputGroup, Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import axios from "../instant/axios"; // use shared axios instance
import FileUploadBox from "../shared/UploadFile";
import { FormContext } from "../context/FormContext";
import Header from "./Header";
const BASE_URL = "http://localhost:8000"; // or wherever your backend is


const loadOptions = [
  { value: "Furnace", label: "Furnace" },
  { value: "Extruder", label: "Extruder" },
  { value: "Cooling Towers", label: "Cooling Towers" },
];

const Electrical = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // Context
  const { allFormData, updateFormData } = useContext(FormContext);
  const saved = allFormData?.electrical || {};

  // Record/Edit state
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Server feedback
  const [serverMsg, setServerMsg] = useState({ type: "", text: "" });

  // ---- form state (prefilled from context if exists) ----
  const [diagramFile, setDiagramFile] = useState(saved.diagramFile || null);
  const [loadDate, setLoadDate] = useState(saved.loadDate || "");
  const [loadTime, setLoadTime] = useState(saved.loadTime || "");
  const [loadFile, setLoadFile] = useState(saved.loadFile || null);

  // For showing existing file names (from server), since we can't create File objects
  const [existingDiagramName, setExistingDiagramName] = useState("");
  const [existingLoadFileName, setExistingLoadFileName] = useState("");

  const [mvPanels, setMvPanels] = useState(saved.mvPanels || [{ size: "", qty: 1 }]);
  const [lvPanels, setLvPanels] = useState(saved.lvPanels || [{ size: "", qty: 1 }]);

  const [banks, setBanks] = useState(
    saved.banks || [
      { brand: "", kva: "", detuned: "", shunt: "" },
      { brand: "", kva: "", detuned: "", shunt: "" },
    ]
  );

  const [filters, setFilters] = useState(
    saved.filters || [{ type: "", panel: "", installation: "", model: "" }]
  );

  const [stabilizer, setStabilizer] = useState(
    saved.stabilizer || { present: "", brand: "", kva: "" }
  );

  const [loads, setLoads] = useState(saved.loads || []); // react-select array of {value,label}

  const [vfds, setVfds] = useState(
    saved.vfds || { model: "", appType: "", location: "", date: "" }
  );

  const [failures, setFailures] = useState(
    typeof saved.failures === "number" ? saved.failures : 1
  );

  // Validation errors
  const [errors, setErrors] = useState({});

  // ---------- helpers ----------




  const showMsg = (type, text, ttl = 4000) => {
    setServerMsg({ type, text });
    if (ttl) {
      setTimeout(() => setServerMsg({ type: "", text: "" }), ttl);
    }
  };

  const normalizeArray = (maybeStringOrArray, fallback) => {
    try {
      if (Array.isArray(maybeStringOrArray)) return maybeStringOrArray;
      if (typeof maybeStringOrArray === "string" && maybeStringOrArray.trim()) {
        const parsed = JSON.parse(maybeStringOrArray);
        return Array.isArray(parsed) ? parsed : fallback;
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  const normalizeObject = (maybeStringOrObj, fallback) => {
    try {
      if (maybeStringOrObj && typeof maybeStringOrObj === "object") return maybeStringOrObj;
      if (typeof maybeStringOrObj === "string" && maybeStringOrObj.trim()) {
        const parsed = JSON.parse(maybeStringOrObj);
        return typeof parsed === "object" && parsed !== null ? parsed : fallback;
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  const toLoadOptions = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((v) =>
      typeof v === "string"
        ? { value: v, label: loadOptions.find((o) => o.value === v)?.label || v }
        : v
    );
  };

  // Push current state to context (called often)
  const saveToContext = (partial = {}) => {
    const snapshot = {
      diagramFile,
      loadDate,
      loadTime,
      loadFile,
      mvPanels,
      lvPanels,
      banks,
      filters,
      stabilizer,
      loads,
      vfds,
      failures,
      ...partial,
    };
    updateFormData("electrical", snapshot);
  };

  // --------- initial fetch like Scada ----------
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setServerMsg({ type: "", text: "" });

        // Expecting an array (like Scada pattern). Adjust if your API returns an object.
        const res = await axios.get("/electrical-data", {
          withCredentials: true,
          signal: controller.signal,
        });

        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (list && list.length > 0) {
          const record = list[0];
          console.log(record);


          // Normalize every field safely
          setRecordId(record._id || record.id || null);

          // Files: keep only names/urls (can't create File objects from server)
          setExistingDiagramName(record.diagramFileName || record.diagramFile || "");
          setExistingLoadFileName(record.loadFileName || record.loadFile || "");

          setLoadDate(record.loadDate || "");
          setLoadTime(record.loadTime || "");

          const normalizedMVPanels = normalizeArray(record.mvPanels, [{ size: "", qty: 1 }]);
          const normalizedLVPanels = normalizeArray(record.lvPanels, [{ size: "", qty: 1 }]);
          setMvPanels(
            normalizedMVPanels.map((p) => ({ size: p.size || "", qty: Number(p.qty) || 1 }))
          );
          setLvPanels(
            normalizedLVPanels.map((p) => ({ size: p.size || "", qty: Number(p.qty) || 1 }))
          );

          setBanks(
            normalizeArray(record.capacitorBanks || record.banks, [
              { brand: "", kva: "", detuned: "", shunt: "" },
              { brand: "", kva: "", detuned: "", shunt: "" },
            ]).map((b) => ({
              brand: b.brand || "",
              kva: b.kva || "",
              detuned: b.detuned || "",
              shunt: b.shunt || "",
            }))
          );

          setFilters(
            normalizeArray(record.harmonicFilters || record.filters, [
              { type: "", panel: "", installation: "", model: "" },
            ]).map((f) => ({
              type: f.type || "",
              panel: f.panel || "",
              installation: f.installation || "",
              model: f.model || "",
            }))
          );

          const st = normalizeObject(record.stabilizer, { present: "", brand: "", kva: "" });
          setStabilizer({
            present: st.present || "",
            brand: st.brand || "",
            kva: st.kva || "",
          });

          const serverLoads =
            record.loads ||
            record.mainLoads ||
            normalizeArray(record.loads, []).map((x) => x);
          setLoads(toLoadOptions(serverLoads));

          const v = normalizeObject(record.vfds, {
            model: "",
            appType: "",
            location: "",
            date: "",
          });
          setVfds({
            model: v.model || "",
            appType: v.appType || "",
            location: v.location || "",
            date: v.date || "",
          });

          setFailures(
            typeof record.totalFailures === "number"
              ? record.totalFailures
              : Number(record.totalFailures) || 1
          );

          // Sync to context once filled
          saveToContext();
        }
      } catch (error) {
        if (error?.name !== "CanceledError") {
          console.error("❌ Error fetching electrical data:", error.response?.data || error.message);
          showMsg("danger", "Failed to load Electrical data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- handlers (all keep UI same) ----------

  const handleFileChange = (setter) => (e) => {
    const file = e.target?.files?.[0] || null;
    setter(file);
    // Context sync
    saveToContext(setter === setDiagramFile ? { diagramFile: file } : { loadFile: file });
  };

  const handleAdd = (arr, setArr, template) => {
    const next = [...arr, { ...template }];
    setArr(next);
    saveToContext(setArr === setMvPanels ? { mvPanels: next } : setArr === setLvPanels ? { lvPanels: next } : { filters: next });
  };

  const handleChangePanel = (arr, setArr) => (idx, field) => (e) => {
    const value = field === "qty" ? Number(e.target.value) : e.target.value;
    const copy = [...arr];
    copy[idx][field] = value;
    setArr(copy);
    saveToContext(setArr === setMvPanels ? { mvPanels: copy } : { lvPanels: copy });
  };

  const handleBankChange = (idx, field) => (e) => {
    const value = e?.target ? e.target.value : e;
    const copy = [...banks];
    copy[idx][field] = value;
    setBanks(copy);
    saveToContext({ banks: copy });
  };

  const handleFilterChange = (idx, field) => (e) => {
    const value = e?.target ? e.target.value : e;
    const copy = [...filters];
    copy[idx][field] = value;
    setFilters(copy);
    saveToContext({ filters: copy });
  };

  const handleLoadsChange = (vals) => {
    setLoads(vals);
    saveToContext({ loads: vals });
  };

  const handleStabilizer = (patch) => {
    const next = { ...stabilizer, ...patch };
    setStabilizer(next);
    saveToContext({ stabilizer: next });
  };

  const handleVfds = (patch) => {
    const next = { ...vfds, ...patch };
    setVfds(next);
    saveToContext({ vfds: next });
  };

  const handleFailures = (num) => {
    setFailures(num);
    saveToContext({ failures: num });
  };

  // ---------- validation ----------
  const validate = () => {
    const errs = {};

    // if (!diagramFile && !existingDiagramName) errs.diagramFile = "Single Line Diagram is required";
    if (!loadDate) errs.loadDate = "Load schedule date is required";
    if (!loadTime) errs.loadTime = "Load schedule time is required";

    if (!mvPanels.length || !mvPanels[0].size) errs.mvPanels = "Define at least one MV panel size";
    if (!lvPanels.length || !lvPanels[0].size) errs.lvPanels = "Define at least one LV panel size";

    banks.forEach((b, i) => {
      if (!b.detuned) errs[`bank${i}-detuned`] = "Required";
      if (!b.shunt) errs[`bank${i}-shunt`] = "Required";
    });

    filters.forEach((f, i) => {
      if (!f.type) errs[`filter${i}-type`] = "Required";
    });

    if (!stabilizer.present) errs.stabilizer = "Please select if stabilizer is present";
    if (stabilizer.present === "Yes" && !stabilizer.brand) errs.stabBrand = "Brand required";

    if (!vfds.model) errs.vfdsModel = "VFD model is required";

    if (!loads.length) errs.loads = "Select at least one load";

    if (failures < 0) errs.failures = "Must be ≥ 0";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---------- submit (create or update) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setServerMsg({ type: "", text: "" });

    try {
      const formData = new FormData();

      // Files only if user picked (keeps existing files on server if not provided)
      if (diagramFile) formData.append("diagramFile", diagramFile);
      if (loadFile) formData.append("loadFile", loadFile);

      formData.append("loadDate", loadDate);
      formData.append("loadTime", loadTime);
      formData.append("user_id", allFormData?.user_id || "12345");

      // Structured fields as JSON strings
      formData.append("mvPanels", JSON.stringify(mvPanels));
      formData.append("lvPanels", JSON.stringify(lvPanels));
      formData.append("capacitorBanks", JSON.stringify(banks));
      formData.append("harmonicFilters", JSON.stringify(filters));
      formData.append("stabilizer", JSON.stringify(stabilizer));
      formData.append("loads", JSON.stringify(loads.map((o) => o.value)));
      formData.append("vfds", JSON.stringify(vfds));
      formData.append("totalFailures", failures);

      let res;
      if (recordId) {
        // Update existing
        res = await axios.put(`/electrical-data/${recordId}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new
        res = await axios.post(`/electrical-data`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newId = res?.data?.record?._id || res?.data?._id;
        if (newId) setRecordId(newId);
      }

      showMsg("success", "Electrical data saved successfully.");
      // Sync to context after successful save
      saveToContext();

      // Navigate onward
      navigate("/hvac");
    } catch (error) {
      console.error(" Error submitting electrical data:", error.response?.data || error.message);
      showMsg("danger", "Submission failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePreviousClick = () => {
    saveToContext();
    navigate(-1);
  };

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  const renderOldFileLink = (filePath) => {
    if (!filePath || typeof filePath !== "string") return null;

    return (
      <div className="mt-1">
        <a
          href={`${BASE_URL}${filePath}`}
          target="_blank"
          rel="noreferrer"
          className="text-success"
        >
          Download previously uploaded file
        </a>
      </div>
    );
  };


  return (
    <>
      <Header />
      <div className="container col-lg-9 mt-5">
        <div className="row">
          <div className="col-md-4">
            <Sidebar />
          </div>
          <div className="col-md-8" style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "10px" }}>
            <Form onSubmit={handleSubmit} className="form-section">
              {serverMsg.text ? (
                <Alert variant={serverMsg.type} dismissible onClose={() => setServerMsg({ type: "", text: "" })}>
                  {serverMsg.text}
                </Alert>
              ) : null}

              {/* Single Line Diagram */}
              <Form.Group className="mb-3">
                <Form.Label>Single Line Diagram</Form.Label>
                <FileUploadBox name="diagramFile" onFileSelected={(file) => setDiagramFile(file)} />
                {diagramFile && <div className="mt-1 small text-muted">{diagramFile.name}</div>}
                {!diagramFile && existingDiagramName && renderOldFileLink(existingDiagramName)}

                {errors.diagramFile && <div className="text-danger">{errors.diagramFile}</div>}
              </Form.Group>

              {/* Load Schedule */}
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Label>Load Schedule</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="date"
                      value={loadDate}
                      onChange={(e) => {
                        setLoadDate(e.target.value);
                        saveToContext({ loadDate: e.target.value });
                      }}
                    />
                    <Form.Control
                      type="time"
                      value={loadTime}
                      onChange={(e) => {
                        setLoadTime(e.target.value);
                        saveToContext({ loadTime: e.target.value });
                      }}
                    />
                    <Button  variant="link" onClick={() => fileInputRef.current.click()}>
                      Browse File
                    </Button>
                    <Form.Control
                      type="file"
                      className="d-none"
                      ref={fileInputRef}
                      onChange={handleFileChange(setLoadFile)}
                    />
                  </InputGroup>
                  {(errors.loadDate || errors.loadTime) && (
                    <div className="text-danger">{errors.loadDate || errors.loadTime}</div>
                  )}
                  {loadFile && <div className="mt-1 small text-muted">Selected: {loadFile.name}</div>}
                  {!loadFile && existingLoadFileName && renderOldFileLink(existingLoadFileName)}

                </Col>
              </Row>

              {/* MV & LV Panels */}
              <Row className="mb-3">
                {["MV", "LV"].map((t) => {
                  const arr = t === "MV" ? mvPanels : lvPanels;
                  const setter = t === "MV" ? setMvPanels : setLvPanels;
                  return (
                    <Col md={8} key={t}>
                      <div className="d-flex justify-content-between">
                        <Form.Label>{t} Panels</Form.Label>
                        <Button
                          variant="link"
                          onClick={() => handleAdd(arr, setter, { size: "", qty: 1 })}
                        >
                          + Add Panel
                        </Button>
                      </div>
                      {arr.map((p, i) => (
                        <InputGroup className="mb-2" key={`${t}-${i}`}>
                          <Form.Control
                            placeholder="Size"
                            value={p.size}
                            onChange={handleChangePanel(arr, setter)(i, "size")}
                            isInvalid={!!errors[`${t.toLowerCase()}Panels`]}
                          />
                          <Form.Control
                            type="number"
                            min={1}
                            placeholder="Qty"
                            value={p.qty}
                            onChange={handleChangePanel(arr, setter)(i, "qty")}
                          />
                        </InputGroup>
                      ))}
                      {errors[`${t.toLowerCase()}Panels`] && (
                        <div className="text-danger">{errors[`${t.toLowerCase()}Panels`]}</div>
                      )}
                    </Col>
                  );
                })}
              </Row>

              {/* Capacitor Banks */}
              <Form.Group className="mb-3">
                <Row>
                  {banks.map((b, i) => (
                    <Col md={6} key={i}>
                      <Form.Label>Bank {i + 1}</Form.Label>
                      <Form.Control
                        placeholder="Brand of Capacitor"
                        className="mb-2"
                        value={b.brand || ""}
                        onChange={(e) => handleBankChange(i, "brand")(e)}
                      />
                      <InputGroup className="mb-2">
                        <Form.Control
                          type="number"
                          placeholder="KVA Rating"
                          value={b.kva || ""}
                          onChange={(e) => handleBankChange(i, "kva")(e)}
                        />
                        <InputGroup.Text>KVA</InputGroup.Text>
                      </InputGroup>
                      {["detuned", "shunt"].map((f) => (
                        <div key={f}>
                          <Form.Label>
                            {f === "detuned" ? "Detuned Filter?" : "Shunt Reactor?"}
                          </Form.Label>
                          <div>
                            {["Yes", "No"].map((opt) => (
                              <Form.Check
                                key={opt}
                                type="radio"
                                label={opt}
                                name={`${f}${i}`}
                                inline
                                value={opt}
                                checked={banks[i][f] === opt}
                                onChange={handleBankChange(i, f)}
                              />
                            ))}
                          </div>
                          {errors[`bank${i}-${f}`] && (
                            <div className="text-danger">{errors[`bank${i}-${f}`]}</div>
                          )}
                        </div>
                      ))}
                    </Col>
                  ))}
                </Row>
              </Form.Group>

              {/* Harmonic Filters */}
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between">
                  <Form.Label>Harmonic Filters</Form.Label>
                  <Button
                    variant="link"
                    onClick={() =>
                      handleAdd(filters, setFilters, {
                        type: "",
                        panel: "",
                        installation: "",
                        model: "",
                      })
                    }
                  >
                    + Add Filter
                  </Button>
                </div>
                {filters.map((f, i) => (
                  <Row className="mb-2" key={i}>
                    {["type", "panel", "installation", "model"].map((col) => (
                      <Col key={col}>
                        <Form.Control
                          placeholder={col.charAt(0).toUpperCase() + col.slice(1)}
                          value={f[col]}
                          onChange={handleFilterChange(i, col)}
                          isInvalid={!!errors[`filter${i}-${col}`]}
                        />
                      </Col>
                    ))}
                  </Row>
                ))}
              </Form.Group>

              {/* Voltage Stabilizer */}
              <Form.Group className="mb-3">
                <Form.Label>Voltage Stabilizers</Form.Label>
                <br />
                {["Yes", "No"].map((opt) => (
                  <Form.Check
                    key={opt}
                    type="radio"
                    label={opt}
                    name="stabilizer"
                    inline
                    value={opt}
                    checked={stabilizer.present === opt}
                    onChange={(e) => handleStabilizer({ present: e.target.value })}
                  />
                ))}
                {errors.stabilizer && <div className="text-danger">{errors.stabilizer}</div>}
                {stabilizer.present === "Yes" && (
                  <>
                    <Form.Control
                      placeholder="Brand"
                      className="mt-2 mb-2"
                      value={stabilizer.brand}
                      onChange={(e) => handleStabilizer({ brand: e.target.value })}
                      isInvalid={!!errors.stabBrand}
                    />
                    <InputGroup>
                      <Form.Control
                        type="number"
                        placeholder="KVA Rating"
                        value={stabilizer.kva}
                        onChange={(e) => handleStabilizer({ kva: e.target.value })}
                      />
                      <InputGroup.Text>KVA</InputGroup.Text>
                    </InputGroup>
                  </>
                )}
              </Form.Group>

              {/* Main Loads */}
              <Form.Group className="mb-3">
                <Form.Label>Main Loads of the Plant</Form.Label>
                <Select
                  options={loadOptions}
                  isMulti
                  value={loads}
                  onChange={handleLoadsChange}
                  placeholder="Select Loads..."
                />
                {errors.loads && <div className="text-danger">{errors.loads}</div>}
              </Form.Group>

              {/* VFDs */}
              <Form.Group className="mb-3">
                <Form.Label>VFDs</Form.Label>
                <Form.Control
                  placeholder="Model"
                  className="mb-2"
                  value={vfds.model}
                  onChange={(e) => handleVfds({ model: e.target.value })}
                  isInvalid={!!errors.vfdsModel}
                />
                <select
                  className="form-select mb-2"
                  value={vfds.appType}
                  onChange={(e) => handleVfds({ appType: e.target.value })}
                >
                  <option value="">Application Type</option>
                  <option value="Public">Public</option>
                </select>
                <Form.Control
                  placeholder="Install Location"
                  className="mb-2"
                  value={vfds.location}
                  onChange={(e) => handleVfds({ location: e.target.value })}
                />
                <Form.Control
                  type="date"
                  value={vfds.date}
                  onChange={(e) => handleVfds({ date: e.target.value })}
                />
              </Form.Group>

              {/* Total Failures */}
              <Form.Group className="mb-3">
                <Form.Label>Total Failures</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={failures}
                  onChange={(e) => handleFailures(Number(e.target.value))}
                  isInvalid={!!errors.failures}
                />
                {errors.failures && <div className="text-danger">{errors.failures}</div>}
              </Form.Group>

              <div className="d-flex w-100 p-3">
                <button
                  type="button"
                  className="btn text-white"
                    style={{ backgroundColor: "#009688", border: "none" }}
                  onClick={handlePreviousClick}
                  disabled={saving}
                >
                  ← Previous
                </button>

                <Button
                  type="submit"
                  className="btn text-white ms-auto"
                    style={{ backgroundColor: "#009688", border: "none" }}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>



              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Electrical;




