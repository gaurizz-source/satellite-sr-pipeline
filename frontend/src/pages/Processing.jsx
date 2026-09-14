import { useEffect } from "react";

import {
  CheckCircle2,
  Cpu,
  ImageIcon,
  Layers3,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function Processing() {
      useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/results";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="processing-page">

      {/* HEADER */}

      <div className="processing-top">

        <div className="processing-brand">
          <div className="processing-logo">
            <Sparkles size={19} />
          </div>

          <div>
            <strong>SPECTRA-SR</strong>
            <span>SUPER-RESOLUTION ENGINE</span>
          </div>
        </div>

        <div className="processing-live">
          <span className="online-dot"></span>
          PROCESSING
        </div>

      </div>


      {/* MAIN */}

      <div className="processing-main">

        <div className="processing-eyebrow">
          ANALYSIS PIPELINE • LIVE
        </div>

        <h1>
          Reconstructing
          <span> spatial detail.</span>
        </h1>

        <p className="processing-description">
          The imagery is being processed through the selected
          super-resolution pipeline. Please keep this window open.
        </p>


        {/* PROGRESS */}

        <div className="progress-section">

          <div className="progress-header">
            <span>OVERALL PROGRESS</span>
            <strong>64%</strong>
          </div>

          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>

        </div>


        {/* PIPELINE */}

        <div className="pipeline">

          <div className="pipeline-step complete">

            <div className="pipeline-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <strong>Input validation</strong>
              <span>Imagery successfully received</span>
            </div>

            <b>DONE</b>

          </div>


          <div className="pipeline-line complete-line"></div>


          <div className="pipeline-step complete">

            <div className="pipeline-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <strong>Image preprocessing</strong>
              <span>Preparing multispectral input</span>
            </div>

            <b>DONE</b>

          </div>


          <div className="pipeline-line active-line"></div>


          <div className="pipeline-step active">

            <div className="pipeline-icon spinning">
              <LoaderCircle size={18} />
            </div>

            <div>
              <strong>SR model inference</strong>
              <span>Reconstructing high-resolution detail</span>
            </div>

            <b>RUNNING</b>

          </div>


          <div className="pipeline-line"></div>


          <div className="pipeline-step">

            <div className="pipeline-icon">
              <Layers3 size={18} />
            </div>

            <div>
              <strong>Spectral analysis</strong>
              <span>Evaluating spectral consistency</span>
            </div>

            <b>QUEUED</b>

          </div>


          <div className="pipeline-line"></div>


          <div className="pipeline-step">

            <div className="pipeline-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <strong>Reliability estimation</strong>
              <span>Generating uncertainty information</span>
            </div>

            <b>QUEUED</b>

          </div>

        </div>


        {/* SYSTEM INFO */}

        <div className="processing-info">

          <div>
            <Cpu size={15} />
            <span>Deep-learning inference</span>
          </div>

          <div>
            <ImageIcon size={15} />
            <span>4× spatial reconstruction</span>
          </div>

          <div>
            <ShieldCheck size={15} />
            <span>Spectral-aware processing</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Processing;