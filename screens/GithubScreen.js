import React, { useState, useContext, useEffect } from "react";
import { ScrollView, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { RepoContext } from "../Context/RepoContext";
import { AuthContext } from "../Context/AuthContext";
import Event from "../components/Event";

export default function GithubScreen() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [repo, _] = useContext(RepoContext);
  const [isLoggedIn, __] = useContext(AuthContext);

  const fetchData = async () => {
    let res;
    try {
      res = await fetch(
        `https://githubcollabapp.herokuapp.com/github-events/`,
        {
          method: "POST",
          body: JSON.stringify({ repo }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      return await res.json();
    } catch (err) {
      Alert.alert("Internal server error");
      return null;
    }
  };

  useEffect(() => {
    if (events.length === 0 && isLoggedIn) {
      fetchData()
        .then(res => {
          if (res !== null && res.length !== events.length) {
            setEvents(res);
          }
        })
        .catch(e => Alert.alert(e.message))
        .finally(() => setIsLoading(false));
    }
  }, [events]);

  useEffect(() => {
    console.log(repo);
    let timeOutId;
    if (repo !== "" && isLoggedIn) {
      setIsLoading(true);
      timeOutId = setInterval(() => {
        fetchData()
          .then(res => {
            if (res !== null) {
              setEvents(res);
            }
          })
          .catch(e => Alert.alert(e.message))
          .finally(() => setIsLoading(false));
      }, 10000);
    }
    return () => {
      setEvents([]);
      clearInterval(timeOutId);
    };
  }, [repo, isLoggedIn]);

  return (
    <ScrollView style={styles.container}>
      {isLoading && <ActivityIndicator />}
      {events.map(e => {
        return <Event key={e.id} event={e} />;
      })}
    </ScrollView>
  );
}

GithubScreen.navigationOptions = {
  title: "Activity"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff"
  }
});
