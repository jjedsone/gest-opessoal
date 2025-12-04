import * as admin from 'firebase-admin';

const db = admin.firestore();

// Tipos de dados
export interface User {
  id?: string;
  nome: string;
  email: string;
  password?: string; // Hash da senha
  estado_civil: 'solteiro' | 'casal';
  renda_mensal?: number;
  conta_conjunta?: boolean;
  meta_principal?: string;
  permitir_ia?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Profile {
  id?: string;
  user_id: string;
  nome: string;
  email: string;
  estado_civil: 'solteiro' | 'casal';
  renda_mensal?: number;
  created_at?: Date;
}

export interface Account {
  id?: string;
  user_id: string;
  nome: string;
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'outro';
  saldo: number;
  conta_conjunta?: boolean;
  created_at?: Date;
}

export interface Transaction {
  id?: string;
  user_id: string;
  account_id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  subcategoria?: string;
  valor: number;
  data: Date | string;
  recorrente?: boolean;
  frequencia?: string;
  nota?: string;
  metodo_pagamento?: string;
  conta_origem?: 'conjunta' | 'individual';
  descricao?: string;
  created_at?: Date;
}

export interface Goal {
  id?: string;
  user_id: string;
  nome: string;
  valor_objetivo: number;
  valor_atual: number;
  prazo?: Date | string;
  categoria?: string;
  created_at?: Date;
}

export interface Budget {
  id?: string;
  user_id: string;
  categoria: string;
  valor_limite: number;
  mes: string; // Formato: YYYY-MM
  valor_gasto?: number;
  created_at?: Date;
}

export interface DivisionRule {
  id?: string;
  user_id: string;
  categoria: string;
  tipo_divisao: 'igual' | 'percentual' | 'valor_fixo';
  percentual_user1?: number;
  percentual_user2?: number;
  valor_fixo_user1?: number;
  valor_fixo_user2?: number;
  created_at?: Date;
}

export interface Notification {
  id?: string;
  user_id: string;
  tipo: 'info' | 'warning' | 'success' | 'error';
  titulo: string;
  mensagem: string;
  lida?: boolean;
  created_at?: Date;
}

export interface AISuggestion {
  id?: string;
  user_id: string;
  tipo: 'economia' | 'investimento' | 'meta' | 'categoria';
  titulo: string;
  descricao: string;
  acao_sugerida?: string;
  aceita?: boolean;
  created_at?: Date;
}

// Serviço Firestore
export const firestoreService = {
  // Users
  async createUser(userData: User): Promise<string> {
    const docRef = await db.collection('users').add({
      ...userData,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  },

  async getUserById(userId: string): Promise<User | null> {
    const doc = await db.collection('users').doc(userId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as User;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const snapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    await db.collection('users').doc(userId).update({
      ...userData,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  },

  // Accounts
  async createAccount(accountData: Account): Promise<string> {
    const docRef = await db.collection('accounts').add({
      ...accountData,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  },

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    const snapshot = await db.collection('accounts')
      .where('user_id', '==', userId)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Account));
  },

  async updateAccount(accountId: string, accountData: Partial<Account>): Promise<void> {
    await db.collection('accounts').doc(accountId).update(accountData);
  },

  async deleteAccount(accountId: string): Promise<void> {
    await db.collection('accounts').doc(accountId).delete();
  },

  // Transactions
  async createTransaction(transactionData: Transaction): Promise<string> {
    const docRef = await db.collection('transactions').add({
      ...transactionData,
      data: admin.firestore.Timestamp.fromDate(
        transactionData.data instanceof Date 
          ? transactionData.data 
          : new Date(transactionData.data)
      ),
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  },

  async getTransactionsByUserId(userId: string, filters?: any): Promise<Transaction[]> {
    let query: FirebaseFirestore.Query = db.collection('transactions')
      .where('user_id', '==', userId);
    
    if (filters?.tipo) {
      query = query.where('tipo', '==', filters.tipo);
    }
    
    if (filters?.categoria) {
      query = query.where('categoria', '==', filters.categoria);
    }
    
    const snapshot = await query.orderBy('data', 'desc').get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        data: data.data?.toDate?.() || data.data,
      } as Transaction;
    });
  },

  async deleteTransaction(transactionId: string): Promise<void> {
    await db.collection('transactions').doc(transactionId).delete();
  },

  // Goals
  async createGoal(goalData: Goal): Promise<string> {
    const docRef = await db.collection('goals').add({
      ...goalData,
      prazo: goalData.prazo 
        ? admin.firestore.Timestamp.fromDate(
            goalData.prazo instanceof Date 
              ? goalData.prazo 
              : new Date(goalData.prazo)
          )
        : null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  },

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    const snapshot = await db.collection('goals')
      .where('user_id', '==', userId)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        prazo: data.prazo?.toDate?.() || data.prazo,
      } as Goal;
    });
  },

  async updateGoal(goalId: string, goalData: Partial<Goal>): Promise<void> {
    const updateData: any = { ...goalData };
    if (goalData.prazo) {
      updateData.prazo = admin.firestore.Timestamp.fromDate(
        goalData.prazo instanceof Date 
          ? goalData.prazo 
          : new Date(goalData.prazo)
      );
    }
    await db.collection('goals').doc(goalId).update(updateData);
  },

  // Budgets
  async createBudget(budgetData: Budget): Promise<string> {
    const docRef = await db.collection('budgets').add({
      ...budgetData,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  },

  async getBudgetsByUserId(userId: string, mes?: string): Promise<Budget[]> {
    let query: FirebaseFirestore.Query = db.collection('budgets')
      .where('user_id', '==', userId);
    
    if (mes) {
      query = query.where('mes', '==', mes);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Budget));
  },

  async updateBudget(budgetId: string, budgetData: Partial<Budget>): Promise<void> {
    await db.collection('budgets').doc(budgetId).update(budgetData);
  },

  // Notifications
  async createNotification(notificationData: Notification): Promise<string> {
    const docRef = await db.collection('notifications').add({
      ...notificationData,
      lida: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  },

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    const snapshot = await db.collection('notifications')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.(),
    } as Notification));
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await db.collection('notifications').doc(notificationId).update({ lida: true });
  },
};

