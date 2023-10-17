import classes from "./MainNavigation.module.css"

function MainNavigation() {
    return (
        <div className={classes.container}>
            <h2 className={classes.logo}>ME</h2>
            <ul className={classes.navContainer}>
                <li className={classes.navbarLink}>Home</li>
                <li className={classes.navbarLink}>About</li>
                <li className={classes.navbarLink}>Tech</li>
                <li className={classes.navbarLink}>Showcase</li>
                <li className={classes.navbarLink}>Contact</li>
            </ul>
        </div>
    )
}

export default MainNavigation;