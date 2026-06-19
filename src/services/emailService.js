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
    try {
        await transporter.verify();
        console.log("Servidor de correo listo para enviar mensajes");
    } catch (error) {
        console.error("Fallo la verificacion del servidor de correo:", error.message);
    }
}

async function sendRegisterEmail(to, name) {
    const html = renderTemplate("register", {
        name,
    });
    const info = await transporter.sendMail({
        from: `"Hospedar" <${SMTP_USER}>`,
        to,
        subject: "Bienvenido a Hospedar",
        text: "Tu cuenta fue creada correctamente.",
        html,
    });
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

async function sendBookingCreatedEmail(booking) {
    const html = renderTemplate("bookingCreated", {
        fullName: booking.user.fullName,
        accommodationName: booking.accommodation.name,
        roomName: booking.room.name,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        totalPrice: booking.totalPrice,
        status: booking.status,
    });
    const info = await transporter.sendMail({
        from: `"Hospedar" <${SMTP_USER}>`,
        to: booking.user.email,
        subject: "Reserva creada en Hospedar",
        text: "Tu reserva fue registrada correctamente.",
        html,
    });
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

async function sendBookingCancelledEmail(booking) {
    const html = renderTemplate("bookingCancelled", {
        fullName: booking.user.fullName,
        accommodationName: booking.accommodation.name,
        roomName: booking.room.name,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        totalPrice: booking.totalPrice,
        status: booking.status,
    });
    const info = await transporter.sendMail({
        from: `"Hospedar" <${SMTP_USER}>`,
        to: booking.user.email,
        subject: "Reserva cancelada en Hospedar",
        text: "Tu reserva fue cancelada correctamente.",
        html,
    });
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

async function sendBookingConfirmedEmail(booking) {
    const html = renderTemplate("bookingConfirmed", {
        fullName: booking.user.fullName,
        accommodationName: booking.accommodation.name,
        roomName: booking.room.name,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        totalPrice: booking.totalPrice,
        status: booking.status,
    });
    const info = await transporter.sendMail({
        from: `"Hospedar" <${SMTP_USER}>`,
        to: booking.user.email,
        subject: "Tu reserva fue confirmada en Hospedar",
        text: "Tu reserva fue confirmada.",
        html,
    });
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

async function sendAccommodationApprovedEmail(accommodation) {
    const html = renderTemplate("accommodationApproved", {
        fullName: accommodation.admin?.fullName,
        accommodationName: accommodation.name,
    });
    const info = await transporter.sendMail({
        from: `"Hospedar" <${SMTP_USER}>`,
        to: accommodation.admin?.email,
        subject: "Tu hospedaje fue aprobado en Hospedar",
        text: "Tu hospedaje fue aprobado.",
        html,
    });
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

export {
    transporter,
    renderTemplate,
    verifyEmailConnection,
    sendRegisterEmail,
    sendBookingCreatedEmail,
    sendBookingCancelledEmail,
    sendBookingConfirmedEmail,
    sendAccommodationApprovedEmail,
}