import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useFocusState } from "react-navigation-hooks";

import socketIOClient from "socket.io-client";

import Message from "../components/Message";

export default function ChatScreen({ navigation }) {
  const username = navigation.getParam("username");
  const repo = navigation.getParam("repo");
  const scrollViewRef = useRef(null);
  const socket = socketIOClient("https://githubcollabapp.herokuapp.com");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const focus = useFocusState();

  useEffect(() => {
    fetch(`https://githubcollabapp.herokuapp.com/messages/`, {
      method: "POST",
      body: JSON.stringify({ repo }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        res.json().then(r => {
          //console.log(JSON.stringify(r));
          setMessages(r.data);
        });
      })
      .catch();
  }, [repo]);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    socket.on(`serverMessageEvent:${repo}`, data => {
      setMessages(data);
    });
  }, [messages, socket]);

  /*useEffect(() => {
      console.log(focus);
      console.log(navigation);
    }, [focus])*/

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
        {messages.map(m => (
          <Message key={m._id} username={m.username} message={m.message} />
        ))}
      </ScrollView>
      <View style={styles.sendMessageContainer}>
        <TextInput
          placeholder="Say hi..."
          style={styles.input}
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity style={styles.send} onPress={handleSubmit}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
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
  sendMessageContainer : {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  input: {
    flexGrow: 6,
    fontSize: 20
  },
  send: {
    backgroundColor: "#DDDDDD",
    padding: 20,
  }
});
