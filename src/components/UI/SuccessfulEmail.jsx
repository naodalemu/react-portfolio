import classes from "./SuccessfulAndFailed.module.css"

function SuccessfulEmail() {
    return (
        <div className={classes.messageContainer}>
            <div className={classes.message} style={{ color: "green" }}>Successfully Sent</div>
        </div>
    )
}

export default SuccessfulEmail;