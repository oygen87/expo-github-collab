import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { KeyboardAvoidingView } from "react-native";
import socketIOClient from "socket.io-client";
import { YellowBox } from "react-native";

import Message from "../components/Message";

export default function ChatScreen({ navigation }) {
  const username = navigation.getParam("username");
  const repo = navigation.getParam("repo");
  const scrollViewRef = useRef(null);
  const socket = socketIOClient("https://githubcollabapp.herokuapp.com");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
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
  }, [messages, socket]);

  const handleSubmit = () => {
    socket.emit("clientMessageEvent", {
      repo,
      message,
      username
    });
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        {isLoading && <ActivityIndicator />}
        {messages.map(m => (
          <Message key={m._id} username={m.username} message={m.message} />
        ))}
      </ScrollView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
        <View style={styles.sendMessageContainer}>
          <TextInput
            placeholder="Say hi..."
            multiline={true}
            style={styles.input}
            value={message}
            onChangeText={text => setMessage(text)}
          />
          <TouchableOpacity style={styles.send} onPress={handleSubmit}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  }
});
