import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useReceita } from "../context/Context";
import { ThemedText } from "../Hooks/ThemedText";
import { CardHistory } from "../components/CardHistory";
import Octicons from "@expo/vector-icons/Octicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useProfessorContext } from "../context/ContextProfessor";

const Historico = () => {
  const { fetchHistorico, historico, removeAllHistorico } =
    useReceita();

  const [refreshing, setRefreshing] = useState(false);
  const { isProfessor } = useProfessorContext();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      console.log("Focus Effect Triggered, isProfessor:", isProfessor);
      if (!isProfessor) {
        if (Platform.OS === "web") {
          window.alert("Acesso Negado");
        } else {
          Alert.alert(
            "Acesso Negado",
            "Você não tem permissão para acessar esta página."
          );
        }
        navigation.goBack(); // Redirect back if not a professor
      }
    }, [isProfessor])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistorico(); // Aqui, o estado loading deve ser atualizado dentro de fetchHistorico
    setRefreshing(false);
  }, [fetchHistorico]); // Adiciona fetchHistorico como dependência para garantir que ele sempre seja o mais recente

  const apagarTudo = async () => {
    if (Platform.OS === "android") {
      Alert.alert(
        "Confirmar Ação",
        "Você tem certeza de que deseja apagar o histórico?",
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Ação cancelada"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                await removeAllHistorico();
              } catch (e) {
                console.error(
                  "Erro ao apagar a receita ou limpar o armazenamento:",
                  e
                );
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      const confirm = window.confirm("Apagar Tudo?");
      if (confirm) await removeAllHistorico();
    }
  };




  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {historico.length > 0 ? (
          <>
            {historico.map((item) => (
              <CardHistory onRefresh={onRefresh} item={item} key={item.id} />
            ))}
            <View>
              <ThemedText
                onPress={apagarTudo}
                type="subtitle"
                style={{
                  textAlign: "center",
                  padding: 15,
                  color: "black",
                  textDecorationLine: "underline",
                }}
              >
                Limpar Histórico
              </ThemedText>
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Octicons name="history" size={50} color="black" />
            <ThemedText type="subtitle" style={{ color: "black" }}>
              Ops...
            </ThemedText>
            <ThemedText type="default">
              {" "}
              Arraste para baixo para{" "}
              <ThemedText
                onPress={onRefresh}
                type="defaultSemiBold"
                style={{ textDecorationLine: "underline" }}
              >
                atualizar
              </ThemedText>
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dedede",
    justifyContent: "center",
    alignContent: "center",
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 50,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escurecido
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    padding: 8,
    width: "80%",
    borderRadius: 8,
    marginBottom: 8,
  },
  modalButtons: {
    alignItems: "center",

    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Historico;
