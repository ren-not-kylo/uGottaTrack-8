let Publisher = function (s,t) {
    let publisher = {
        session: s,
        topic: t
    }

    publisher.publish = function (data) {
        if (publisher.session !== null) {
            let message = solace.SolclientFactory.createMessage();
            message.setDestination(solace.SolclientFactory.createTopicDestination(publisher.topic));
            message.setBinaryAttachment(data);
            message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
            try {
                publisher.session.session.send(message);
            } catch (error) {
                console.log(error.toString());
            }
        } else {
            console.log('Cannot publish because not connected to Solace PubSub+ Event Broker.');
        }
    };

    publisher.setTopic = function (t) {
        publisher.topic = t;
    };

    return publisher
};