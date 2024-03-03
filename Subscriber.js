var Subscriber = function (session) {
    'use strict';
    var subscriber = {};
    subscriber.session = session;

    // Logger
    subscriber.log = function (line) {
        subscriber.session.log(line);
    };

    // Subscribes to topic on Solace PubSub+ Event Broker
    subscriber.subscribe = function (topic) {
        if (subscriber.session.session !== null) {
            subscriber.log('Subscribing to topic: ' + topic);
            try {
                subscriber.session.session.subscribe(
                    solace.SolclientFactory.createTopicDestination(topic),
                    true, // generate confirmation when subscription is added successfully
                    subscriber.topic, // use topic name as correlation key
                    10000 // 10 seconds timeout for this operation
                );
            } catch (error) {
                subscriber.log(error.toString());
            }
        } else {
            subscriber.log('Cannot subscribe because not connected to Solace PubSub+ Event Broker.');
        }
    };

    // Unsubscribes from topic on Solace PubSub+ Event Broker
    subscriber.unsubscribe = function (topic) {
        if (subscriber.session.session !== null) {
            subscriber.log('Unsubscribing from topic: ' + topic);
            try {
                subscriber.session.session.unsubscribe(
                    solace.SolclientFactory.createTopicDestination(topic),
                    true, // generate confirmation when subscription is removed successfully
                    subscriber.topic, // use topic name as correlation key
                    10000 // 10 seconds timeout for this operation
                );
            } catch (error) {
                subscriber.log(error.toString());
            }

            subscriber.log('Cannot unsubscribe because not subscribed to the topic "'
                + topic + '"');
        } else {
            subscriber.log('Cannot unsubscribe because not connected to Solace PubSub+ Event Broker.');
        }
    };

    subscriber.onMessage = function (fn) {
        subscriber.session.session.on(solace.SessionEventCode.MESSAGE, fn);
    }

    return subscriber;
};