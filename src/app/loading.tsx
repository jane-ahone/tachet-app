import React from "react";
import styles from "./page.module.css";

const CuteLoadingPage: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <p className={styles.loadingText}>Loading palm wine goodness...</p>
    </div>
  );
};

export default CuteLoadingPage;
