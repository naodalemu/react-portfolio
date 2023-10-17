import MainNavigation from "../UI/MainNavigation";
import Hero from "../sections/Hero";
import classes from "./Layout.module.css"

function Layout() {
    return (
        <div className={classes.mainLayout}>
            <MainNavigation />
            <Hero />
        </div>
    )
}

export default Layout;