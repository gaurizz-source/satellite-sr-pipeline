import Analytics from "./pages/AnalyticsPage.jsx";
import { useRef, useState } from "react";
import Results from "./pages/Results";
import Processing from "./pages/Processing";
import { superResolve } from "./services/api";

import {
  Activity,
  BarChart3,
  ChevronDown,
  Clock3,
  FileImage,
  History,
  Layers3,
  Menu,
  ScanLine,
  Settings,
  ShieldCheck,
  Satellite,
  Upload,
  X,
  Zap,
} from "lucide-react";

import "./App.css";


function App() {

  // ----------------------------------------------------------
  // SIMPLE ROUTING
  // ----------------------------------------------------------

  if (window.location.pathname === "/analytics") {
    return <Analytics />;
  }

  if (window.location.pathname === "/results") {
    return <Results />;
  }

  if (window.location.pathname === "/processing") {
    return <Processing />;
  }


  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [model, setModel] = useState("Hybrid SR");
  const [dragActive, setDragActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);


  // ----------------------------------------------------------
  // FILE HANDLING
  // ----------------------------------------------------------

  const handleFile = (selectedFile) => {

    if (!selectedFile) {
      return;
    }

    const fileName = selectedFile.name.toLowerCase();

    const isTiff =
      fileName.endsWith(".tif") ||
      fileName.endsWith(".tiff");

    // Current trained model requires 4-band GeoTIFF.
    if (!isTiff) {

      setError(
        "Please upload a 4-band GeoTIFF (.tif or .tiff)."
      );

      setFile(null);
      setPreview(null);

      return;
    }

    setError(null);
    setFile(selectedFile);
    setPreview(null);
  };


  // ----------------------------------------------------------
  // DRAG AND DROP
  // ----------------------------------------------------------

  const handleDrop = (event) => {

    event.preventDefault();

    setDragActive(false);

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };


  // ----------------------------------------------------------
  // REMOVE FILE
  // ----------------------------------------------------------

  const removeFile = () => {

    setFile(null);
    setPreview(null);
    setError(null);
  };


  // ----------------------------------------------------------
  // RUN REAL SUPER-RESOLUTION
  // ----------------------------------------------------------

  const runSuperResolution = async () => {

    if (!file) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {

      console.log(
        "Sending file to super-resolution backend:",
        file.name
      );

      const result = await superResolve(file);

      console.log(
        "Super-resolution result:",
        result
      );

      sessionStorage.setItem(
        "spectra_sr_result",
        JSON.stringify(result)
      );

      // Move to Results after successful
      // real backend inference.
      window.location.href = "/results";

    } catch (err) {

      console.error(
        "Super-resolution error:",
        err
      );

      setError(
        err.message ||
        "Super-resolution failed. Please try again."
      );

      setIsProcessing(false);
    }
  };


  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="app-shell">


      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        <div className="sidebar-brand">

          <div className="logo-mark">
            <Satellite size={21} />
          </div>

          <div>
            <div className="logo-title">
              SPECTRA-SR
            </div>

            <div className="logo-subtitle">
              INTELLIGENCE PLATFORM
            </div>
          </div>

        </div>


        <div className="nav-section-label">
          WORKSPACE
        </div>


        <nav className="sidebar-nav">

          {/* NEW ANALYSIS */}

          <button
            className="nav-item active"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <ScanLine size={18} />
            <span>New Analysis</span>
          </button>


          {/* ANALYTICS */}

          <button
            className="nav-item"
            onClick={() => {
              window.location.href = "/analytics";
            }}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </button>


          {/* HISTORY */}

          <button
            className="nav-item"
            onClick={() => {
              setError(
                "Analysis History will be available in the next version."
              );
            }}
          >
            <History size={18} />
            <span>Analysis History</span>
          </button>

        </nav>


        <div className="nav-section-label">
          SYSTEM
        </div>


        <nav className="sidebar-nav">

          {/* MODELS */}

          <button
            className="nav-item"
            onClick={() => {
              setError(
                "Model management will be available in the next version."
              );
            }}
          >
            <Layers3 size={18} />
            <span>Models</span>
          </button>


          {/* SETTINGS */}

          <button
            className="nav-item"
            onClick={() => {
              setError(
                "Settings will be available in the next version."
              );
            }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="system-card">

            <div className="system-card-top">

              <span className="online-dot"></span>

              <span>
                SYSTEM ONLINE
              </span>

            </div>

            <div className="system-card-text">
              Super-resolution engine ready
            </div>

          </div>


          <div className="project-label">

            <span>
              SIH 26142
            </span>

            <span>
              NTRO
            </span>

          </div>

        </div>

      </aside>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="main-content">


        {/* ====================================================
            TOP BAR
        ==================================================== */}

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={21} />
          </button>


          <div className="breadcrumb">

            <span>
              WORKSPACE
            </span>

            <span className="breadcrumb-separator">
              /
            </span>

            <strong>
              NEW ANALYSIS
            </strong>

          </div>


          <div className="topbar-right">

            <div className="live-status">

              <span className="online-dot"></span>

              LIVE

            </div>


            <div className="topbar-divider"></div>


            <div className="user-avatar">
              SR
            </div>

          </div>

        </header>


        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <section className="content">


          {/* ==================================================
              PAGE HEADING
          ================================================== */}

          <div className="page-heading">

            <div>

              <div className="eyebrow">
                SATELLITE INTELLIGENCE • 01
              </div>


              <h1>
                Super-Resolution
                <span> Mapping</span>
              </h1>


              <p>
                Enhance spatial detail in medium-resolution
                multispectral imagery while preserving
                spectral integrity.
              </p>

            </div>


            <div className="heading-badge">

              <ShieldCheck size={16} />

              <span>
                SPECTRAL-AWARE
              </span>

            </div>

          </div>


          {/* ==================================================
              WORKSPACE GRID
          ================================================== */}

          <div className="workspace-grid">


            {/* =================================================
                UPLOAD CARD
            ================================================= */}

            <div className="upload-card">

              <div className="card-header">

                <div>

                  <div className="card-kicker">
                    INPUT IMAGERY
                  </div>

                  <h2>
                    Upload satellite imagery
                  </h2>

                </div>


                <div className="card-number">
                  01
                </div>

              </div>


              {!file ? (

                <div
                  className={`drop-zone ${
                    dragActive
                      ? "drag-active"
                      : ""
                  }`}

                  onDragOver={(event) => {

                    event.preventDefault();

                    setDragActive(true);
                  }}

                  onDragLeave={() =>
                    setDragActive(false)
                  }

                  onDrop={handleDrop}

                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >

                  <div className="upload-icon">
                    <Upload size={23} />
                  </div>


                  <h3>
                    Drop your satellite image here
                  </h3>


                  <p>
                    Drag & drop your 4-band GeoTIFF
                    or browse from your device
                  </p>


                  <button
                    className="browse-button"

                    onClick={(event) => {

                      event.stopPropagation();

                      fileInputRef.current?.click();
                    }}
                  >

                    <FileImage size={16} />

                    Browse files

                  </button>


                  <div className="supported">
                    4-BAND GEOTIFF • TIFF
                  </div>


                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".tif,.tiff"
                    hidden

                    onChange={(event) =>
                      handleFile(
                        event.target.files?.[0]
                      )
                    }
                  />

                </div>

              ) : (

                <div className="uploaded-state">

                  <div className="image-preview">

                    {preview ? (

                      <img
                        src={preview}
                        alt="Uploaded satellite imagery"
                      />

                    ) : (

                      <div className="tiff-placeholder">

                        <Layers3 size={38} />

                        <span>
                          GEOSPATIAL RASTER
                        </span>

                        <small>
                          4-BAND TIFF / GEOTIFF
                        </small>

                      </div>

                    )}


                    <div className="preview-overlay">

                      <span>
                        INPUT
                      </span>

                    </div>

                  </div>


                  <div className="file-info">

                    <div>

                      <strong>
                        {file.name}
                      </strong>

                      <span>
                        {(file.size / (1024 * 1024))
                          .toFixed(2)} MB
                      </span>

                    </div>


                    <button
                      className="remove-button"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                CONFIG CARD
            ================================================= */}

            <div className="config-card">

              <div className="card-header">

                <div>

                  <div className="card-kicker">
                    PROCESSING
                  </div>

                  <h2>
                    Analysis settings
                  </h2>

                </div>


                <div className="card-number">
                  02
                </div>

              </div>


              {/* MODEL */}

              <div className="setting">

                <label>
                  Super-resolution model
                </label>


                <div className="select-wrapper">

                  <select
                    value={model}
                    onChange={(event) =>
                      setModel(event.target.value)
                    }
                  >

                    <option>
                      Hybrid SR
                    </option>

                    <option>
                      EDSR
                    </option>

                    <option>
                      RCAN
                    </option>

                    <option>
                      SwinIR
                    </option>

                  </select>


                  <ChevronDown size={16} />

                </div>

              </div>


              {/* SCALE */}

              <div className="setting">

                <label>
                  Upscaling factor
                </label>


                <div className="scale-options">

                  <button
                    className="scale-option disabled"
                    type="button"
                  >
                    2×
                  </button>


                  <button
                    className="scale-option selected"
                    type="button"
                  >
                    4×
                  </button>


                  <button
                    className="scale-option disabled"
                    type="button"
                  >
                    8×
                  </button>

                </div>

              </div>


              {/* SPECTRAL PRESERVATION */}

              <div className="setting">

                <label>
                  Output preferences
                </label>


                <div className="preference-row">

                  <div className="preference-icon">

                    <ShieldCheck size={17} />

                  </div>


                  <div>

                    <strong>
                      Spectral preservation
                    </strong>

                    <span>
                      Maintain multispectral fidelity
                    </span>

                  </div>


                  <div className="toggle active">
                    <span></span>
                  </div>

                </div>

              </div>


              <div className="setting-info">

                <Activity size={15} />

                <span>
                  Selected model:{" "}
                  <strong>
                    {model}
                  </strong>
                </span>

              </div>

            </div>

          </div>


          {/* ==================================================
              ACTION PANEL
          ================================================== */}

          <div className="action-panel">


            {error && (

              <div
                style={{
                  width: "100%",
                  color: "#ff6b6b",
                  marginBottom: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {error}
              </div>

            )}


            <div className="action-info">

              <div className="action-icon">
                <Zap size={18} />
              </div>


              <div>

                <strong>
                  {isProcessing
                    ? "Processing satellite imagery"
                    : "Ready for analysis"}
                </strong>


                <span>

                  {isProcessing
                    ? "Running the trained super-resolution model..."
                    : "Upload imagery to begin super-resolution processing."}

                </span>

              </div>

            </div>


            <button

              className={`run-button ${
                !file || isProcessing
                  ? "inactive"
                  : ""
              }`}

              onClick={runSuperResolution}

              disabled={
                !file ||
                isProcessing
              }
            >

              <span>

                {isProcessing
                  ? "Processing..."
                  : "Run Super-Resolution"}

              </span>


              <Zap size={17} />

            </button>

          </div>


          {/* ==================================================
              FOOTER INFO
          ================================================== */}

          <div className="bottom-info">

            <div>

              <Clock3 size={14} />

              <span>
                Real-time inference
              </span>

            </div>


            <div>

              <ShieldCheck size={14} />

              <span>
                Reliability-aware output
              </span>

            </div>


            <div>

              <Satellite size={14} />

              <span>
                Multispectral processing
              </span>

            </div>

          </div>


        </section>

      </main>

    </div>
  );
}


export default App;