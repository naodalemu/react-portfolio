import classes from "./Projects.module.css";
import TW from "./TextWrapper";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faWeebly, faWeibo } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

function Projects(props) {
    const language = props.languages.map(lang => {
        return <div className={classes.projectLanguages}><TW>{lang}</TW></div>;
    })

    return (
        <div className={classes.project}>
            <div className={classes.imageContainer} style={{background: `url(${props.image})`}}></div>
            <div className={classes.explanationContainer}>
                <div className={classes.projectExplanation}>
                    <h2 className={classes.projectName}>{props.name}</h2>
                    <p className={classes.projectDesc}>{props.description}</p>
                </div>
                <div className={classes.projectAddons}>
                    <div className={classes.languageContainer}>
                        {language}
                    </div>
                    <div className={classes.projectLink}>
                        <a href={props.githubLink} className={classes.githunLink} target="blank"><FontAwesomeIcon icon={faGithub} /></a>
                        <a href={props.liveServer} className={classes.liveServer} target="blank"><FontAwesomeIcon icon={faGlobe} /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Projects;
