let SolaceSession = function () {
    let session = {}
    session.session = null;

    session.log = function (line) {
        var now = new Date();
        var time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        var timestamp = '[' + time.join(':') + '] ';
        console.log(timestamp + line);
        // var logTextArea = document.getElementById('log');
        // logTextArea.value += timestamp + line + '\n';
        // logTextArea.scrollTop = logTextArea.scrollHeight;
    }

    session.connect = function () {
        if (session.session !== null) {
            session.log('Already connected and ready to subscribe.');
            return;
        }

        try {
            let factoryProps = new solace.SolclientFactoryProperties();
            factoryProps.profile = solace.SolclientFactoryProfiles.version10;
            solace.SolclientFactory.init(factoryProps); 
            solace.SolclientFactory.setLogLevel(solace.LogLevel.DEBUG);
            session.session = solace.SolclientFactory.createSession({
                url: "wss://mr-connection-bcsw6c3mi2o.messaging.solace.cloud:443",
                vpnName: "ugottatrack",
                userName: "solace-cloud-client",
                password: "tf8b0c0j0ilfvkbojsatvbjdk6"
            });
        } catch (error) {
            session.log(error.toString())
        }

        // define session event listeners
        session.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            session.log('=== Successfully connected and ready to subscribe. ===');
        });
        session.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
            session.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });
        session.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
            session.log('Disconnected.');
            session.subscribed = false;
            if (session.session !== null) {
                session.session.dispose();
                session.session = null;
            }
        });

        // define message event listener
        session.session.on(solace.SessionEventCode.MESSAGE, function (message) {
            session.log('Received message: "' + message.getBinaryAttachment() + '", details:\n' +
                message.dump());
        });
       session.connectToSolace();
    }

    session.connectToSolace = function () {
        try {
            session.session.connect();
        } catch (error) {
            session.log(error.toString());
        }
    }

    session.disconnect = function () {
        session.log('Disconnecting from Solace PubSub+ Event Broker...');
        if (session.session !== null) {
            try {
                session.session.disconnect();
            } catch (error) {
                session.log(error.toString());
            }
        } else {
            session.log('Not connected to Solace PubSub+ Event Broker.');
        }
    }

    return session;
}