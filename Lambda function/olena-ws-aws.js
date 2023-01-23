const AWS = require('aws-sdk')
const ENDPOINT = '9272aqtaqk.execute-api.us-east-1.amazonaws.com/production'
const client = new AWS.ApiGatewayManagementApi({endpoint : ENDPOINT});
const names = {};

let allconnection = [];

const sendToOne = async (id , body) => {
    try {
        await client.postToConnection({
            'ConnectionId' : id,
            'Data' : Buffer.from(JSON.stringify(body))
        }).promise();
    } catch (e) {
        console.log(e)
    }
}

const sendToAll = async (ids , body) => {
    const all = ids.map(i => sendToOne(i, body));
    return Promise.all(all);
}

exports.handler = async (event) => {
    if(event.requestContext){
        console.log(event)
        
        const route = event.requestContext.routeKey
        const connectionId = event.requestContext.connectionId
        let body = {};
        try {
            if(event.body){
                body = JSON.parse(event.body);
            }
        } catch (e) {}
        switch(route){
            case '$connect':
                console.log('Connection occured')
                allconnection.push(connectionId)
                // code
                break;
            case '$disconnect':
                console.log('Disconnection occured')
                await sendToAll(Object.keys(names), {systemMessage: `${names[connectionId]} has left the chat`})
                delete names[connectionId];
                //await sendToAll(Object.keys(names), {members : Object.values(names)});
                // code
                break;
            case 'setname' : 
                console.log('new member joined')
                names[connectionId] = body.name;
                // await sendToAll(Object.keys(names), {members : Object.values(names)});
                await sendToAll(Object.keys(names), {systemMessage: `${names[connectionId]} has joined the chat`})
                break;
            case 'sendmessage' :
                console.log('Message received', event)
                // const connections = await getAllConnections()
                // await sendToAll([connectionId] , allconnection);
                await sendToAll(Object.keys(names) , {publicMessage : `${names[connectionId]} - ${body.message}`});
                break;
            case 'startbubble':
                console.log('User click the heart')
                await sendToAll(Object.keys(names) , {bubbleMessage : ``});
                // code
                break;
            default : 
                console.log('Unknown route' , route)
                break;
            
        };
    }
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
}
