import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { ModalCodigo } from '../components/ModalCodigo';

interface ProfessorContextType {
    isProfessor: boolean;
    login: () => void;
    logout: () => void;
}

const ProfessorContext = createContext<ProfessorContextType | undefined>(undefined);

export const ProfessorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isProfessor, setIsProfessor] = useState(false);


 

  const login = () => {
    
      setIsProfessor(true);
   
   
  };

  const logout = () => {

    if(Platform.OS === "android") {
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
            text: "Confirmar",
            onPress: async () => {
              try {
                setIsProfessor(false);
              } catch (e) {
                console.error("Erro ao apagar a receita ou limpar o armazenamento:", e);
              }
            }
          }
        ],
        { cancelable: false }
      );
    }else{
      const confirm = window.confirm("Você tem certeza de que deseja sair?");
      if (confirm)  setIsProfessor(false);
      
    }
   
    
  }

  return (
    <ProfessorContext.Provider value={{ isProfessor, login, logout }}>
      {children}
    </ProfessorContext.Provider>
  );
};

export const useProfessorContext = () => {
  const context = useContext(ProfessorContext);
  if (context === undefined) {
    throw new Error('useProfessorContext must be used within a ProfessorProvider');
  }
  return context;
};
