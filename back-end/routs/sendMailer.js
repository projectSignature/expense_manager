const nodemailer = require('nodemailer');

const SMTP_CONFIG = require('./config/smtp');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: SMTP_CONFIG.auth.user,
        pass: SMTP_CONFIG.auth.pass

    },
    tls: {
        rejectUnauthorized: false,
    }
});

module.exports = async function mailer() {

    //variaveis do corpo de envio do email com variação de idiomas para o novo aluno


    const mailSentPT = await transporter.sendMail({
        from: '"kledisom" <devkledisom@gmail.com>',
        to: ['kedinhofavorito@gmail.com', 'kledison2009@hotmail.com'],
        subject: 'Seja bem vindo!',
        text: `Olá tudo bem? Segue em anexo sua ficha de inscrição`,
        /*       attachments: [
                  {
                      path: path
                  }
              ] */
    });
    return mailSentPT
    //---------------------------------------------------------------------------------->

};







