import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { Auth } from './auth.entity';
import config from '../../config';
import { MailService } from '../../utils/nodemailer.service';

export default async (app: FastifyInstance) => {
  app.post('/login', async (req, res) => {
    const { id, password } = req.body;
    const auth = await Auth.findOne({
      where: [{ username: id }, { email: id }],
    });

    if (!auth) {
      return res.status(400).send('incorrect credentials');
    }
    if (!(await auth?.comparePass(password))) {
      return res.status(400).send('incorrect credentials');
    }

    let payload;
    let token;
    if (auth?.twoStep) {
      auth.twoStepKey = Math.floor(100000 + Math.random() * 900000);
      await auth.save();

      const mail = new MailService();
      mail.twoStepAuth(auth);

      payload = { id };
      token = jwt.sign(payload, config.authTwoStepJwt, { expiresIn: '2h' });
      return res.status(200).send({ type: 'twoStep', token });
    } else {
      payload = {
        id: auth?.id,
        email: auth?.email,
        twoStep: auth?.twoStep,
        twoStepKey: auth?.twoStepKey,
      };
      token = jwt.sign(payload, config.authLoginJwt, { expiresIn: '4h' });
      return res.status(200).send({ type: 'token', token });
    }
  });

  app.post('/login/twoStep', async (req, res) => {
    const { token: reqToken, key } = req.body;
    const { id }: any = jwt.verify(reqToken, config.authTwoStepJwt);
    const auth = await Auth.findOne({
      where: [{ username: id }, { email: id }],
    });

    if (!auth || !auth?.twoStep) {
      res.status(400).send('invalid request');
    }

    if (auth?.twoStepKey === parseInt(key, 10)) {
      const payload = {
        id: auth?.id,
        email: auth?.email,
        twoStep: auth?.twoStep,
        twoStepKey: auth?.twoStepKey,
      };
      const token = jwt.sign(payload, config.authLoginJwt, { expiresIn: '4h' });
      res.status(200).send({ type: 'token', token });
    } else {
      res.status(400).send('incorrect key');
    }
  });
};
