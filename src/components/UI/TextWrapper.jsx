import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./TextWrapper.module.css";

function TW(props) {
  return (
    <div className={classes.wrapper}>
      <FontAwesomeIcon icon={props.fa} />
      {props.children}
    </div>
  );
}

export default TW;
