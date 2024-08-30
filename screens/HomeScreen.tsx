import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, RefreshControl, Dimensions, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useReceita } from '../context/Context';
import { ThemedText } from '../Hooks/ThemedText';
import LoadingSpinner from '../components/LoadSpinner';
import { CardMain } from '../components/CardMain';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export const HomeScreen = () => {
  const { fetchReceitas, receitas, loading } = useReceita();
  const [refreshing, setRefreshing] = useState(false);


  // useFocusEffect(
  //   React.useCallback(() => {
  //     onRefresh();
  //   }, [])
  // );

  useEffect(() => {
    onRefresh()
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReceitas();
    setRefreshing(false);
  }, [fetchReceitas]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {receitas.length > 0 ? (
          receitas.map((item) => <CardMain onRefresh={onRefresh} key={item.id} item={item} />)
        ) : (
          <View style={styles.noDataContainer}>
          <MaterialCommunityIcons name="food-off" size={80} color="black" />        
              <ThemedText type='subtitle' style={{ color: 'black',marginTop:20 }}>
              Sem Refeições !!!
            </ThemedText>
            <ThemedText type='default'> Arraste para baixo para <ThemedText onPress={onRefresh} type='defaultSemiBold' style={{textDecorationLine:'underline'}}>atualizar</ThemedText></ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dedede',
    justifyContent: "center",
    alignContent: "center",
    position: "relative",
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 50,
  },
});
