import styles from "./card.module.css";

interface CustomCardProps {
  title: string;
  data: string;
  icon: React.ReactNode;
}
const CustomCard: React.FC<CustomCardProps> = ({ title, data, icon }) => {
  return (
    <div className={styles.cardMain}>
      <div>
        <p className={styles.heading}>{title}</p>
        <p className={styles.detail}>{data}</p>
      </div>
      <div className={styles.iconWrapper}>{icon}</div>
    </div>
  );
};

export default CustomCard;
