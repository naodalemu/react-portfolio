import { fa3, faAd, faPlus } from "@fortawesome/free-solid-svg-icons";
import TW from "../UI/TextWrapper";
import classes from "./About.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCss3, faFigma, faHtml5, faJsSquare, faReact } from "@fortawesome/free-brands-svg-icons";
import developer from "../../assets/images/darkDev.jpg"

function About() {
    return (
        <div className={classes.aboutContainer} id="about">
            <div className={classes.aboutExplanation}>
                <h1 className={classes.aboutTitle}>About Me</h1>
                <p className={classes.aboutDescription}>
                    I am a passionate front end developer who specializes on <TW fa={faHtml5}> HTML</TW>, <TW fa={faCss3}> CSS</TW>, <TW fa={faJsSquare}> JavaScript</TW> and <TW fa={faReact}> React</TW>. Even this website is made using <TW fa={faReact}> React</TW>.
                    I love programming so much but I am not just a programmer, I create amazing UI and UX as a website designer too. With skills of both
                    <TW fa={faFigma}> Figma</TW> and <TW fa={faAd}> Adobe</TW> XD I am really proud to say that I have spent <FontAwesomeIcon icon={fa3} /><FontAwesomeIcon icon={faPlus} /> years designing websites. I love making react apps since they make
                    DOM manipulation pretty easy and component based programming makes life so easier for multiple components with the same look. Graduated 
                    with a Bachelor of computere Science and Engineering from Adama Science and Technology University (ASTU), which is one of the leading Universities in my country.
                </p>
            </div>
            <div className={classes.aboutImage}>
                <div className={classes.imageContainer}>
                    <img src={developer} className={classes.image} />
                </div>
            </div>
        </div>
    )
}

export default About;