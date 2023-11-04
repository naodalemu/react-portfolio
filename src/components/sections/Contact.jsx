import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from "framer-motion";
import classes from "./Contact.module.css"
import FailedEmail from '../UI/FailedEmail';
import SuccessfulEmail from '../UI/SuccessfulEmail';

function Contact() {
    const form = useRef();
    const senderNameRef = useRef()
    const senderEmailRef = useRef()
    const messageSubjectRef = useRef()
    const contactMessageRef = useRef()
    const [ successModal, setSuccessModal ] = useState(false);
    const [ FailedModal, setFailedModal ] = useState(false);
    const [ loading, setLoading ] = useState(false)

    const sendEmail = (e) => {
        e.preventDefault();

        setSuccessModal(false)
        setFailedModal(false)
        setLoading(true)
        emailjs.sendForm('service_3z9vgtc', 'template_6l7ma3f', form.current, 'ai0ySokHar3c5tE5p')
        .then((result) => {
            setLoading(false)
            console.log(result.text);
            senderNameRef.current.value = "";
            senderEmailRef.current.value = "";
            messageSubjectRef.current.value = "";
            contactMessageRef.current.value = "";
            setSuccessModal(true)
            setFailedModal(false)
            setTimeout(() => {
                setSuccessModal(false);
            }, 3000);
        }, (error) => {
            setLoading(false)
            console.log(error.text);
            setFailedModal(true)
            setSuccessModal(false)
            setTimeout(() => {
                setFailedModal(false);
            }, 3000);
        });
    };

    return (
        <div className={classes.contactSection}>
            <div id="contact" className={classes.contactMargin}></div>
            <h1 className={classes.contactSectionName}>Contact Me</h1>
            <motion.form ref={form} className={classes.contactContainer} onSubmit={sendEmail} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div className={classes.firstContactInfo}>
                    <div className={classes.nameContainer}>
                        <label htmlFor="senderName" className={classes.senderNameLabel}>Full Name</label>
                        <input type="text" id="senderName" ref={senderNameRef} className={`${classes.senderName} ${classes.contactInput}`} name="senderName" placeholder="Jane Doe" required />
                    </div>
                    <div className={classes.emailContainer}>
                        <label htmlFor="senderEmail" className={classes.senderEmailLabel}>Email Address</label>
                        <input type="email" id="senderEmail" ref={senderEmailRef} className={`${classes.senderEmail} ${classes.contactInput}`} name="senderEmail" placeholder="example12@gmail.com" required />
                    </div>
                    <div className={classes.subjectContainer}>
                        <label htmlFor="messageSubject" className={classes.messageSubjectLabel}>Subject (optional)</label>
                        <input type="text" id="messageSubject" ref={messageSubjectRef} className={`${classes.messageSubject} ${classes.contactInput}`} name="messageSubject" placeholder="To talk about a job I have" />
                    </div>
                </div>
                <div className={classes.lastContactInfo}>
                    <textarea id="contactMessage" ref={contactMessageRef} className={classes.contactMessage} name="contactMessage" placeholder="Write your message here..." required></textarea>
                    <button className={classes.contactButton} type="submit">Send</button>
                </div>
            </motion.form>
            {loading ? <div className={classes.messageContainer}><div className={classes.message}>Sending...</div></div> : null}
            {successModal ? <SuccessfulEmail /> : null}
            {FailedModal ? <FailedEmail /> : null}
        </div>
    )
}

export default Contact;