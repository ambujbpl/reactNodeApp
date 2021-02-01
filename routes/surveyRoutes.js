const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

// const Mailer = require('../services/Mailer');
const sgMail = require("@sendgrid/mail");
const keys = require('../config/keys');
sgMail.setApiKey(keys.sendGridKey);

const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = (app) => {

  app.get('/api/surveys', requireLogin , async (req, res) => {
    const data = await Survey.find({_user:req.user.id})
      .select({recipients: 0, _user:0})
      .sort({'dateSent': -1})
      .limit(10);
    res.send(data);
  });

  app.post('/api/deleteSurvey', requireLogin, async (req, res) => {
    Survey.deleteMany({_id: req.body.id}, function (err) {
      if (err) {
        console.log(err);
        res.send({response:false,err});
      } else {
        res.send({response:true,'id': req.body.id});
      }
    });
  });

  app.get('/api/surveys/:surveyId/:email/:choice', async (req, res) => {
    console.log(req.params);
    const {surveyId , email, choice} = req.params;
    const result = await Survey.updateOne(
      {
        _id: surveyId,
        recipients: {
          $elemMatch: { email: email, responded: false },
        },
      },
      {
        $inc: { [choice]: 1 },
        $set: { 'recipients.$.responded': true },
        lastResponded: new Date(),
      }
    ).exec();
    console.log('result : ',result);
    if(result.n === 1) {
      res.send('Thanks for your voting!');
    } else {
      res.send('Sorry, You have already done your voting!');
    }
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:email/:choice');
    console.log('req body : ',req.body);
    _.chain(req.body)
      .map(({ email, url, event }) => {
        if((!url || event.trim().toLowerCase() !== 'click')){ 
          console.log(email, url, event);          
          return 
        }
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date(),
          }
        ).exec();
      })
      .value();
    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    console.log(req.body);
    const reci = recipients
        .split(',')
        .map((email) => ({ email: email.trim() }))
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: reci,
      _user: req.user.id,
      dateSent: Date.now(),
    });
    // Great place to send an email!
    // const mailer = new Mailer(survey, surveyTemplate(survey));
    
    // reci.forEach(email => {
    for (var i = 0; i < reci.length; i++) {
      let msg = {
        to: reci[i].email,
        from: "ambuj.ideata@gmail.com",
        subject: subject,
        // text: "and easy to do anywhere, even with Node.js",
        html: surveyTemplate(survey,reci[i].email),
      };
      await sgMail.send(msg);
    }
      
    // })
    try {
      // await mailer.send();
      // await sgMail.send(msg);
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
