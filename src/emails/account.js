const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'xedriq.dev@gmail.com',
        subject: 'Thanks for signing in!',
        text: `Welcome to Task Manager App, ${name}. We hope this app will help you.`
    })
}

const sendFarewellEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'xedriq.dev@gmail.com',
        subject: 'Sorry to see you go...',
        text: `Sorry to see you go, ${name}. Please let us know what can we do to keep you.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
}