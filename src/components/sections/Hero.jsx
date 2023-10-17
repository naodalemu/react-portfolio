import { useState, useEffect } from "react";
import classes from "./Hero.module.css"

function Hero() {
    const [timeIs, setTimeIs] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeIs(new Date())
        }, 1000)

        return () => clearInterval(interval);
    }, [])

    return (
        <div className={classes.container}>
            <div className={classes.textContainer}>
                <h1 className={classes.myName}>Hi, I Am Naod</h1>
                <h2 className={classes.myDescription}>A FrontEnd Web {timeIs.getSeconds() % 2 === 0 ? <p className={classes.designer}>Designer</p> : <p className={classes.developer}>Developer</p>}</h2>
            </div>
            <div className={classes.imageContainer}>
                <img src="src/assets/images/naod.png" className={classes.myImage} />
            </div>
        </div>
    )
}

export default Hero;