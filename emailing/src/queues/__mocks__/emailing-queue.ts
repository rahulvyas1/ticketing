import { EmailDoc, EmailAttrs } from "../../models/email"

const emailingQueue = {
    add: async (email: EmailDoc | EmailAttrs) => {
        console.log('added email: ', email.address)
    }
}

export { emailingQueue }