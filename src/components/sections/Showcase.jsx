import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Showcase.module.css";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import Projects from "../UI/Projects";
import { useEffect, useState } from "react";
import reactQuizImage from "../../assets/images/Showcase/ReactMockup-min.png";
import libraryImage from "../../assets/images/Showcase/hero-min.png";
import electricBill from "../../assets/images/Showcase/ElectricBill-min.png";
import { motion } from "framer-motion";

function Showcase() {
    const projectData = [
        {
            id: 0,
            name: "Quiz App",
            description:
                "A quiz platform made with React which is a JavaScript library. It have an add question section and also it uses Firebase Realtime Database to store the question. It also have an online and offline indication to fetch the data from the database. This application can be scalled to however much needed and we can add categories too. Take a look using the globe icon below.",
            image: reactQuizImage,
            languages: ["HTML", "CSS", "React"],
            githubLink: "https://github.com/naodalemu/quizee",
            liveServer: "https://quizee-three.vercel.app",
        },
        {
            id: 1,
            name: "Library Landing and Login Page",
            description:
                "This is the front end of a library management system I built for my internship. Our clients wanted a good looking and elegant page to give users awareness of their library on the first page so that they can Sign Up with most important informations in mind. The website consists of a full landing page with motivation video for readers at the footer and with a login page for both admin and member. It's responsive in its design and can be for any screen. Take a look by clicking the globe icon below.",
            image: libraryImage,
            languages: ["HTML", "CSS", "JavaScript", "Chart.js"],
            githubLink: "https://github.com/naodalemu/BooksLibrary",
            liveServer: "https://libofbooks.netlify.app",
        },
        {
            id: 2,
            name: "Electric Billing Company Page",
            description:
                "An elegant looking and a fully functional website for an electric billing company to handle payment and user interaction. Unfortunately this page can not be hosted because of the backend code but you can see the images and the looks of it on my upwork profile by clicking the globe icon below.",
            image: electricBill,
            languages: ["HTML", "CSS", "JavaScript"],
            githubLink: "https://github.com/naodalemu/Electric-billing-system",
            liveServer: "https://github.com/naodalemu/Electric-billing-system",
        },
    ];

    const [index, setIndex] = useState(0);
    const [currentShowcase, setCurrentShowcase] = useState(projectData[index]);
    useEffect(() => {
        setCurrentShowcase(projectData[index]);
    }, [index]);

    function toggleLeft() {
        if (index > 0) {
            setIndex((index) => {
                return index - 1;
            });
        }
    }

    function toggleRight() {
        if (index < projectData.length - 1) {
            setIndex((index) => {
                return index + 1;
            });
        }
    }

    return (
        <div className={classes.ShowcaseSection}>
            <div id="showcase" className={classes.showRoom}></div>
            <motion.h1 className={classes.sectionName} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }} >Showcase or Experience</motion.h1>
            <motion.div className={classes.showContainer} initial={{ x:-100, opacity: 0 }} whileInView={{ x:0, opacity: 1  }} transition={{ duration: 0.5 }}>
                <Projects
                    name={currentShowcase.name}
                    description={currentShowcase.description}
                    image={currentShowcase.image}
                    languages={currentShowcase.languages}
                    githubLink={currentShowcase.githubLink}
                    liveServer={currentShowcase.liveServer}
                    id={currentShowcase.id}
                />
                <motion.div className={classes.arrowContainer}>
                    <div className={classes.leftNRightContainer}>
                        <button
                            className={classes.toggleLeft}
                            onClick={toggleLeft}
                            style={
                                index === 0
                                    ? { color: "gray", border: "2px solid gray" }
                                    : null
                            }
                        >
                            <FontAwesomeIcon icon={faLeftLong} />
                        </button>
                        <button
                            className={classes.toggleRight}
                            onClick={toggleRight}
                            style={
                                index === projectData.length - 1
                                    ? { color: "gray", border: "2px solid gray" }
                                    : null
                            }
                        >
                            <FontAwesomeIcon icon={faRightLong} />
                        </button>
                    </div>
                    <div className={classes.statusBarContainer}>
                        <div
                            className={classes.statusBar}
                            style={{
                                width: `${
                                    (100 * index) / (projectData.length - 1)
                                }%`,
                            }}
                        ></div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Showcase;
