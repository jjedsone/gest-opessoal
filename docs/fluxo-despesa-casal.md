# Fluxo: Registrar Despesa em Casal

Este documento descreve o fluxo completo de registro de despesa quando o usuário está em um relacionamento de casal.

## Passos do Fluxo

### 1. Usuário A abre "Registrar Despesa"

O usuário acessa a tela de registro de despesa através do menu ou botão de ação rápida.

### 2. Preenchimento dos Campos

O usuário preenche os seguintes campos:

- **Valor**: Valor da despesa (ex: R$ 150,00)
- **Categoria**: Categoria da despesa (ex: Alimentação, Transporte, Moradia)
- **Conta**: Escolhe entre "Conjunta" ou "Individual"
- **Descrição**: Descrição opcional da despesa
- **Data**: Data da transação (padrão: data atual)

### 3. Seleção de Conta Conjunta

Se o usuário selecionar "Conjunta", o sistema deve:

1. Verificar se há regra de divisão configurada para o casal
2. Aplicar a regra de divisão pré-configurada:
   - **50/50 (Equal Split)**: Divide igualmente entre os dois
   - **Proporcional**: Divide proporcionalmente às rendas de cada um
   - **Percentual**: Divide por percentuais fixos (ex: 60/40)
   - **Fixo**: Valor fixo para cada um

### 4. Criação da Transação

O sistema cria a transação no banco de dados com:

- Dados da transação (valor, categoria, data, etc.)
- Informação de que é uma conta conjunta
- Metadados da divisão aplicada (JSONB)

### 5. Geração de Lançamentos

Para cada parceiro, o sistema cria um lançamento:

- **Usuário A**: Lançamento de despesa com valor calculado conforme regra
- **Usuário B**: Lançamento de despesa com valor calculado conforme regra
- Ambos os lançamentos são vinculados à mesma transação original

### 6. Notificação para o Parceiro

O sistema envia uma notificação para o parceiro (Usuário B):

**Mensagem:**
"Despesa de R$X registrada na categoria Y. Sua parte: R$Z."

**Exemplo:**
"Despesa de R$150,00 registrada na categoria Alimentação. Sua parte: R$75,00."

### 7. Atualização de Saldos

O sistema atualiza:

- Saldo da conta conjunta (se aplicável)
- Saldo individual de cada parceiro
- Orçamento da categoria (se configurado)
- Progresso de metas (se a despesa impactar alguma meta)

## Exemplo Prático

### Cenário:
- João e Maria são casados
- Regra de divisão: 50/50 (Equal Split)
- João registra uma despesa de R$ 200,00 na categoria "Alimentação" como conta conjunta

### Processo:

1. João preenche o formulário:
   - Valor: R$ 200,00
   - Categoria: Alimentação
   - Conta: Conjunta
   - Descrição: "Supermercado"

2. Sistema aplica regra 50/50:
   - João: R$ 100,00
   - Maria: R$ 100,00

3. Sistema cria transação e lançamentos

4. Maria recebe notificação:
   "Despesa de R$200,00 registrada na categoria Alimentação. Sua parte: R$100,00."

5. Saldos atualizados:
   - Conta conjunta: -R$ 200,00
   - Saldo individual João: -R$ 100,00
   - Saldo individual Maria: -R$ 100,00

## Regras de Divisão Detalhadas

### 50/50 (Equal Split)
```
valor_usuario_a = valor_total / 2
valor_usuario_b = valor_total / 2
```

### Proporcional (baseado em renda)
```
renda_total = renda_a + renda_b
percentual_a = renda_a / renda_total
percentual_b = renda_b / renda_total

valor_usuario_a = valor_total * percentual_a
valor_usuario_b = valor_total * percentual_b
```

### Percentual Fixo
```
valor_usuario_a = valor_total * (percentual_a / 100)
valor_usuario_b = valor_total * (percentual_b / 100)
```

### Valor Fixo
```
valor_usuario_a = valor_fixo_a
valor_usuario_b = valor_total - valor_fixo_a
```

## Transparência

- Ambos os parceiros podem ver o histórico completo de transações
- Relatórios são compartilhados entre os dois
- Divergências podem ser resolvidas através do chat da IA ou suporte

