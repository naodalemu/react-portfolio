import MainNavigation from "../UI/MainNavigation";
import About from "../sections/About";
import Hero from "../sections/Hero";
import classes from "./Layout.module.css"

function Layout() {
    return (
        <div className={classes.mainLayout}>
            <MainNavigation />
            <Hero />
            <About />
        </div>
    )
}

export default Layout;