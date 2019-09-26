import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View
} from "react-native";

export default function HomeScreen(props) {
  const [username, setUsername] = useState("");
  const [repo, setRepo] = useState("");

  const { navigate } = props.navigation;

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={text => setUsername(text)}
        style={styles.username}
        placeholder="chat username"
        value={username}
      />
      <TextInput
        onChangeText={text => setRepo(text)}
        style={styles.repo}
        placeholder="https://github.com/user/repo"
        value={repo}
      />
      <TouchableOpacity
        style={styles.button}
        disabled={username.trim().length === 0 || repo.trim().length === 0}
        onPress={() => navigate("Chat", { username, repo })}
      >
        <Text>Join chat</Text>
      </TouchableOpacity>
    </View>
  );
}

HomeScreen.navigationOptions = {
  title: "Github Collab"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff"
  },
  username: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20
  },
  repo: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});
