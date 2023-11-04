import classes from "./SuccessfulAndFailed.module.css"

function SuccessfulEmail() {
    return (
        <div className={classes.messageContainer}>
            <div className={classes.message}>Successfully Sent</div>
        </div>
    )
}

export default SuccessfulEmail;