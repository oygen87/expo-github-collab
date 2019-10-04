import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  YellowBox,
  StyleSheet
} from "react-native";
import socketIOClient from "socket.io-client";
import Message from "../components/Message";
import SendMessage from "../components/SendMessage";

export default function ChatScreen({ navigation }) {
  const username = navigation.getParam("username");
  const repo = navigation.getParam("repo");
  const scrollViewRef = useRef(null);
  const socket = socketIOClient("https://githubcollabapp.herokuapp.com");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  YellowBox.ignoreWarnings([
    "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
  ]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://githubcollabapp.herokuapp.com/messages/`, {
      method: "POST",
      body: JSON.stringify({ repo }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        res.json().then(r => {
          setMessages(r.data);
        });
      })
      .catch()
      .finally(() => setIsLoading(false));
  }, [repo]);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd();
  }, [messages]);

  useEffect(() => {
    socket.on(`serverMessageEvent:${repo}`, data => {
      setMessages(data);
    });
  }, [messages, socket, repo]);

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        {isLoading && <ActivityIndicator />}
        {messages.map(m => (
          <Message key={m._id} username={m.username} message={m.message} />
        ))}
      </ScrollView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
        <SendMessage repo={repo} username={username}/>
      </KeyboardAvoidingView>
    </View>
  );
}

ChatScreen.navigationOptions = {
  title: "Chat"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff"
  },
  message: {
    lineHeight: 50,
    fontSize: 50
  },
  sendMessageContainer: {
    flexDirection: "row"
  },
  input: {
    width: "70%",
    fontSize: 20,
    paddingTop: 20
  },
  send: {
    backgroundColor: "#FFF",
    padding: 10,
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  }
});
