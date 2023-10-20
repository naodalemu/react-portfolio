import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./SkillSet.module.css";
import {
  faArrowAltCircleRight,
  faGreaterThan,
} from "@fortawesome/free-solid-svg-icons";

function SkillSet(props) {
  return (
    <div className={classes.skillCard}>
      {/* <p className={classes.row1}>{props.language}</p> */}
      <h1 className={classes.row2}>
        <FontAwesomeIcon icon={props.icon} />
      </h1>
      <h2 className={classes.row3}>{props.language}</h2>
      <h2 className={classes.row4}>{props.years}</h2>
      <div className={classes.expertBarContainer}>
        <div
          className={classes.expertBar}
          style={{ width: `${props.percent}` }}
        >
          {props.percent}
        </div>
      </div>
    </div>
  );
}

export default SkillSet;
