import { useState } from "react";
import { Maximize2, MoveHorizontal } from "lucide-react";

function ImageComparison({ inputImage = null, outputImage = null }) {
  const [position, setPosition] = useState(50);

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const percentage = Math.min(
      100,
      Math.max(0, (x / rect.width) * 100)
    );

    setPosition(percentage);
  };

  return (
    <div className="comparison-wrapper">

      <div
        className="comparison-viewer"
        onMouseMove={(event) => {
          if (event.buttons === 1) {
            handleMove(event);
          }
        }}
        onClick={handleMove}
      >

        {/* OUTPUT IMAGE */}

        <div className="comparison-output">

          {outputImage ? (
            <img
              src={outputImage}
              alt="Super-resolved output"
            />
          ) : (
            <div className="comparison-placeholder output">
              <Maximize2 size={38} />

              <strong>
                SR reconstruction
              </strong>

              <span>
                Backend output will appear here
              </span>
            </div>
          )}

        </div>


        {/* INPUT IMAGE */}

        <div
          className="comparison-input"
          style={{
            width: `${position}%`,
          }}
        >

          {inputImage ? (
            <img
              src={inputImage}
              alt="Input satellite imagery"
            />
          ) : (
            <div className="comparison-placeholder">

              <Maximize2 size={38} />

              <strong>
                Input imagery
              </strong>

              <span>
                Uploaded image
              </span>

            </div>
          )}

        </div>


        {/* LABELS */}

        <div className="comparison-label input-label">
          INPUT • MEDIUM RESOLUTION
        </div>

        <div className="comparison-label output-label">
          OUTPUT • SUPER RESOLVED
        </div>


        {/* SLIDER */}

        <div
          className="comparison-divider"
          style={{
            left: `${position}%`,
          }}
        >

          <div className="comparison-handle">
            <MoveHorizontal size={15} />
          </div>

        </div>

      </div>


      <div className="comparison-instruction">
        <MoveHorizontal size={13} />
        Drag or click across the image to compare reconstruction
      </div>

    </div>
  );
}

export default ImageComparison;