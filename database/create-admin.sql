-- Criar usuário admin padrão
-- Email: admin@finunity.com
-- Senha: admin123

-- Inserir usuário admin (senha hash de "admin123")
INSERT INTO users (nome, email, password_hash, tipo)
VALUES (
  'Administrador',
  'admin@finunity.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- Hash será gerado pelo script
  'solteiro'
)
ON CONFLICT (email) DO NOTHING;

-- Criar perfil para admin
INSERT INTO profiles (user_id, renda_mensal)
SELECT id, 0 FROM users WHERE email = 'admin@finunity.com'
ON CONFLICT (user_id) DO NOTHING;

-- Criar conta padrão para admin
INSERT INTO accounts (user_id, nome, tipo, saldo)
SELECT id, 'Conta Principal', 'corrente', 0 FROM users WHERE email = 'admin@finunity.com'
ON CONFLICT DO NOTHING;

