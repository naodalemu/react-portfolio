import {
  fa3,
  faAd,
  faLongArrowAltRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import TW from "../UI/TextWrapper";
import classes from "./About.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCss3,
  faFigma,
  faGithub,
  faHtml5,
  faJsSquare,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import developer from "../../assets/images/darkDev.jpg";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { motion } from "framer-motion";

function About() {
  return (
    <motion.div className={classes.aboutContainer} initial={{ x:100, opacity: 0 }}  whileInView={{ x:0, opacity: 1  }} transition={{ duration: 0.5 }}>
      <div className={classes.aboutExplanation}>
        <h1 className={classes.aboutTitle}>About Me</h1>
        <p className={classes.aboutDescription}>
          I am a passionate front end developer who specializes on{" "}
          <TW fa={faHtml5}> HTML</TW>, <TW fa={faCss3}> CSS</TW>,{" "}
          <TW fa={faJsSquare}> JavaScript</TW> and <TW fa={faReact}> React</TW>.
          Even this website is made using React. I love programming so much and
          web developement more than anything but I am not just a programmer, I
          create amazing UI and UX as a website designer too. With skills of
          both <TW fa={faFigma}> Figma</TW> and <TW fa={faAd}> Adobe XD</TW> I
          am proud to say that I have spent{" "}
          <FontAwesomeIcon icon={fa3} />
          <FontAwesomeIcon icon={faPlus} /> years designing websites.
        </p>
        <button className={classes.gitContact}>
          <a href="https://github.com/naodalemu" target="blank">
            <TW fa={faGithub}>
              {" "}
              Take a look <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </TW>
          </a>
        </button>
      </div>
      <div className={classes.aboutImage} style={{background: `url(${developer})`, backgroundPositionX: "center", backgroundAttachment: "fixed"}}>
        <div className={classes.imageContainer}>
          <img src={developer} className={classes.image} />
        </div>
      </div>
    </motion.div>
  );
}

export default About;
