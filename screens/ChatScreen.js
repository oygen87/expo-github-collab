import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusState } from "react-navigation-hooks";

import socketIOClient from "socket.io-client";

export default function ChatScreen({navigation}) {
  const username = navigation.getParam('username');
  const repo = navigation.getParam('repo');
  const scrollViewRef = useRef(null);
  const socket = socketIOClient("https://githubcollabapp.herokuapp.com");
  const [messages, setMessages] = useState([]);
  const focus = useFocusState();

    useEffect(() => {
      fetch(`https://githubcollabapp.herokuapp.com/messages/`, {
        method: 'POST',
        body: JSON.stringify({repo}), 
        headers: {
          'Content-Type': 'application/json',
        }
        })
        .then(res => {
          res.json().then(r => {
            console.log(JSON.stringify(r));
            setMessages(r.data);
          });
        })
        .catch();
    }, [repo]);

    useEffect(() => {
      scrollViewRef.current.scrollToEnd({animated : true});
    }, [messages])

    useEffect(() => {
      socket.on(`serverMessageEvent:${repo}`, data => {
        setMessages(data);
      });
    }, [messages, socket]);

    useEffect(() => {
      console.log(focus);
      console.log(navigation);
    }, [focus])
  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
      {messages.map((m) => <Text style={styles.message} key={m._id}>{m.username} : {m.message}</Text>)}
      </ScrollView>
    </View>
  );
}

ChatScreen.navigationOptions = {
  title: 'Chat',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  message: {
    lineHeight: 50,
    fontSize: 50,
  }
});
