import { Service } from 'typedi';
import nodemailer from 'nodemailer';
import pino, { Logger } from 'pino';

import config from '../config';
import { Auth } from '../modules/auth/auth.entity';
import { User } from '../modules/user/user.entity';
import { twoStepHTML } from './mail.template';

@Service()
export class MailService {
  private transporter: nodemailer.Transporter;
  private log: Logger;
  constructor() {
    this.transporter = nodemailer.createTransport(
      `smtps://${config.email}%40gmail.com:${config.pass}@smtp.gmail.com`,
    );
    this.log = pino();
  }

  sendMail(to: string, subject: string, content: string): void {
    const options = {
      from: `Rewise ${config.email}@gmail.com`,
      to,
      subject,
      html: content,
    };

    try {
      this.transporter.sendMail(options, (err, info) => {
        if (err) {
          this.log.error(err);
        }
        this.log.info(info);
      });
    } catch (err) {
      this.log.error(err);
    }
  }

  emailConfirm(user: User): void {
    const content = `Your username is: ${user.username}

Visit this link to verify your email address [Valid for 2d only]:

${user.activationKey}

Please do not reply to this notification, this inbox is not monitored.

If you are having a problem with your account, please email ${config.email}@gmail.com

If you did not create this account click this link:

${user.activationKey}

Thanks for choosing Rewise!`;

    this.sendMail(user.email, 'Verify your email address', content);
  }

  emailChange(to: string, user: User, key: string): void {
    const content = `Hello, ${user.username}

You requested for a change in email from ${user.email}.

Visit this link to verify your new email address [Valid for 2d only]:

${key}

Please do not reply to this notification, this inbox is not monitored.

If you are having a problem with your account, please email ${config.email}@gmail.com

If you did not make this request, please disregard this email. Email won't be accepted without verification.

Kind regards,

Rewise Support`;

    this.sendMail(to, 'Email change confirmation', content);
  }

  twoStepAuth(auth: Auth) {
    this.sendMail(
      auth.email,
      'Rewise Login Verification Code',
      twoStepHTML(auth.twoStepKey.toString()),
    );
  }

  twoStepUser(user: User) {
    this.sendMail(
      user.email,
      'Rewise Login Verification Code',
      twoStepHTML(user.twoStepKey.toString()),
    );
  }
}
