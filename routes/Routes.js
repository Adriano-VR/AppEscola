import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "../screens/HomeScreen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Historico from "../screens/Historico";
import CriarConta from "../screens/CriarConta";
import { TabBarIcon } from "../components/navigation/TabBaricon";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false, // Remove o cabeçalho de todas as abas
      
    }}
    >
      <Tab.Screen name="Inicio" 
       options={{
          title: 'inicio',
          tabBarLabelStyle: { color: 'black' }, // Cor do título específico para esta aba
     
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color='black' />
          ),
        }} 
        component={HomeScreen} />
      <Tab.Screen name="Adicionar"    
      options={{
          title: 'Adicionar',
          tabBarLabelStyle: { color: 'black' }, // Cor do título específico para esta aba

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color='black' />
          ),
        }}
         component={CriarConta} />
    </Tab.Navigator>
  );
}


export default function Routes() {
    return (
      <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home"
        screenOptions={{
          drawerActiveTintColor: "#fff", // Cor do item ativo no drawer
          drawerInactiveTintColor: "gray", // Cor do item inativo no drawer
          headerTintColor: '#000', // Cor do texto do cabeçalho
          
          drawerLabelStyle: {
            fontWeight: 'bold', // Define o estilo padrão
          
          },
          drawerActiveBackgroundColor: "#787586",
         
        }}> 
        <Drawer.Screen name="Home" component={HomeTabs}   options={{
        
            drawerIcon: ({ color, size }) => (
              <TabBarIcon name="home-outline" size={size} color={color} /> // Ícone para a tela Home
            ),
          }} />
        <Drawer.Screen name="Historico" component={Historico} options={{
            drawerIcon: ({ color, size }) => (
              
              <TabBarIcon name="bookmarks-outline" size={size} color={color} /> // Ícone para a tela Home
   ),
          }} />
      </Drawer.Navigator>

    </NavigationContainer>

    )
  }
