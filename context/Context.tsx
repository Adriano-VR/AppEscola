import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import { Receita } from '../model/ModelReceita';
import Historico from './../screens/Historico';

interface ReceitaContextType {
  receitas: Receita[];
  loading: boolean;
  addReceita: (name: string, desc: string) => Promise<void>;
  fetchReceitas: () => Promise<void>;
  incrementUsers: (id: number) => Promise<void>;
  decrementUsers: (id: number) => Promise<void>;
  removeReceita: (id: number) => Promise<void>;
  fetchHistorico: () => Promise<void>;
  historico: any[];
  removeHistoricoItem: (id: number) => Promise<void>; // Atualizado para string (se o ID for string)
  removeAllHistorico: () => Promise<void>;
}

const ReceitaContext = createContext<ReceitaContextType | undefined>(undefined);

export const ReceitaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [historico, setHistorico] = useState<any[]>([]); // Ajuste conforme a estrutura do histórico

  const apiBaseURL = 'https://fluffy-shadow-hook.glitch.me';

  const fetchReceitas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseURL}/`);
      setReceitas(response.data.items);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorico = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseURL}/historico`);
   
      setHistorico(response.data.items); // Ajuste conforme a estrutura da resposta
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReceita = async (name: string, desc: string) => {
    setLoading(true);
    try {
      const newReceita = {
        name,
        descricao: desc,
        users: 0
      };

      const response = await axios.post(`${apiBaseURL}/add`, newReceita);
      const addedReceita = response.data.newItem;

      setReceitas(prevReceitas => [...prevReceitas, addedReceita]);
      ToastAndroid.showWithGravity(
        'Receita adicionada com sucesso!',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
      ToastAndroid.showWithGravity(
        'Erro ao adicionar receita!',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    } finally {
      setLoading(false);
    }
  };

  const incrementUsers = async (id: number) => {
    setLoading(true);
    try {
      const receitaToUpdate = receitas.find(receita => receita.id === id);
      if (receitaToUpdate) {
        const updatedReceita = { ...receitaToUpdate, users: receitaToUpdate.users! + 1 };
        await axios.patch(`${apiBaseURL}/increment/${id}`, updatedReceita);
        setReceitas(receitas.map(receita => (receita.id === id ? updatedReceita : receita)));
        fetchReceitas()
      }
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
    } finally {
      setLoading(false);
    }
  };

  const decrementUsers = async (id: number) => {
    setLoading(true);
    try {
      const receitaToUpdate = receitas.find(receita => receita.id === id);
      if (receitaToUpdate) {
        const updatedReceita = { ...receitaToUpdate, users: Math.max(receitaToUpdate.users! - 1, 0) };
        await axios.patch(`${apiBaseURL}/decrement/${id}`, updatedReceita);
        setReceitas(receitas.map(receita => (receita.id === id ? updatedReceita : receita)));
        fetchReceitas()
      }
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeReceita = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseURL}/delete/${id}`);
      setReceitas(receitas.filter(receita => receita.id !== id));
      fetchReceitas()
      ToastAndroid.showWithGravity(
        'Receita removida com sucesso!',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    } catch (error) {
      console.error('Erro ao remover receita:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeHistoricoItem = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseURL}/historico/delete/${id}`);
      setHistorico(historico.filter(item => item.id !== id));
      fetchReceitas()
      ToastAndroid.showWithGravity(
        'Item do histórico removido com sucesso!',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    } catch (error) {
      console.error('Erro ao remover item do histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeAllHistorico = async () => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseURL}/historico/delete-all`);
      setHistorico([]);
      fetchReceitas()
      ToastAndroid.showWithGravity(
        'Todos os itens do histórico foram removidos!',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    } catch (error) {
      console.error('Erro ao remover todos os itens do histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReceitaContext.Provider value={{ receitas, loading, addReceita, fetchReceitas, incrementUsers, decrementUsers, removeReceita, fetchHistorico, historico, removeHistoricoItem, removeAllHistorico }}>
      {children}
    </ReceitaContext.Provider>
  );
};

export const useReceita = () => {
  const context = useContext(ReceitaContext);
  if (context === undefined) {
    throw new Error('useReceita must be used within a ReceitaProvider');
  }
  return context;
};
