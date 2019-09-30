import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Alert
} from "react-native";

import { RepoContext } from "../Context/RepoContext";
import { AuthContext } from "../Context/AuthContext";
import { useFocusState } from "react-navigation-hooks";

export default function HomeScreen(props) {
  const [username, setUsername] = useState("");
  const [repo, setRepo] = useState("");
  const [isBtnDisabled, setBtnDisabled] = useState(false);

  const [_, setContextRepository] = useContext(RepoContext);
  const [__, setIsLoggedIn] = useContext(AuthContext);

  const { navigate } = props.navigation;

  const focusState = useFocusState();

  useEffect(() => {
    if (focusState.isFocused || focusState.isFocusing) {
      setIsLoggedIn(false);
    }
  }, [focusState]);

  const handleOnPress = () => {
    const checkRepoIsValid = async () => {
      try {
        const res = await fetch(
          `https://githubcollabapp.herokuapp.com/github-events/`,
          {
            method: "POST",
            body: JSON.stringify({ repo }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        if (!res.ok) {
          throw new Error("Repository not found");
        }
      } catch (err) {
        throw new Error(err.message);
      }
    };
    setBtnDisabled(true);
    checkRepoIsValid()
      .then(() => {
        setContextRepository(repo);
        setIsLoggedIn(true);
        navigate("Chat", { username, repo });
      })
      .catch(e => Alert.alert(e.message))
      .finally(() => setBtnDisabled(false));
  };

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
        disabled={
          username.trim().length === 0 ||
          repo.trim().length === 0 ||
          isBtnDisabled
        }
        onPress={handleOnPress}
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
