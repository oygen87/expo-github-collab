import React, { useState, useContext, useEffect } from "react";
import { ScrollView, Text, Alert, StyleSheet } from "react-native";
import { RepoContext } from "../Context/RepoContext";
import Event from "../components/Event";

export default function GithubScreen() {
  const [events, setEvents] = useState([]);
  const [repo, _] = useContext(RepoContext);

  const fetchData = () => {
    console.log(repo);
    fetch(`https://githubcollabapp.herokuapp.com/github-events/`, {
      method: "POST",
      body: JSON.stringify({ repo }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.ok) {
          res.json().then(evts => {
            /*if (
              events.length > 0 &&
              JSON.stringify(this.events) !== JSON.stringify(evts)
            ) {
              this.newEvents = true;
              setTimeout(() => (this.newEvents = false), 2000);
            } else {
              this.newEvents = false;
            }*/
            if (JSON.stringify(events) !== JSON.stringify(evts))
              setEvents(evts);
          });
        } else {
          Alert("Repository is private or not found");
        }
      })
      .catch(() => {
        Alert("Internal server error");
      })
      .finally(() => {
        //this.isLoading = false;
      });
  };

  useEffect(() => {
    console.log("useffect EVENTS");
    fetchData();
  }, [events])

  useEffect(() => {
    const timeOutId = setInterval(() => {
      console.log("FETCHING")
      fetchData();
    }, 10000);
    return () => {
      console.log("CLEARED");
      setEvents([]);
        clearInterval(timeOutId);
      };
  }, [repo]);

  return (
    <ScrollView style={styles.container}>
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
