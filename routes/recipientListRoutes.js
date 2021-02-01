const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const RecipientsList = mongoose.model('recipientList');

module.exports = (app) => {

  app.get('/api/recipientList', requireLogin , async (req, res) => {
    const data = await RecipientsList.find({_user:req.user.id})
      // .select({recipients: 0, _user:0})
      .sort({'createdDate': -1})
      .limit(10);
    res.send(data);
  });

  app.post('/api/deleteRecipient', requireLogin, async (req, res) => {
    RecipientsList.deleteMany({_id: req.body.id}, function (err) {
      if (err) {
        console.log(err);
        res.send({response:false,err});
      } else {
        res.send({response:true,'id': req.body.id});
      }
    });
  });

  app.post('/api/newRecipient', requireLogin , async (req, res) => {
    const { emailList, recipientName } = req.body;
    const recipient = new RecipientsList({
      emailList,
      recipientName,
      _user: req.user.id,
      createdDate: Date.now()
    })
    try {
      const data = await recipient.save();
      res.send(data);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};