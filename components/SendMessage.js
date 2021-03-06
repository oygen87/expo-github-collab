import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  YellowBox
} from "react-native";
import socketIOClient from "socket.io-client";
import { Ionicons } from "@expo/vector-icons";

export default function({repo, username}) {
  const socket = socketIOClient("https://githubcollabapp.herokuapp.com");
  const [message, setMessage] = useState("");

  YellowBox.ignoreWarnings([
    "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
  ]);

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
