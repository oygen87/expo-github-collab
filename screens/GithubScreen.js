import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function GithubScreen() {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return (
    <View style={styles.container}>
      <Text>Github Screen</Text>
    </View>
  );
}

GithubScreen.navigationOptions = {
  title: "Github"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff"
  }
});
