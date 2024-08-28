import React, { useRef, useEffect } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function LoadingSpinner() {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      rotateValue.setValue(0);
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <AntDesign name="loading1" size={40} color="black" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     alignItems: 'center',
    justifyContent: 'center',
  },
});
