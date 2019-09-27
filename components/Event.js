import React from "react";
import { View, Text, Image, StyleSheet} from "react-native";

export default Event = ({event}) => {
    return(
        <View style={styles.container}>
            <Image style={styles.img} source={{uri: event.avatar}}></Image>
            <Text style={styles.time}>{dateTime(event.created)}</Text>
            <Text>{ event.actor } { event.action } { event.type }</Text>
        </View>
    )
}

const dateTime = (createdDate) => {
    const MILLISECONDS_1_DAY = 86400000;
    const today = new Date().getTime();
    const created = new Date(createdDate).getTime();
    const diff = today - created - MILLISECONDS_1_DAY;
    if (diff <= 0) {
      return new Date(createdDate).toLocaleTimeString();
    }
    return new Date(createdDate).toLocaleDateString();
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 12,
    },
    time: {
        marginLeft: 12,
        marginRight: 12,
        color: "gray"
    },
    img: {
        width: 24,
        height: 24,
        borderRadius: 12,
    }
});