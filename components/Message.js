import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default Message = ({ username, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username} : </Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24
  },
  message: {
    fontSize: 20,
    lineHeight: 24
  }
});
