import { Wallet } from "lucide-react";
import styles from "./card.module.css";

const CustomCard = () => {
  return (
    <div className={styles.cardMain}>
      <div>
        <p className={styles.heading}>Today&apos;s Money</p>
        <p className={styles.detail}>$53,000</p>
      </div>
      <div className={styles.iconWrapper}>
        <Wallet color="white" />
      </div>
    </div>
  );
};

export default CustomCard;
