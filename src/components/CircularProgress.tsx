import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";

const CircularProgress = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000, // 4000 milliseconds for a full rotation
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.circle, { transform: [{ rotate: spin }] }]}
      >
        <View style={styles.loader}></View>
      </Animated.View>
      <View style={styles.innerContainer}>
        <Text>Text</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "red",
  },
  innerContainer: {
    height: 90,
    width: 90,
    backgroundColor: "white",
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
});

export default CircularProgress;
