import React from 'react';
import { Alert, Button, Modal, Platform, Pressable, StyleSheet, TextInput, View,TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '../Hooks/ThemedText';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useProfessorContext } from '../context/ContextProfessor';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ButtonCustom = () => {
  const { login, isProfessor, logout } = useProfessorContext();
  const [codigo, setCodigo] = React.useState<string>('');
  const [showModal, setShowModal] = React.useState(false);

  const checkCode = () => {
    if (codigo === '0408') {
    
      setShowModal(false);
      login();
    } else {
      if(Platform.OS === "web") {
          window.alert("Código Errado");
      }else {
        Alert.alert('Erro', 'Código Errado');
      }
     
    }
  };

  const handleLoginPress = () => {
    setShowModal(true);
  };

  return (
    <View style={{ backgroundColor: '#dedede', padding: 5, borderRadius: 5, marginRight: 20 }}>
      {!isProfessor ? (
        <Pressable onPress={handleLoginPress}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="admin-panel-settings" size={25} color="black" />
            <ThemedText type="defaultSemiBold">Professor</ThemedText>
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={() => logout()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText type="defaultSemiBold">Sair</ThemedText>
          </View>
        </Pressable>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)} // Fecha o modal ao pressionar "voltar"
      >
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
        <View style={styles.modalBackground}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <ThemedText type="defaultSemiBold">Insira o código para confirmar:</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginVertical: 15 }}>
              <TextInput
                style={{ borderWidth: 1, padding: 8, width: 150, height: 40, borderRadius: 8, textAlign: "center" }}
                autoCorrect={false}
                textContentType="none"
                secureTextEntry={true}
                placeholder="Código"
                placeholderTextColor="#0a0a0a"
                inputMode="numeric"
                onChangeText={newText => setCodigo(newText)}
                value={codigo}
              />
              <Pressable onPress={checkCode}>
                <FontAwesome name="check-circle" size={40} color="green" />
              </Pressable>
            </View>
          </View>
          </TouchableWithoutFeedback>

        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ButtonCustom;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
