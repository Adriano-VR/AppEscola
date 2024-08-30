import React, { Component, useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Modal, Image, ImageBackground } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useReceita } from '../context/Context';
import { ThemedText } from '../Hooks/ThemedText';
import { Platform, Alert, Alert as RNAlert } from 'react-native';
import { useProfessorContext } from '../context/ContextProfessor';

const CriarConta = () => {

  const [codigo, setCodigo] = useState<string>('');
  const [receita, setReceita] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const navigation = useNavigation();
  const { addReceita } = useReceita();
  const {isProfessor} = useProfessorContext()

  useFocusEffect(
    React.useCallback(() => {
      console.log("Focus Effect Triggered, isProfessor:", isProfessor);
      if (!isProfessor) {
        if (Platform.OS === 'web') {
          window.alert("Acesso Negado");
        } else {
          Alert.alert("Acesso Negado", "Você não tem permissão para acessar esta página.");
        }
        navigation.goBack(); // Redirect back if not a professor
      }
    }, [isProfessor])
  );


  
  const add = () => {
    if (desc.length > 0 && receita.length > 0) {
      if (Platform.OS === 'web') {
        const confirm = window.confirm("Você tem certeza de que deseja adicionar esta receita?");
        if (confirm) {
          addReceita(receita, desc);
          navigation.goBack();
          setReceita('');
          setDesc('');
          setCodigo('');
        }
      } else {
        RNAlert.alert(
          "Confirmar Ação",
          "Você tem certeza de que deseja adicionar esta receita?",
          [
            {
              text: "Cancelar",
              onPress: () => console.log("Ação cancelada"),
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => {
                addReceita(receita, desc);
                navigation.goBack();
                
                setReceita('');
                setDesc('');
                setCodigo('')
              }
            }
          ],
          { cancelable: false }
        );
      }
    } else {
      if (Platform.OS === 'web') {
        window.alert("Por favor, preencha todos os campos.");
      } else {
        RNAlert.alert(
          "Aviso",
          "Por favor, preencha todos os campos."
        );
      }
    }
  };


  return (
    <View style={styles.container}>
      
      
      <View style={styles.content}>
          <ThemedText type='subtitle' style={{ marginBottom: 15, textAlign: 'center', color: 'black' }}>
            Cadastrar
          </ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Informe A Receita"
            placeholderTextColor='#0a0a0a'
            onChangeText={newText => setReceita(newText)}
            value={receita}
          />
          <TextInput
            style={styles.input}
            placeholder="Informe A descrição"
            placeholderTextColor='#0a0a0a'
            onChangeText={newText => setDesc(newText)}
            value={desc}
          />

          <TouchableOpacity
            style={{
              backgroundColor: desc.length > 0 && receita.length > 0 ? '#0099ff' : '#787586',
              padding: 10,
              borderRadius: 4,
              elevation: 5
            }}
            onPress={add}
          >
            <ThemedText type='defaultSemiBold' style={{ color: '#fff', textAlign: 'center' }}>
              Salvar
            </ThemedText>
          </TouchableOpacity>
        </View>
      



     
    </View>
  );
};

export default CriarConta;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dedede',
position: "relative",
    justifyContent: 'center',
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#0a0a0a',
  },
  content: {
    width: '90%',
    margin: 'auto',
    padding: 10,
    backgroundColor: "white",
    borderRadius: 7,
    elevation: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalInput: {
    borderWidth: 1,
    padding: 8,
    width: '80%',
    borderRadius: 8,
    marginBottom: 8,

  },
  modalButtons: {
    alignItems: "center",

    gap:10
  },
  buttonClose: {
    backgroundColor: "#dedede",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});