import classes from "./Contact.module.css"

function Contact() {
    return (
        <div className={classes.contactSection}>
            <div id="contact" className={classes.contactMargin}></div>
            <h1 className={classes.contactSectionName}>Contact Me</h1>
            <form className={classes.contactContainer}>
                <div className={classes.firstContactInfo}>
                    <div className={classes.nameContainer}>
                        <label htmlFor="senderName" className={classes.senderNameLabel}>Full Name</label>
                        <input type="text" id="senderName" className={`${classes.senderName} ${classes.contactInput}`} name="senderName" />
                    </div>
                    <div className={classes.emailContainer}>
                        <label htmlFor="senderEmail" className={classes.senderEmailLabel}>Email Address</label>
                        <input type="email" id="senderEmail" className={`${classes.senderEmail} ${classes.contactInput}`} name="senderEmail" />
                    </div>
                    <div className={classes.subjectContainer}>
                        <label htmlFor="messageSubject" className={classes.messageSubjectLabel}>Subject</label>
                        <input type="text" id="messageSubject" className={`${classes.messageSubject} ${classes.contactInput}`} name="messageSubject" />
                    </div>
                </div>
                <div className={classes.lastContactInfo}>
                    <textarea id="contactMessage" className={classes.contactMessage} name="contactMessage" placeholder="Write your message here..."></textarea>
                    <button className={classes.contactButton}>Send</button>
                </div>
            </form>
        </div>
    )
}

export default Contact;