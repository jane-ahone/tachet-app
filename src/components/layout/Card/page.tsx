import styles from "./card.module.css";

interface CustomCardProps {
  title: string;
  data: string;
  icon?: React.ReactNode;
}
const CustomCard: React.FC<CustomCardProps> = ({ title, data, icon }) => {
  return (
    <div className={styles.cardMain}>
      <div className={styles.headingDiv}>
        <p className={styles.heading}>{title}</p>
      </div>
      <div className={styles.dataDetails}>
        {icon ? <span className={styles.iconWrapper}>{icon}</span> : null}
        <span className={styles.detail}>{data}</span>
      </div>
    </div>
  );
};

export default CustomCard;
