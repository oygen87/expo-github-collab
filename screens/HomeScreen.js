import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator
} from "react-native";

import { RepoContext } from "../Context/RepoContext";
import { AuthContext } from "../Context/AuthContext";
import { useFocusState } from "react-navigation-hooks";

export default function HomeScreen(props) {
  const [username, setUsername] = useState("");
  const [repo, setRepo] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
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
    setShowSpinner(true);
    checkRepoIsValid()
      .then(() => {
        setContextRepository(repo);
        setIsLoggedIn(true);
        navigate("Chat", { username, repo });
      })
      .catch(e => Alert.alert(e.message))
      .finally(() => setShowSpinner(false));
  };

  const getTextStyle = () => {
    return username.trim().length === 0 ||
      repo.trim().length === 0 ||
      showSpinner
      ? styles.btnTextDisabled
      : styles.btnText;
  };

  const getBtnStyle = () => {
    return username.trim().length === 0 || repo.trim().length === 0
      ? styles.buttonDisabled
      : styles.button;
  };

  const isBtnDisabled = () => {
    return (
      username.trim().length === 0 || repo.trim().length === 0 || showSpinner
    );
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
        style={getBtnStyle()}
        disabled={isBtnDisabled()}
        onPress={handleOnPress}
      >
        {showSpinner ? (
          <ActivityIndicator />
        ) : (
          <Text style={getTextStyle()}>Join Chat</Text>
        )}
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
    marginBottom: 20,
    padding: 10
  },
  repo: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 100
  },
  buttonDisabled: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#EEE",
    padding: 10,
    borderRadius: 100
  },
  btnText: {
    color: "#FFF"
  },
  btnTextDisabled: {
    color: "#AAA"
  }
});
