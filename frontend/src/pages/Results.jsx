import {
  Activity,
  ArrowLeft,
  BarChart3,
  Download,
  Layers3,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";

import ImageComparison from "../components/ImageComparison";
import { getOutputUrl } from "../services/api";


function Results() {

  // ----------------------------------------------------------
  // GET REAL BACKEND RESULT
  // ----------------------------------------------------------

  let result = null;

  try {
    const storedResult =
      sessionStorage.getItem("spectra_sr_result");

    if (storedResult) {
      result = JSON.parse(storedResult);
    }
  } catch (error) {
    console.error(
      "Could not read super-resolution result:",
      error
    );
  }


  // ----------------------------------------------------------
  // INPUT IMAGE
  // ----------------------------------------------------------

  const inputImage =
    sessionStorage.getItem("spectra_input_image") || null;


  // ----------------------------------------------------------
  // REAL BACKEND PREVIEW
  // ----------------------------------------------------------

  const outputImage =
    result?.preview_url
      ? getOutputUrl(result.preview_url)
      : null;


  // ----------------------------------------------------------
  // REAL BACKEND DATA
  // ----------------------------------------------------------

  const inputWidth =
    result?.input?.width ?? "—";

  const inputHeight =
    result?.input?.height ?? "—";

  const outputWidth =
    result?.output?.width ?? "—";

  const outputHeight =
    result?.output?.height ?? "—";

  const scaleFactor =
    result?.output?.scale_factor ?? "—";

  const inferenceTime =
    result?.inference_time_seconds != null
      ? `${result.inference_time_seconds} s`
      : "—";


  // ----------------------------------------------------------
  // DOWNLOAD REAL GEOTIFF
  // ----------------------------------------------------------

  const outputDownloadUrl =
    result?.output_url
      ? getOutputUrl(result.output_url)
      : null;


  // ----------------------------------------------------------
  // NEW ANALYSIS
  // ----------------------------------------------------------

  const startNewAnalysis = () => {

    sessionStorage.removeItem(
      "spectra_sr_result"
    );

    sessionStorage.removeItem(
      "spectra_input_image"
    );

    window.location.href = "/";
  };


  // ----------------------------------------------------------
  // BACK TO ANALYSIS
  // ----------------------------------------------------------

  const backToAnalysis = () => {
    window.location.href = "/";
  };


  return (
    <div className="results-page">

      {/* ======================================================
          TOP NAV
      ====================================================== */}

      <div className="results-nav">

        <div className="results-brand">

          <div className="results-logo">
            <Sparkles size={18} />
          </div>

          <div>
            <strong>SPECTRA-SR</strong>
            <span>ANALYSIS RESULT</span>
          </div>

        </div>


        <div className="result-live">
          <span className="online-dot"></span>
          ANALYSIS COMPLETE
        </div>

      </div>


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="results-header">

        <div>

          <div className="eyebrow">
            SUPER-RESOLUTION PIPELINE • RESULT
          </div>

          <h1>
            Spatial detail,
            <span> reconstructed.</span>
          </h1>

          <p>
            Compare the original medium-resolution imagery
            with the super-resolved reconstruction and review
            model-quality indicators.
          </p>

        </div>


        {outputDownloadUrl && (

          <a
            className="secondary-button"
            href={outputDownloadUrl}
            download
          >
            <Download size={15} />
            Download SR GeoTIFF
          </a>

        )}

      </div>


      {/* ======================================================
          COMPARISON
      ====================================================== */}

      <section className="result-section">

        <div className="section-heading">

          <div>

            <span className="card-kicker">
              SPATIAL RECONSTRUCTION
            </span>

            <h2>
              Before & After
            </h2>

          </div>


          <div className="result-badge">
            <ShieldCheck size={14} />
            4× SUPER-RESOLUTION
          </div>

        </div>


        <ImageComparison
          inputImage={inputImage}
          outputImage={outputImage}
        />


        {/* REAL DIMENSION INFORMATION */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "28px",
            marginTop: "18px",
            flexWrap: "wrap",
          }}
        >

          <span
            style={{
              fontSize: "12px",
              opacity: 0.65,
            }}
          >
            INPUT&nbsp;&nbsp;
            <strong>
              {inputWidth} × {inputHeight}
            </strong>
          </span>


          <span
            style={{
              fontSize: "12px",
              opacity: 0.65,
            }}
          >
            OUTPUT&nbsp;&nbsp;
            <strong>
              {outputWidth} × {outputHeight}
            </strong>
          </span>


          <span
            style={{
              fontSize: "12px",
              opacity: 0.65,
            }}
          >
            SCALE&nbsp;&nbsp;
            <strong>
              {scaleFactor}×
            </strong>
          </span>

        </div>

      </section>


      {/* ======================================================
          METRICS
      ====================================================== */}

      <div className="metrics-grid">


        {/* PSNR */}

        <div className="metric-card">

          <div className="metric-top">
            <Activity size={16} />
            <span>PSNR</span>
          </div>

          <strong>—</strong>

          <small>
            HR reference required
          </small>

        </div>


        {/* SSIM */}

        <div className="metric-card">

          <div className="metric-top">
            <Activity size={16} />
            <span>SSIM</span>
          </div>

          <strong>—</strong>

          <small>
            HR reference required
          </small>

        </div>


        {/* SAM */}

        <div className="metric-card">

          <div className="metric-top">
            <Layers3 size={16} />
            <span>SAM</span>
          </div>

          <strong>—</strong>

          <small>
            HR reference required
          </small>

        </div>


        {/* INFERENCE */}

        <div className="metric-card">

          <div className="metric-top">
            <Timer size={16} />
            <span>INFERENCE</span>
          </div>

          <strong>
            {inferenceTime}
          </strong>

          <small>
            Model processing time
          </small>

        </div>

      </div>


      {/* ======================================================
          LOWER GRID
      ====================================================== */}

      <div className="results-lower-grid">


        {/* ====================================================
            SPECTRAL CONSISTENCY
            ==================================================== */}

        <section className="analysis-card">

          <div className="analysis-card-header">

            <div>

              <span className="card-kicker">
                SPECTRAL FIDELITY
              </span>

              <h2>
                Spectral consistency
              </h2>

            </div>

            <Layers3 size={19} />

          </div>


          <div className="analysis-placeholder">

            <div className="placeholder-orbit">
              <Sparkles size={22} />
            </div>

            <strong>
              Spectral analysis pending
            </strong>

            <span>
              Band-level comparison and SAM evaluation
              require a corresponding high-resolution
              reference image.
            </span>

          </div>

        </section>


        {/* ====================================================
            UNCERTAINTY
            ==================================================== */}

        <section className="analysis-card">

          <div className="analysis-card-header">

            <div>

              <span className="card-kicker">
                RELIABILITY
              </span>

              <h2>
                Uncertainty map
              </h2>

            </div>

            <ShieldCheck size={19} />

          </div>


          <div className="analysis-placeholder uncertainty">

            <div className="placeholder-orbit">
              <ShieldCheck size={22} />
            </div>

            <strong>
              Reliability estimation pending
            </strong>

            <span>
              Pixel-wise uncertainty information will
              appear when uncertainty estimation is
              integrated into the model pipeline.
            </span>

          </div>

        </section>

      </div>


      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <div className="results-actions">


        <button
          className="back-button"
          onClick={backToAnalysis}
        >
          <ArrowLeft size={15} />
          Back to analysis
        </button>


        <button
          className="secondary-button"
          onClick={() => {
            window.location.href = "/analytics";
          }}
        >
          <BarChart3 size={15} />
          Analytics Dashboard
        </button>


        <button
          className="new-analysis-button"
          onClick={startNewAnalysis}
        >
          <RotateCcw size={15} />
          New analysis
        </button>

      </div>

    </div>
  );
}


export default Results;