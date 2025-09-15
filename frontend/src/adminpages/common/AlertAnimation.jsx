import React from "react";
import Lottie from "lottie-react";
import alertAnimation from "../../adminpages/common/Alert.json";

const AlertAnimation = () => {
  return (
    <div style={{ width: "200px", height: "200px", margin: "0 auto 0 auto" }}>
      <Lottie
        animationData={alertAnimation}
        loop={true}
        style={{
          width: "100%",
          height: "100%",
          scale: 1.5,
        }}
      />
    </div>
  );
};

export default AlertAnimation;
