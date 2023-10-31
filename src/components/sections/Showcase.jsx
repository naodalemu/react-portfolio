import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Showcase.module.css";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import Projects from "../UI/Projects";
import { useEffect, useState } from "react";

function Showcase() {
    const projectData = [
        {
            name: "Quiz App",
            description: "This is by far the most dumb project of all time",
            image: "src/assets/images/Showcase/ReactMockup.png",
            languages: ["HTML", "CSS", "React"],
            githubLink: "https://github.com/naodalemu/queez-app",
            liveServer: "https://quizee-three.vercel.app",
        },
        {
            name: "Library Landing Page",
            description:
                "This was made for a library management system landing page which is made to engage users with statistical data and every other thing they need to know before they join",
            image: "src/assets/images/Showcase/hero.png",
            languages: ["HTML", "CSS", "JavaScript", "Chart.js"],
            githubLink: "https://github.com/naodalemu/libray",
            liveServer: "https://bookoflibs.netlify.app",
        },
        {
            name: "Electric Billing Company Page",
            description:
                "The electric billing thing is something I do not care about and I am listening to some african dude say I was cheated on.",
                image: "src/assets/suitcase.png",
                languages: ["HTML", "CSS", "JavaScript", "Chart.js"],
            githubLink: "https://github.com/naodalemu/libray",
            liveServer: "https://bookoflibs.netlify.app",
        }
    ];
    
    const [ index, setIndex ] = useState(0);
    const [ currentShowcase, setCurrentShowcase ] = useState(projectData[index])
    useEffect(() => {
        setCurrentShowcase(projectData[index])
    }, [index])

    function toggleLeft() {
        if (index > 0) {
            setIndex(index => {
                return index - 1
            });
        }
    }
    
    function toggleRight() {
        if (index < projectData.length-1) {
            setIndex(index => {
                return index + 1
            });
        }
    }
    
    return (
        <div className={classes.ShowcaseSection}>
            <div id="showcase" className={classes.showRoom}></div>
            <h1 className={classes.sectionName}>Showcase or Experience</h1>
            <div className={classes.showContainer}>
                        <Projects
                            name={currentShowcase.name}
                            description={currentShowcase.description}
                            image={currentShowcase.image}
                            languages={currentShowcase.languages}
                            githubLink={currentShowcase.githubLink}
                            liveServer={currentShowcase.liveServer}
                        />
                <div className={classes.arrowContainer}>
                    <button className={classes.toggleLeft} onClick={toggleLeft} style={index === 0 ? {color: "gray", border: "2px solid gray"} : null}>
                        <FontAwesomeIcon icon={faLeftLong} />
                    </button>
                    <button className={classes.toggleRight} onClick={toggleRight} style={index === projectData.length-1 ? {color: "gray", border: "2px solid gray"} : null}>
                        <FontAwesomeIcon icon={faRightLong} />
                    </button>
                    <div className={classes.statusBarContainer}>
                        <div className={classes.statusBar} style={{width: `${(100 * (index)) / (projectData.length-1)}%`}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Showcase;
