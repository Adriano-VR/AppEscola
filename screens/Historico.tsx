import React, { useCallback, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, RefreshControl, StyleSheet, Alert, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { useReceita } from '../context/Context';
import { ThemedText } from '../Hooks/ThemedText';
import { CardHistory } from '../components/CardHistory';
import Octicons from '@expo/vector-icons/Octicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const Historico = () => {
  
  const { fetchHistorico, historico, removeAllHistorico } = useReceita();

  const [refreshing, setRefreshing] = useState(false);
  const [codigoModalVisible, setCodigoModalVisible] = useState(true);
  const [codigo, setCodigo] = useState<string>('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistorico();
    setRefreshing(false);
  }, [historico]);

  useFocusEffect(
    React.useCallback(() => {
      setCodigoModalVisible(true);
      setCodigo('')
    }, [])
  );

  const apagarTudo = () => {
    Alert.alert(
      'Confirmar Ação',
      'Você tem certeza de que deseja apagar o histórico?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Ação cancelada'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await removeAllHistorico();
            } catch (e) {
              console.error('Erro ao apagar a receita ou limpar o armazenamento:', e);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
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

  const navigation = useNavigation();


  const voltar = () => {
    setCodigo('')
    navigation.goBack()
   
    setCodigoModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.container}>
       {!codigoModalVisible && (
   <ScrollView
   contentContainerStyle={styles.scrollViewContent}
   refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
           style={{ textAlign: 'center', padding: 15, color: 'black', textDecorationLine: 'underline' }}
         >
           Limpar Histórico
         </ThemedText>
       </View>
     </>
   ) : (
     <View style={styles.noDataContainer}>
<Octicons name="history" size={50} color="black" />
       <ThemedText type="subtitle" style={{ color: 'black' }}>
        Ops...
        
       </ThemedText>
       <ThemedText type='default'> Arraste para baixo para <ThemedText onPress={onRefresh} type='defaultSemiBold' style={{textDecorationLine:'underline'}}>atualizar</ThemedText></ThemedText>

     </View>
   )}
 </ScrollView>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dedede',
    justifyContent: 'center',
    alignContent: 'center',
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 50,
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
});

export default Historico;