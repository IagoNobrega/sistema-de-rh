Sistema de RH - Gestão de Recursos Humanos
Um sistema completo para gestão de recursos humanos desenvolvido com Flask (backend) e React (frontend).

Funcionalidades
📊 Painel
Visão geral dos funcionários ativos
Estatísticas de horas trabalhadas
Resumo de benefícios ativos
Gráfico de evolução de funcionários vs rescisões
👥 Gestão de Funcionários
Cadastro completo de funcionários
Edição de dados pessoais e profissionais
Controle de status (ativo/inativo)
Busca e filtros avançados
⏰ Controle de Ponto
Registro de entrada e saída
Relatórios de horas trabalhadas
Controle de horas extras
Histórico completo de pontos
🎁 Gestão de Benefícios
Cadastro de tipos de benefícios
Associação de benefícios aos funcionários
Controle de valores e vigilância
Relatórios de custos com benefícios
📋 Cálculo de Rescisões
Simulador de rescisão com cálculos automáticos
Diferentes tipos de rescisão (demissão, pedido, acordo)
Cálculo de verbas rescisórias (férias, 13º, FGTS, etc.)
Geração de relatórios detalhados
Tecnologias Utilizadas
Backend (Flask)
Flask : Estrutura web Python
SQLAlchemy : ORM para banco de dados
Flask-CORS : Suporte a CORS
SQLite : Banco de dados local
Frontend (React)
React : Biblioteca para interface do usuário
Vite : ferramenta de construção e servidor de desenvolvimento
Tailwind CSS : Framework CSS útil
Shadcn/UI : componentes de interface
Lucide React : Ícones
React Router : Roteamento
Estrutura do Projeto

sistema-rh/
├── src/
│   ├── models/          # Modelos de dados
│   │   ├── user.py
│   │   ├── funcionario.py
│   │   ├── ponto.py
│   │   ├── beneficio.py
│   │   └── rescisao.py
│   ├── routes/          # Rotas da API
│   │   ├── user.py
│   │   ├── funcionario.py
│   │   ├── ponto.py
│   │   ├── beneficio.py
│   │   └── rescisao.py
│   ├── static/          # Arquivos estáticos (frontend build)
│   ├── database/        # Banco de dados SQLite
│   └── main.py          # Aplicação principal
├── venv/                # Ambiente virtual Python
└── requirements.txt     # Dependências Python

sistema-rh-frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços de API
│   └── App.jsx         # Componente principal
├── dist/               # Build de produção
└── package.json        # Dependências Node.js
Como Executar
Pré-requisitos
Python 3.11+
Node.js 20+
pnpm
Backend (Flask)
Ativo ou ambiente virtual:
cd sistema-rh
source venv/bin/activate
Instalar as dependências:
pip install -r requirements.txt
Execute o servidor:
python src/main.py
O backend estará disponível em:http://localhost:5000

Frontend (React)
Instalar as dependências:
cd sistema-rh-frontend
pnpm install
Execute o servidor de desenvolvimento:
pnpm run dev
O frontend estará disponível em:http://localhost:5173

Sistema Integrado
Para executar o sistema completo integrado:

Faça o build do frontend:
cd sistema-rh-frontend
pnpm run build
Copie os arquivos para o Flask:
cp -r dist/* ../sistema-rh/src/static/
Execute apenas o servidor Flask:
cd sistema-rh
source venv/bin/activate
python src/main.py
O sistema completo estará disponível em:http://localhost:5000

Pontos de extremidade da API
Funcionários
GET /api/funcionarios- Listar funcionários
POST /api/funcionarios- Criar funcionário
GET /api/funcionarios/{id}- Obter funcionário
PUT /api/funcionarios/{id}- Atualizar funcionário
DELETE /api/funcionarios/{id}- Excluir funcionário
Pontos
GET /api/pontos- Listar pontos
POST /api/pontos- Registrador ponto
GET /api/pontos/{id}- Obter ponto
PUT /api/pontos/{id}- Atualizar ponto
DELETE /api/pontos/{id}- Apagar ponto
Benefícios
GET /api/beneficios- Listar benefícios
POST /api/beneficios- Criar benefício
GET /api/beneficios/{id}- Obter benefício
PUT /api/beneficios/{id}- Atualizar benefício
DELETE /api/beneficios/{id}- Excluir benefício
Rescisões
GET /api/rescisoes- Listar rescisões
POST /api/rescisoes- Criar rescisão
GET /api/rescisoes/{id}- Obter rescisão
PUT /api/rescisoes/{id}- Atualizar rescisão
DELETE /api/rescisoes/{id}- Excluir rescisão
POST /api/rescisoes/simular- Rescisão Simular
Funcionalidades Principais
Cálculo de Rescisões
O sistema inclui um simulador completo de rescisões que calcula automaticamente:

Saldo de Salário : Proporcional aos dias trabalhados no mês
Férias Vencidas : Baseado em anos completos de trabalho
Férias Proporcionais : Baseado nos meses do ano atual
13º Salário Proporcional : Calculado pelos meses de trabalho
Aviso Prévio : Indenizado ou trabalhado
FGTS : Valor para saque e multa de 40%
Descontos : INSS e IRRF
Controle de Ponto
Registro automático de dados/hora
Cálculo de horas trabalhadas
Controle de horas extras
Relatórios por período
Gestão de Benefícios
Diferentes tipos de benefícios
Controle de valores e vigilância
Associação múltipla funcionário-benefício
Relatórios de custos
Segurança e Boas Práticas
Validação de dados no frontend e backend
Sanitização de entradas
Controle de CORS configurado
Estrutura modular e escalável
Código documentado e organizado
Suporte e Manutenção
Para suporte técnico ou dúvidas sobre o sistema:

Verifique a documentação da API
Consulte os logs do servidor Flask
Use uma página de testes integrados ( /testes) para verificar a conectividade
