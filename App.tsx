import "./react-native-gesture-handler"

import { StyleSheet, Text, View } from 'react-native';
import Routes from "./routes/Routes"
import { ReceitaProvider } from './context/Context';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";




export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ReceitaProvider>
        <StatusBar style="auto"  backgroundColor="transparent" />
          <Routes />
            
            </ReceitaProvider>
            </GestureHandlerRootView>


  );
}
