var express = require('express');
var app = express();

/* Sample Tickets */
var tickets = {
    "tickets": [
        {
            "id": 01,
            "created_at": "2023-04-01T22:55:29Z",
            "subject": "MFP not working right",
            "priority": "med",
            "status": "open",
            "recipient": "support_example@selu.edu",
            "submitter": "Michael_bolton@selu.edu",
            "assignee_id": 12345
        },
        {
            "id": 02,
            "created_at": "2023-03-20T22:55:29Z",
            "subject": "Computer not turning on",
            "priority": "high",
            "status": "closed",
            "recipient": "support_example@selu.edu",
            "submitter": "jane_doe@selu.edu",
            "assignee_id": 12345
        },
        {
            "id": 03,
            "created_at": "2023-04-01T22:55:29Z",
            "subject": "Computer won't connect to wifi",
            "priority": "low",
            "status": "open",
            "recipient": "support_example@selu.edu",
            "submitter": "john_doe@selu.edu",
            "assignee_id": 67891
        }   
    ]
}

/* Find By Id */
function findId(data, id){
    for(var i = 0; i < data.length; i++){
        if(data[i].id == id){
            return data[i]
        }
    }
    return `Ticket ${id} Does Not Exist`
}

/* Create & Read */
app.post('/rest/ticket/', function(req, res){
    res.send("Endpoint to create a new ticket")
});

app.get('/rest/list/', function(req, res) {
    res.json(tickets)
});

app.get('/rest/ticket/:id', function(req, res){
    res.json(findId(tickets['tickets'], req.params.id))
});

app.listen(3000);