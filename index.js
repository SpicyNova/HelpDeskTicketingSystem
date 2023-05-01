var express = require('express');
var js2xmlparser = require("js2xmlparser");
var app = express();
var bodyparser = require('body-parser');
const { MongoClient } = require("mongodb");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
const uri = "mongodb+srv://classuser:yJXu8rpMrJRehw9r@aombd.d87vii9.mongodb.net/?retryWrites=true&w=majority";

function translate(ticket) {
  return js2xmlparser.parse("Ticket", ticket)
};

/* get all tickets */
app.get('/rest/list/', function(req, res) {
    const client = new MongoClient(uri);
    
    async function run() {
      try {
        const database = client.db('aombd');
        const tickets = database.collection('HelpDeskTicketingSystem');

        var ticket = await tickets.find({}).toArray();
        console.log(ticket);
        res.send('Found this: ' + JSON.stringify(ticket));

    
      } finally {
        await client.close();
      }
    }

    run().catch(console.dir);

});

/* get ticket by id JSON */
app.get('/rest/ticket/:id', function(req, res) {
    const client = new MongoClient(uri);
    
    async function run() {
      try {
        const database = client.db('aombd');
        const tickets = database.collection('HelpDeskTicketingSystem');
        
        const ticket = await tickets.findOne({ ticketId: parseInt(req.params.id) });
        res.send(JSON.stringify(ticket));
    
      } finally {
        await client.close();
      }
    }

    run().catch(console.dir);

});

/* get ticket by id XML */
app.get('/rest/xml/ticket/:id', function(req, res) {
  const client = new MongoClient(uri);
  
  async function run() {
    try {
      const database = client.db('aombd');
      const tickets = database.collection('HelpDeskTicketingSystem');

      const ticket = await tickets.findOne({ ticketId: parseInt(req.params.id) });

      var ticketParser = {ticketId: ticket.ticketId,
                          created_at: ticket.created_at,
                          subject: ticket.subject, 
                          priority: ticket.priority, 
                          status: ticket.status,
                          recipient: ticket.recipient,
                          submitter: ticket.submitter,
                          assignee_id: ticket.assignee_id};
      
      res.send(translate(ticketParser));

    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);

});

/* delete a ticket */
app.get('/rest/delete', function(req, res) {
  res.sendFile(__dirname + '/ticketDeleteForm.html');
});
app.post('/rest/ticket/delete', function(req, res) {
  const client = new MongoClient(uri);
  
  async function run() {
    try {
      const database = client.db('aombd');
      const tickets = database.collection('HelpDeskTicketingSystem');
      
      console.log(req.body.ticketId); 
      const deleteTicket = await tickets.findOneAndDelete({ticketId: parseInt(req.body.ticketId)});

      res.send("Ticket Deleted").status(200);
  
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);

});

/* create tickets */
app.get('/rest/post', function(req, res) {
    res.sendFile(__dirname + '/ticketCreationForm.html');
});
app.post('/rest/ticket/post', function(req, res) {
    const client = new MongoClient(uri);
    var ticket = req.body;
    ticket.ticketId = parseInt(ticket.ticketId);

    async function run() {
      try {
        const database = client.db('aombd');
        const tickets = database.collection('HelpDeskTicketingSystem');

        tickets.insertOne(ticket);
        console.log(ticket);
        res.sendStatus(200);
    
      } finally {
        await client.close();
      }
    }

    run().catch(console.dir);

});

/* updating a ticket */
app.get('/rest/put', function(req, res) {
    res.sendFile(__dirname + '/ticketUpdateForm.html');
});
app.post('/rest/ticket/put', function(req, res) {
    const client = new MongoClient(uri);
    
    async function run() {
      try {
        const database = client.db('aombd');
        const tickets = database.collection('HelpDeskTicketingSystem');
        
        const ticketId = parseInt(req.body.ticketId);

        const ticket = {ticketId: parseInt(req.body.ticketId),
                        created_at: req.body.created_at,
                        subject: req.body.subject, 
                        priority: req.body.priority, 
                        status: req.body.status,
                        recipient: req.body.recipient,
                        submitter: req.body.submitter,
                        assignee_id: req.body.assignee_id};

        const updateTicket = await tickets.findOneAndUpdate({ ticketId: ticketId }, { $set: ticket });

        res.send("Ticket Updated").status(200);

      } finally {
        await client.close();
      }
    }

    run().catch(console.dir);

});

app.listen(3000);