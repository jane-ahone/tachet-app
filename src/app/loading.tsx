import React from "react";
import styles from "./page.module.css";

const CuteLoadingPage: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <svg
          className={styles.palmTree}
          viewBox="0 0 100 100"
          width="100"
          height="100"
        >
          <path
            d="M50 90 L50 70 Q30 60 35 40 Q40 20 50 10 Q60 20 65 40 Q70 60 50 70 Z"
            fill="#2ecc71"
          />
          <rect x="48" y="70" width="4" height="30" fill="#8B4513" />
        </svg>
        <div className={styles.dropContainer}>
          <svg
            className={styles.drop}
            viewBox="0 0 100 100"
            width="20"
            height="20"
          >
            <path
              d="M50 0 Q80 40 80 75 Q80 100 50 100 Q20 100 20 75 Q20 40 50 0 Z"
              fill="#3498db"
            />
          </svg>
        </div>
        <p className={styles.loadingText}>Loading palm wine goodness...</p>
      </div>
    </div>
  );
};

export default CuteLoadingPage;
