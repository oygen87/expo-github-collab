import React, { useState, useContext, useEffect } from "react";
import { ScrollView, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { RepoContext } from "../Context/RepoContext";
import Event from "../components/Event";

export default function GithubScreen() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [repo, _] = useContext(RepoContext);

  const fetchData = async () => {
    let res;
    try {
      res = await fetch(
        `https://githubcollabapp.herokuapp.com/github-events/`,
        {
          method: "POST",
          body: JSON.stringify({ repo }),
          headers: {
            "Content-Type": "applicgitation/json"
          }
        }
      );
    } catch (err) {
      Alert.alert("Internal server error");
      return null;
    }

    if (res && res.ok) {
      const json = await res.json();
      return json;
    } else {
      Alert.alert("Repository is private or not found");
      return null;
    }
  };

  useEffect(() => {
    fetchData()
      .then(res => {
        if (res !== null && res.length !== events.length) {
          setEvents(res);
        }
      })
      .catch()
      .finally(() => setIsLoading(false));
  }, [events]);

  useEffect(() => {
    setIsLoading(true);
    const timeOutId = setInterval(() => {
      fetchData()
        .then(res => {
          if (res !== null) {
            setEvents(res);
          }
        })
        .catch()
        .finally(() => setIsLoading(false));
    }, 10000);
    return () => {
      setEvents([]);
      clearInterval(timeOutId);
    };
  }, [repo]);

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
