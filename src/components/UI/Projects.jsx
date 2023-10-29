import classes from "./Projects.module.css";
import Quiz from "../../assets/images/darkDev.jpg"
import Library from "../../assets/images/naod.png"

function Projects(props) {
    return (
        <div className={classes.project}>
            <div className={classes.imageContainer} style={{background: `url(${props.image})`}}></div>
            <div className={classes.explanationContainer}>
                <div className={classes.projectExplanation}>
                    <h1 className={classes.projectName}>{props.name}</h1>
                    <p className={classes.projectDesc}>{props.description}</p>
                </div>
                <div className={classes.projectAddons}>
                    <div className={classes.projectLanguages}>{props.languages}</div>
                    <div className={classes.projectLink}>{props.githubLink} {props.liveServer}</div>
                </div>
            </div>
        </div>
    );
}

export default Projects;
