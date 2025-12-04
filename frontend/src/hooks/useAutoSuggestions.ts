import { useEffect, useCallback } from 'react';
import { aiSuggestionService } from '../services/aiSuggestionService';

/**
 * Hook para gerar sugestões da IA automaticamente
 * Gera sugestões quando o usuário acessa o dashboard pela primeira vez no dia
 */
export function useAutoSuggestions() {
  const generateDailySuggestions = useCallback(async () => {
    try {
      const lastGeneration = localStorage.getItem('lastSuggestionGeneration');
      const today = new Date().toDateString();

      // Se já gerou hoje, não gera novamente
      if (lastGeneration === today) {
        return;
      }

      // Gerar sugestões
      await aiSuggestionService.generate();
      
      // Atualizar última geração
      localStorage.setItem('lastSuggestionGeneration', today);
    } catch (error) {
      console.error('Erro ao gerar sugestões automáticas:', error);
    }
  }, []);

  useEffect(() => {
    // Gerar sugestões ao montar o componente
    generateDailySuggestions();

    // Verificar a cada hora se precisa gerar novas sugestões
    const interval = setInterval(() => {
      generateDailySuggestions();
    }, 60 * 60 * 1000); // 1 hora

    return () => clearInterval(interval);
  }, [generateDailySuggestions]);
}

