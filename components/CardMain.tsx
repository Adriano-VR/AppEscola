import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, Platform, Modal, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Receita } from '../model/ModelReceita';
import { useReceita } from '../context/Context';
import { ThemedText } from "../Hooks/ThemedText";

interface CardReceitaProps {
  item: Receita;
  onRefresh: () => void;
}

export const CardMain = ({ item, onRefresh }: CardReceitaProps) => {
  const { incrementUsers, removeReceita, decrementUsers, removeHistoricoItem } = useReceita();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [codigoModalVisible, setCodigoModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // Novo estado para modal de confirmação
  const [codigo, setCodigo] = useState<string>('');

  useEffect(() => {
    const loadConfirmationStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(`confirmation_${item.id}`);
        if (value !== null) {
          setIsConfirmed(JSON.parse(value));
        }
      } catch (error) {
        console.error("Error loading confirmation status", error);
      }
    };

    loadConfirmationStatus();
  }, []);

  const handleConfirm = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("Você tem certeza de que deseja confirmar?");
      if (confirm) {
        incrementUsers(item.id);
        setIsConfirmed(true);
        AsyncStorage.setItem(`confirmation_${item.id}`, JSON.stringify(true)); // Persiste o estado
      }
    } else {
      Alert.alert(
        "Confirmar Interesse",
        "Você tem certeza de que deseja confirmar?",
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Ação cancelada"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: async () => {
              await incrementUsers(item.id);
              setIsConfirmed(true);
              await AsyncStorage.setItem(`confirmation_${item.id}`, JSON.stringify(true)); // Persiste o estado
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  const remove = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("Você tem certeza de que deseja remover o interesse?");
      if (confirm) {
        decrementUsers(item.id);
        setIsConfirmed(false);
        AsyncStorage.setItem(`confirmation_${item.id}`, JSON.stringify(false)); // Atualiza a persistência
      }
    } else {
      Alert.alert(
        "Confirmar Ação",
        "Você tem certeza de que deseja remover o interesse?",
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Ação cancelada"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: async () => {
              await decrementUsers(item.id);
              setIsConfirmed(false);
              await AsyncStorage.setItem(`confirmation_${item.id}`, JSON.stringify(false)); // Atualiza a persistência
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  const apagar = async () => {
    try {
      await removeReceita(item.id); // Remove a receita do seu estado ou contexto
      await AsyncStorage.removeItem(`confirmation_${item.id}`); // Limpa o AsyncStorage
      console.log(`Dados removidos para a receita ${item.id}`);
    } catch (e) {
      console.error("Erro ao apagar a receita ou limpar o armazenamento:", e);
    }
  };

  const verificarCodigo = () => {
    const codigoCorreto = '0408'; // Defina o código correto aqui

    if (codigo.trim() === '') {
      if (Platform.OS === "android") {
        Alert.alert(
          "Código Vazio",
          "Por favor, insira um código."
        );
      } else if (Platform.OS === "web") {
        window.alert('Por favor, insira um código.');
      }
      return; // Não continue com a verificação
    }

    if (codigo === codigoCorreto) {
      setCodigoModalVisible(false);
      apagar();
    } else {
      if (Platform.OS === "android") {
        Alert.alert(
          "Código Incorreto",
          "O código inserido está incorreto. Tente novamente."
        );
      } else if (Platform.OS === "web") {
        window.alert('Código incorreto');
      }
    }
  };

  const voltar = () => {
    setCodigo('');
    setCodigoModalVisible(false);
  };

  const mostrarConfirmacao = () => {
    setConfirmModalVisible(true);
  };

  const confirmarRemocao = () => {
    setConfirmModalVisible(false);
    setCodigoModalVisible(true);
  };

  const cancelarRemocao = () => {
    setConfirmModalVisible(false);
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.listContainer}>
        <Image style={styles.img} source={require('../assets/merenda.jpg')} />
        <MaterialIcons
          onPress={mostrarConfirmacao} // Alterado para mostrar o modal de confirmação
          name="remove-circle"
          size={35}
          color="red"
          style={{ position: 'absolute', top: 10, right: 20 }}
        />
        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>{item.name}</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.subtitle}>{item.descricao}</ThemedText>
          <ThemedText type="default" style={styles.subtitle}>{item.data}</ThemedText>
          {!isConfirmed ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
              <ThemedText type='defaultSemiBold' style={{ color: 'black' }}>Deseja Confirmar?</ThemedText>
              <FontAwesome onPress={handleConfirm} name="check-circle" size={30} color="green" />
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', paddingBottom: 5 }}>
                <ThemedText type='subtitle' style={styles.confirmedText}>
                  Confirmado
                </ThemedText>
              </View>
              <ThemedText onPress={remove} type='default' style={{ color: 'red', textDecorationLine: 'underline' }}>Cancelar Confirmação</ThemedText>
            </View>
          )}
        </View>
        <ThemedText type='defaultSemiBold' style={styles.conf}>
          Confirmados: {item.users}
        </ThemedText>
      </View>

      {/* Modal de Confirmação */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <ThemedText type='defaultSemiBold'>Você tem certeza de que deseja remover a receita?</ThemedText>
            <View style={{ flexDirection: 'row', gap: 10, marginVertical: 15 }}>
             
              <TouchableOpacity onPress={cancelarRemocao}>
                <FontAwesome name="times-circle" size={40} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmarRemocao}>
                <FontAwesome name="check-circle" size={40} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Inserir Código */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={codigoModalVisible}
        onRequestClose={() => {
          // Evita o fechamento do modal ao pressionar o botão de voltar
          Alert.alert(
            "Código Necessário",
            "Você precisa inserir o código correto para continuar."
          );
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            
            <ThemedText type='defaultSemiBold'>Insira o código para confirmar:</ThemedText>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,marginVertical:15}}> 
            <TextInput
              style={{borderWidth: 1, padding:8,width:150,height:40 ,borderRadius:8,textAlign:"center"}}
              autoCorrect={false} // Desativa a correção automática
              textContentType="none" // Desativa sugestões automáticas
              secureTextEntry={true}
              placeholder="Código"
              placeholderTextColor='#0a0a0a'
              inputMode='numeric'
              onChangeText={newText => setCodigo(newText)}
              value={codigo}
      
            />
                <TouchableOpacity onPress={verificarCodigo}>
                <FontAwesome name="check-circle" size={40} color="green" />
              </TouchableOpacity>
            </View>
           
        
            <ThemedText type='defaultSemiBold' onPress={() => voltar()} style={{textDecorationLine:'underline'}}>Cancelar</ThemedText>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '90%',
    paddingBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    alignSelf: "center",
    elevation: 10,
    position: 'relative',
  },
  listContainer: {
    width: '100%',
  },
  img: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 15,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: "center",
  },
  subtitle: {
    color: 'black',
    width: '100%',
    textAlign: "center",
  },
  confirmedText: {
    textAlign: 'center',
    color: 'green',
  },
  conf: {
    borderTopWidth: 1,
    textAlign: "center",
    padding: 5,
    color: "black",
    borderColor: "#dedede",
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});
