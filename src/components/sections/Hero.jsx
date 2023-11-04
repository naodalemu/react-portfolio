import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import classes from "./Hero.module.css";
import naod from "../../assets/images/naod.png";

function Hero() {
  const [timeIs, setTimeIs] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeIs(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.container} id="home">
      <div className={classes.textContainer}>
        <motion.h1 className={classes.myName} initial={{ y: 50, opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ ease: "easeInOut", duration: 1.5 }}>Hi, I Am Naod</motion.h1>
        <motion.h2 className={classes.myDescription} initial={{ y: 50, opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ ease: "easeInOut", duration: 1 }}>
          A Front-End Web{" "}
          {timeIs.getSeconds() % 2 === 0 ? (
            <div className={classes.designer}>
              <p className={classes.designerText}>Designer</p>
            </div>
          ) : (
            <div className={classes.developer}>
              <p className={classes.developerText}>Developer</p>
            </div>
          )}
        </motion.h2>
      </div>
      <div className={classes.imageContainer}>
        <img src={naod} className={classes.myImage} />
      </div>
      <div id="about" className={classes.aboutNav}></div>
    </div>
  );
}

export default Hero;
