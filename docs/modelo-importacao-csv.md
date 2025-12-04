# Modelo de Planilha CSV para Importação de Extratos

Este documento descreve o formato esperado para importação de extratos bancários em CSV.

## Formato do Arquivo

- **Formato**: CSV (Comma-Separated Values)
- **Encoding**: UTF-8
- **Separador**: Vírgula (,)
- **Delimitador de texto**: Aspas duplas (")

## Colunas Obrigatórias

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| data | DATE (YYYY-MM-DD) | Data da transação | 2024-01-15 |
| valor | DECIMAL | Valor da transação (positivo para receita, negativo para despesa) | -150.50 |
| descricao | STRING | Descrição da transação | SUPERMERCADO ABC |
| categoria | STRING (opcional) | Categoria sugerida (será classificada pela IA se não informada) | Alimentação |
| metodo_pagamento | STRING (opcional) | Método de pagamento | Cartão de Crédito |
| conta | STRING (opcional) | Nome da conta | Conta Corrente Principal |

## Exemplo de Arquivo CSV

```csv
data,valor,descricao,categoria,metodo_pagamento,conta
2024-01-15,-150.50,SUPERMERCADO ABC,Alimentação,Cartão de Crédito,Conta Corrente Principal
2024-01-16,-45.00,UBER TRANSPORTE,Transporte,Cartão de Débito,Conta Corrente Principal
2024-01-17,3000.00,SALÁRIO MENSAL,Receita,Transferência,Conta Corrente Principal
2024-01-18,-89.90,NETFLIX ASSINATURA,Lazer,Cartão de Crédito,Conta Corrente Principal
2024-01-19,-25.00,FARMÁCIA XYZ,Saúde,Cartão de Débito,Conta Corrente Principal
```

## Regras de Validação

1. **Data**: Deve estar no formato YYYY-MM-DD
2. **Valor**: 
   - Números decimais separados por ponto (.)
   - Negativo para despesas (-150.50)
   - Positivo para receitas (3000.00)
3. **Descrição**: Máximo de 255 caracteres
4. **Categoria**: Se não informada, será classificada automaticamente pela IA
5. **Método de Pagamento**: Valores aceitos:
   - Cartão de Crédito
   - Cartão de Débito
   - Transferência
   - Dinheiro
   - PIX
   - Boleto

## Processo de Importação

1. Usuário faz upload do arquivo CSV
2. Sistema valida formato e dados
3. Sistema classifica automaticamente transações sem categoria (usando IA)
4. Sistema agrupa transações duplicadas (mesma data, valor e descrição)
5. Usuário revisa e confirma importação
6. Transações são criadas no sistema

## Exemplo de Código de Validação

```typescript
interface CSVTransaction {
  data: string;
  valor: string;
  descricao: string;
  categoria?: string;
  metodo_pagamento?: string;
  conta?: string;
}

function validarLinhaCSV(linha: CSVTransaction): boolean {
  // Validar data
  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(linha.data)) {
    return false;
  }

  // Validar valor
  const valor = parseFloat(linha.valor);
  if (isNaN(valor) || valor === 0) {
    return false;
  }

  // Validar descrição
  if (!linha.descricao || linha.descricao.trim().length === 0) {
    return false;
  }

  return true;
}
```

## Suporte por Banco

### Nubank
- Exportar extrato em CSV
- Formato: data, descrição, valor (já vem formatado)

### Banco do Brasil
- Exportar extrato em CSV
- Formato: data, histórico, valor, saldo

### Itaú
- Exportar extrato em CSV
- Formato: data, descrição, débito, crédito

### Bradesco
- Exportar extrato em CSV
- Formato: data, descrição, valor

**Nota**: O sistema pode incluir conversores específicos para cada banco no futuro.

