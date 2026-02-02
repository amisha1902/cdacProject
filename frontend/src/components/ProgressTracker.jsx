import React from "react";

const ProgressTracker = ({ currentStep }) => {
  // Steps updated to match your reference image
  const steps = ["CART",  "PAYMENT", "BOOKING CONFIRMED"];

  return (
    <div className="d-flex justify-content-center align-items-center mb-4 py-3">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step Text */}
          <div className="d-flex flex-column align-items-center">
            <span
              style={{
                letterSpacing: "2px",
                fontSize: "14px",
                fontWeight: "600",
                color: index <= currentStep ? "#20B2AA" : "#535766", // Teal for active, Grey for inactive
                borderBottom: index === currentStep ? "3px solid #20B2AA" : "none",
                paddingBottom: "4px",
                transition: "all 0.3s ease"
              }}
            >
              {step}
            </span>
          </div>

          {/* Connector Line (only between items) */}
          {index < steps.length - 1 && (
            <div
              className="mx-3"
              style={{
                width: "60px",
                borderTop: "1px dashed #7e818c", // Creates the dashed line from your image
                marginTop: "2px"
              }}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressTracker;