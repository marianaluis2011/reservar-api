import nodemailer from "nodemailer";
import {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
} from "../config/env.js";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

function renderTemplate(templateName, data) {
    const filePath = path.join(
        process.cwd(),
        "src",
        "templates",
        `${templateName}.hbs`
    );
    const source = fs.readFileSync(filePath, "utf-8");
    const template = Handlebars.compile(source);
    return template(data);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("es-AR");
}

async function verifyEmailConnection() {
    return transporter.verify();
}

async function sendTestEmail() {
    const info = await transporter.sendMail({
        from: `"ReservaHost" <${SMTP_USER}>`,
        to: SMTP_USER,
        subject: "ReservaHost SMTP test",
        html: "<h1>SMTP funcionando correctamente</h1><p>Este es un email de prueba.</p>",
    });
    return {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
    };
}

async function sendRegisterEmail(to, name) {
    const html = renderTemplate("register", {
        name,
    });
    const info = await transporter.sendMail({
        from: `"ReservaHost" <${SMTP_USER}>`,
        to,
        subject: "Bienvenido a ReservaHost",
        text: "Tu cuenta fue creada correctamente.",
        html,
    });
    return {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
    };
}

async function sendBookingConfirmationEmail(booking) {
    const html = renderTemplate("bookingConfirmation", {
        fullName: booking.user.fullName,
        accommodationName: booking.accommodation.name,
        roomName: booking.room.name,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        totalPrice: booking.totalPrice,
        status: booking.status,
    });

    const info = await transporter.sendMail({
        from: `"ReservaHost" <${SMTP_USER}>`,
        to: booking.user.email,
        subject: "Reserva creada en ReservaHost",
        text: "Tu reserva fue registrada correctamente.",
        html,
    });

    return {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
    };
}

export {
    transporter,
    verifyEmailConnection,
    sendTestEmail,
    sendRegisterEmail,
    sendBookingConfirmationEmail,
    renderTemplate,
};