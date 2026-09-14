import "./Analytics.css";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Clock3,
  Layers3,
  ShieldCheck,
  Sparkles,
  Cpu,
  Satellite,
  Gauge,
  ArrowUpRight,
  Zap,
} from "lucide-react";

function Analytics() {
  const models = [
    { name: "Bicubic", type: "Baseline", status: "Available" },
    { name: "EDSR", type: "CNN", status: "Evaluation pending" },
    { name: "RCAN", type: "Attention CNN", status: "Evaluation pending" },
    { name: "SwinIR", type: "Transformer", status: "Evaluation pending" },
    { name: "Hybrid SR", type: "CNN + Transformer", status: "Primary model" },
  ];

  return (
    <div className="analytics-page">

      {/* HEADER */}
      <header className="analytics-header">

        <div>
          <span className="eyebrow">
            SYSTEM ANALYTICS • SIH26142
          </span>

          <h1>
            Mission Intelligence <span>Dashboard</span>
          </h1>

          <p>
            Evaluate spatial reconstruction, spectral fidelity,
            model performance and inference reliability.
          </p>
        </div>

        <div className="analytics-live">
          <span className="live-dot"></span>
          LIVE ANALYTICS
        </div>

      </header>


      {/* STATUS STRIP */}
      <div className="analytics-status-strip">

        <div className="status-item">
          <Satellite size={17} />
          <div>
            <span>INPUT</span>
            <strong>Multispectral imagery</strong>
          </div>
        </div>

        <div className="status-item">
          <Cpu size={17} />
          <div>
            <span>PIPELINE</span>
            <strong>Super-resolution</strong>
          </div>
        </div>

        <div className="status-item">
          <Gauge size={17} />
          <div>
            <span>UPSCALE</span>
            <strong>4× spatial resolution</strong>
          </div>
        </div>

        <div className="status-item">
          <ShieldCheck size={17} />
          <div>
            <span>MODE</span>
            <strong>Spectral-aware</strong>
          </div>
        </div>

      </div>


      {/* METRICS */}
      <section className="analytics-section">

        <div className="section-heading">
          <div>
            <span className="eyebrow">RECONSTRUCTION QUALITY</span>
            <h2>Model performance</h2>
          </div>

          <span className="section-note">
            Values populated after backend evaluation
          </span>
        </div>


        <div className="metrics-grid">

          <div className="metric-card featured">

            <div className="metric-card-top">
              <div className="metric-icon">
                <Activity size={18} />
              </div>
              <span>PIXEL QUALITY</span>
            </div>

            <div className="metric-value">
              —
              <small>dB</small>
            </div>

            <p>Peak Signal-to-Noise Ratio</p>

            <div className="metric-footer">
              Awaiting evaluation
            </div>

          </div>


          <div className="metric-card">

            <div className="metric-card-top">
              <div className="metric-icon">
                <ShieldCheck size={18} />
              </div>
              <span>STRUCTURAL</span>
            </div>

            <div className="metric-value">—</div>

            <p>Structural Similarity Index</p>

            <div className="metric-footer">
              SSIM • backend metric
            </div>

          </div>


          <div className="metric-card">

            <div className="metric-card-top">
              <div className="metric-icon">
                <BarChart3 size={18} />
              </div>
              <span>SPECTRAL</span>
            </div>

            <div className="metric-value">
              —
              <small>°</small>
            </div>

            <p>Spectral Angle Mapper</p>

            <div className="metric-footer">
              Lower is better
            </div>

          </div>


          <div className="metric-card">

            <div className="metric-card-top">
              <div className="metric-icon">
                <Clock3 size={18} />
              </div>
              <span>EFFICIENCY</span>
            </div>

            <div className="metric-value">
              —
              <small>sec</small>
            </div>

            <p>Inference processing time</p>

            <div className="metric-footer">
              Runtime measurement
            </div>

          </div>

        </div>

      </section>


      {/* SPATIAL RECONSTRUCTION */}
      <section className="analytics-section">

        <div className="section-heading">
          <div>
            <span className="eyebrow">SPATIAL RECONSTRUCTION</span>
            <h2>Input → Super-resolved output</h2>
          </div>

          <span className="analysis-chip">
            <Sparkles size={13} />
            SPECTRAL-AWARE
          </span>
        </div>


        <div className="reconstruction-panel">

          <div className="reconstruction-box">

            <div className="image-label">
              INPUT • MEDIUM RESOLUTION
            </div>

            <div className="image-placeholder">
              <Satellite size={34} />
              <strong>Input imagery</strong>
              <span>Satellite preview will appear here</span>
            </div>

          </div>


          <div className="reconstruction-arrow">
            <ArrowUpRight size={22} />
          </div>


          <div className="reconstruction-box output">

            <div className="image-label">
              OUTPUT • SUPER RESOLVED
            </div>

            <div className="image-placeholder">
              <Layers3 size={34} />
              <strong>SR reconstruction</strong>
              <span>Backend output will appear here</span>
            </div>

          </div>

        </div>

      </section>


      {/* MODEL COMPARISON */}
      <section className="analytics-section">

        <div className="section-heading">
          <div>
            <span className="eyebrow">MODEL BENCHMARK</span>
            <h2>Super-resolution models</h2>
          </div>

          <span className="section-note">
            Comparative evaluation pipeline
          </span>
        </div>


        <div className="model-table">

          <div className="model-table-header">
            <span>MODEL</span>
            <span>ARCHITECTURE</span>
            <span>STATUS</span>
            <span>RESULT</span>
          </div>

          {models.map((model, index) => (

            <div className="model-row" key={model.name}>

              <div className="model-name">
                <span className="model-number">
                  0{index + 1}
                </span>

                <strong>{model.name}</strong>
              </div>

              <span className="model-type">
                {model.type}
              </span>

              <span className={`model-status ${
                model.status === "Primary model"
                  ? "primary"
                  : ""
              }`}>
                <span></span>
                {model.status}
              </span>

              <span className="model-result">
                —
              </span>

            </div>

          ))}

        </div>

      </section>


      {/* SPECTRAL ANALYSIS */}
      <section className="analytics-section">

        <div className="section-heading">
          <div>
            <span className="eyebrow">SPECTRAL FIDELITY</span>
            <h2>Band consistency</h2>
          </div>

          <div className="analysis-chip turquoise">
            <BrainCircuit size={14} />
            SPECTRAL ANALYSIS
          </div>
        </div>


        <div className="spectral-panel">

          <div className="spectral-copy">
            <div className="large-icon">
              <Zap size={21} />
            </div>

            <div>
              <h3>Multispectral consistency</h3>

              <p>
                Band-level comparison and spectral-angle analysis
                will be generated after backend inference.
              </p>
            </div>
          </div>


          <div className="band-visual">

            {["B02", "B03", "B04", "B08", "B11", "B12"].map(
              (band, index) => (

                <div className="band-column" key={band}>

                  <div
                    className="band-bar"
                    style={{
                      height: `${35 + index * 9}%`,
                    }}
                  ></div>

                  <span>{band}</span>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* RELIABILITY */}
      <section className="analytics-section">

        <div className="section-heading">
          <div>
            <span className="eyebrow">MODEL RELIABILITY</span>
            <h2>Uncertainty estimation</h2>
          </div>

          <span className="analysis-chip">
            <ShieldCheck size={14} />
            RELIABILITY
          </span>
        </div>


        <div className="uncertainty-panel">

          <div className="uncertainty-visual">

            <div className="uncertainty-grid">
              {Array.from({ length: 48 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index % 7 === 0 || index % 11 === 0
                      ? "uncertain"
                      : ""
                  }
                ></span>
              ))}
            </div>

            <div className="uncertainty-overlay">
              <span>UNCERTAINTY MAP</span>
              <strong>Awaiting model inference</strong>
            </div>

          </div>


          <div className="uncertainty-copy">

            <span className="eyebrow">PIXEL-WISE CONFIDENCE</span>

            <h3>
              Separate supported information
              from model inference.
            </h3>

            <p>
              The uncertainty layer is designed to communicate
              where the reconstructed imagery is more reliable
              and where the model is making stronger inferences.
            </p>

            <div className="confidence-list">

              <div>
                <span className="confidence-dot supported"></span>
                Input-supported information
              </div>

              <div>
                <span className="confidence-dot inferred"></span>
                Model-inferred information
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="analytics-footer">

        <div>
          <span className="eyebrow">SPECTRA-SR</span>
          <p>
            Satellite super-resolution intelligence platform
          </p>
        </div>

        <div className="footer-status">
          <span className="live-dot"></span>
          Pipeline ready
        </div>

      </footer>

    </div>
  );
}

export default Analytics;