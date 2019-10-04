import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import socketIOClient from "socket.io-client";
import { Ionicons } from "@expo/vector-icons";

export default function({repo, username}) {
  const socket = socketIOClient("https://githubcollabapp.herokuapp.com");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    socket.emit("clientMessageEvent", {
      repo,
      message,
      username
    });
    setMessage("");
  };

  return (
    <View style={styles.sendMessageContainer}>
      <TextInput
        placeholder="Say hi..."
        multiline={true}
        style={styles.input}
        value={message}
        onChangeText={text => setMessage(text)}
      />
      <TouchableOpacity style={styles.send} onPress={handleSubmit}>
        <Ionicons
          size={26}
          name={Platform.OS === "ios" ? "ios-send" : "md-send"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /*container: {
      flex: 1,
      padding: 15,
      backgroundColor: "#fff"
    },*/
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
