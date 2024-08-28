import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useReceita } from '../context/Context';
import { ThemedText } from '../Hooks/ThemedText';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Platform, Alert, Alert as RNAlert } from 'react-native';

const CriarConta = () => {
  const [codigoModalVisible, setCodigoModalVisible] = useState(true);
  const [codigo, setCodigo] = useState<string>('');
  const [receita, setReceita] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const navigation = useNavigation();
  const { addReceita } = useReceita();

  // Verifica o código toda vez que a aba é focada
  useFocusEffect(
    React.useCallback(() => {
      setCodigoModalVisible(true);
      setCodigo('')
    }, [])
  );

  const verificarCodigo = () => {
    const codigoCorreto = '0408'; // Defina o código correto aqui

    if (codigo === codigoCorreto) {
      setCodigoModalVisible(false); // Fecha o modal se o código estiver correto
    } else {
      if(Platform.OS === "android") {
        Alert.alert(
          "Código Incorreto",
          "O código inserido está incorreto. Tente novamente."
        );
      }else if(Platform.OS === "web") {
        window.alert('senha errada')
      }
    
    }
  };
  
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

  const voltar = () => {
    setCodigo('')
    navigation.goBack()
   
    setCodigoModalVisible(false);
  }

  return (
    <View style={styles.container}>
      {/* Mostrar o conteúdo da página apenas se o modal estiver fechado */}
      {!codigoModalVisible && (
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
              backgroundColor: desc.length > 0 && receita.length > 0 ? 'green' : '#787586',
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
      )}

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

export default CriarConta;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dedede',
    paddingVertical: 40,
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