import classes from "./Contact.module.css"

function Contact() {
    return (
        <div className={classes.contactSection}>
            <div id="contact" className={classes.contactMargin}></div>
            <h1>Contact Me</h1>
            <div className={classes.contactContainer}></div>
        </div>
    )
}

export default Contact;