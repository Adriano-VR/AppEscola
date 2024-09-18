import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Linking, Platform, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Routes from './routes/Routes';
import { ReceitaProvider } from './context/Context';
import { ProfessorProvider } from './context/ContextProfessor';
import { ThemedText } from './Hooks/ThemedText';

const AppContent = () => {
  const [isVersionValid, setIsVersionValid] = useState(true); // Default to true for web
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const currentVersion = Constants.expoConfig.version;

  // Log currentVersion for debugging purposes
  console.log(currentVersion);

  useEffect(() => {
    // Only perform version check on mobile platforms
    // if (Platform.OS !== 'web') {
      const verifyVersion = async () => {
        try {
          const response = await fetch('https://fluffy-shadow-hook.glitch.me/api/check-version', {
            method: 'POST', // Use POST to send data
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ version: currentVersion }),
          });
          const data = await response.json();

          if (response.status === 403) {
            Alert.alert(
              "Atualização Necessária",
              data.message,
            );
            setIsVersionValid(false);
          } else {
            setIsVersionValid(true);
          }
        } catch (error) {
          console.error("Erro ao verificar a versão", error);
          setIsVersionValid(false);
        } finally {
          setIsLoading(false); // Set loading to false after verification
        }
      };

      verifyVersion();
    // } else {
    //   // For web, no version check needed
    //   setIsLoading(false);
    // }
  }, [currentVersion]);

  if (isLoading) {
    // Show a loading screen while checking the version
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText type='defaultSemiBold'>Verificando a versão...</ThemedText>
      </View>
    );
  }

  // if (!isVersionValid && Platform.OS !== 'web') {
    if (!isVersionValid) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText type='defaultSemiBold'>Sua versão do aplicativo não é mais suportada.</ThemedText>
      </View>
    );
  }

  return <Routes />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReceitaProvider>
        <ProfessorProvider>
          <StatusBar style="auto" backgroundColor="transparent" />
          <AppContent />
        </ProfessorProvider>
      </ReceitaProvider>
    </GestureHandlerRootView>
  );
}
