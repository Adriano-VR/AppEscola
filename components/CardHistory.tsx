import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { useReceita } from '../context/Context';
import { ThemedText } from '../Hooks/ThemedText';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export const CardHistory = ({ item, onRefresh }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const { fetchHistorico, historico, removeHistoricoItem, loading } = useReceita();

  useEffect(() => { onRefresh() }, []);

  const apagar = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("Você tem certeza de que deseja apagar o item do histórico?");
      if (confirm) {
        removeHistoricoItem(item.id); // Remove a receita do seu estado ou contexto
      }
    } else {
      Alert.alert(
        "Confirmar Ação",
        "Você tem certeza de que deseja apagar o item do histórico?",
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Ação cancelada"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                await removeHistoricoItem(item.id); // Remove a receita do seu estado ou contexto
              } catch (e) {
                console.error("Erro ao apagar a receita ou limpar o armazenamento:", e);
              }
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={{ width: '25%' }}>
          <TouchableOpacity onPress={apagar} style={{ margin: "auto" }}>
            <FontAwesome6 name="trash-alt" size={40} color="red" />
          </TouchableOpacity>
        </View>
        <View style={{ borderLeftWidth: 1, flex: 1, padding: 10, borderColor: '#dedede' }}>
          <ThemedText type='defaultSemiBold'>{item.name}</ThemedText>
          <ThemedText type='default'>Confirmações: {item.users}</ThemedText>
          <ThemedText type='link'>Criado: {item.data}</ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dedede',
    justifyContent: "center",
    alignContent: "center",
    position: "relative",
  },
  card: {
    flex: 1,
    elevation: 5,
    width: '90%',
    margin: 'auto',
    marginTop: 15,
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});