import classes from "./SuccessfulAndFailed.module.css"

function FailedEmail() {
    return (
        <div className={classes.messageContainer}>
            <div className={classes.message} style={{ color: "firebrick" }}>Failed! Please check your internet connection</div>
        </div>
    )
}

export default FailedEmail;