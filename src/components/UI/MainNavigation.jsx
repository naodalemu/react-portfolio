import classes from "./MainNavigation.module.css"

function MainNavigation() {
    return (
        <div className={classes.container}>
            <button className={classes.logo}>ME</button>
            <ul className={classes.navContainer}>
                <a href="#home">
                    <li className={classes.navbarLink}>Home</li>
                </a>
                <a href="#about">
                    <li className={classes.navbarLink}>About</li>
                </a>
                <a href="#skills">
                    <li className={classes.navbarLink}>Skills</li>
                </a>
                <a href="#showcase">
                    <li className={classes.navbarLink}>Showcase</li>
                </a>
                <a href="#contact">
                    <li className={classes.navbarLink}>Contact</li>
                </a>
            </ul>
        </div>
    )
}

export default MainNavigation;