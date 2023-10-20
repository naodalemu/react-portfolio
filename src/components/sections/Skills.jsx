import { useState } from "react";
import classes from "./Skills.module.css";
import SkillSet from "../UI/SkillSet";
import {
  faCss3,
  faFigma,
  faHtml5,
  faJsSquare,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import {
  faAd,
  faDrawPolygon,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

function Skills() {
  const [developmentActive, setDevelopmentActive] = useState(true);
  const [designActive, setDesignActive] = useState(false);

  return (
    <div className={classes.skillContainer}>
      <div id="skills"></div>
      <h1 className={classes.sectionTitle}>Skills and Expertise</h1>
      <div className={classes.skillSelector}>
        <div
          className={`${classes.frontSelector} ${
            developmentActive && classes.active
          }`}
          onClick={() => {
            setDevelopmentActive(true);
            setDesignActive(false);
          }}
        >
          Developement
        </div>
        <div
          className={`${classes.backSelector} ${
            designActive && classes.active
          }`}
          onClick={() => {
            setDesignActive(true);
            setDevelopmentActive(false);
          }}
        >
          Designing
        </div>
      </div>
      <div className={classes.skillsWrapper}>
        {developmentActive ? (
          <div className={classes.devSkills}>
            <SkillSet
              language={"HTML"}
              icon={faHtml5}
              years={"5 years"}
              percent={"95%"}
            />
            <SkillSet
              language={"CSS"}
              icon={faCss3}
              years={"5 years"}
              percent={"95%"}
            />
            <SkillSet
              language={"JavaScript"}
              icon={faJsSquare}
              years={"4 years"}
              percent={"80%"}
            />
            <SkillSet
              language={"React"}
              icon={faReact}
              years={"3 years"}
              percent={"60%"}
            />
          </div>
        ) : (
          <div className={classes.designSkills}>
            <SkillSet
              language={"Figma"}
              icon={faFigma}
              years={"4 years"}
              percent={"80%"}
            />
            <SkillSet
              language={"Adobe XD"}
              icon={faAd}
              years={"4 years"}
              percent={"80%"}
            />
            <SkillSet
              language={"Adobe Photoshop"}
              icon={faImages}
              years={"3 years"}
              percent={"60%"}
            />
            <SkillSet
              language={"Adobe Illustrator"}
              icon={faDrawPolygon}
              years={"3 years"}
              percent={"60%"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Skills;
