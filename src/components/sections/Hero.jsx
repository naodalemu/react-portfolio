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
        <h1 className={classes.myName}>Hi, I Am Naod</h1>
        <h2 className={classes.myDescription}>
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
        </h2>
      </div>
      <div className={classes.imageContainer}>
        <img src={naod} className={classes.myImage} />
      </div>
    </div>
  );
}

export default Hero;
