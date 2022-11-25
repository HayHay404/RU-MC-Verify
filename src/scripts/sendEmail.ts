import nodeMailer from "nodemailer";
import { config } from "dotenv";
import isValidnetID from "./isValidNetID";
import { generateCode } from "./generateCode";
import { db } from "..";
config();

export async function sendEmail(discordId : string, netID: string) {
    if (!isValidnetID(netID)) {
        throw new Error("Not a valid NetID");
    }
    
    const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_USERNAME } = process.env;
    let sendEmail;
    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
        sendEmail = await nodeMailer.createTestAccount();
    } else {
        sendEmail = {
            smtp: {
                host: EMAIL_HOST,
            },
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    }

    const transporter = nodeMailer.createTransport({
        host: sendEmail.smtp.host,
        port: 587,
        auth: {
            user: sendEmail.user,
            pass: sendEmail.pass
        }
    });

    const code = generateCode();

    await transporter.sendMail({
        to: `${netID}@scarletmail.rutgers.edu`,
        subject: "Welcome! Here's your verification code!",
        html: `Your verification code is: ${code}`
    })

    db.user.update({
        data: {
            code,
            progress: "IN_PROGRESS",
            netid: netID,
        },
        where: {discordId}
    });   
}
