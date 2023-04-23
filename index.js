var express = require('express');
var app = express();
var bodyparser = require('body-parser');
const { MongoClient } = require("mongodb");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
const uri = "mongodb+srv://classuser:yJXu8rpMrJRehw9r@aombd.d87vii9.mongodb.net/?retryWrites=true&w=majority";

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

/* get ticket by id */
app.get('/rest/ticket/:id', function(req, res) {
    const client = new MongoClient(uri);
    const searchKey = "{ id: '" + req.params.id + "' }";
    console.log("Looking for: " + searchKey);
    
    async function run() {
      try {
        const database = client.db('aombd');
        const tickets = database.collection('HelpDeskTicketingSystem');
        const query = { ticketId: parseInt(req.params.id) };
        
        const ticket = await tickets.findOne(query);
        console.log(ticket);
        res.send('Found this: ' + JSON.stringify(ticket));
    
      } finally {
        await client.close();
      }
    }

    run().catch(console.dir);

});

/* create tickets */
app.get('/rest/', function(req, res) {
    res.sendFile(__dirname + '/ticketCreationForm.html');
});
app.post('/rest/ticket/', function(req, res) {
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
app.get('/rest/update', function(req, res) {
    res.sendFile(__dirname + '/ticketUpdateForm.html');
});
app.put('/rest/ticket/:id', function(req, res) {
    const client = new MongoClient(uri);
    
    async function run() {
      try {
        const database = client.db('aombd');
        const tickets = database.collection('HelpDeskTicketingSystem');

        const query = { ticketId: parseInt(req.params.id) };
        console.log(req.params.id)

        const newValues = { $set: { subject: req.body.subject, 
                                    priority: req.body.priority, 
                                    status: req.body.status,
                                    assignee_id: req.body.assignee_id } };
        
        tickets.updateOne(query, newValues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });

        console.log(newValues);
        res.send(JSON.stringify(tickets.findOne(query)));
    
      } finally {
        await client.close();
      }
    }

    run().catch(console.dir);

});

/* delete a ticket */
app.delete('/rest/ticket/:id', function(req, res) {
    const client = new MongoClient(uri);
    
    async function run() {
      try {
        const database = client.db('aombd');
        const tickets = database.collection('HelpDeskTicketingSystem');
        
        await tickets.deleteOne({ticketId: parseInt(req.params.id)});

        res.send("Ticket Deleted");
    
      } finally {
        await client.close();
      }
    }

    run().catch(console.dir);

});

app.listen(3000);