import "./react-native-gesture-handler"

import { StyleSheet, Text, View } from 'react-native';
import Routes from "./routes/Routes"
import { ReceitaProvider } from './context/Context';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import { ProfessorProvider } from "./context/ContextProfessor";




export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ReceitaProvider>
      <ProfessorProvider>
        <StatusBar style="auto"  backgroundColor="transparent" />
          <Routes />
          </ProfessorProvider>
            </ReceitaProvider>
            </GestureHandlerRootView>


  );
}
