import { Link } from 'react-router';
import styles from './Sub.module.css';
export default function Sub({ name, description }) {
  return (
    <Link className={styles.wrapper} to={`/subribbits/${name}`}>
      <h2>r/{name}</h2>
      <p>{description}</p>
    </Link>
  );
}
