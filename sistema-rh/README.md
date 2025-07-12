# Sistema de RH - Gestão de Recursos Humanos

Um sistema completo para gestão de recursos humanos desenvolvido com Flask (backend) e React (frontend).

## Funcionalidades

### 📊 Dashboard
- Visão geral dos funcionários ativos
- Estatísticas de horas trabalhadas
- Resumo de benefícios ativos
- Gráfico de evolução de funcionários vs rescisões

### 👥 Gestão de Funcionários
- Cadastro completo de funcionários
- Edição de dados pessoais e profissionais
- Controle de status (ativo/inativo)
- Busca e filtros avançados

### ⏰ Controle de Ponto
- Registro de entrada e saída
- Relatórios de horas trabalhadas
- Controle de horas extras
- Histórico completo de pontos

### 🎁 Gestão de Benefícios
- Cadastro de tipos de benefícios
- Associação de benefícios aos funcionários
- Controle de valores e vigência
- Relatórios de custos com benefícios

### 📋 Cálculo de Rescisões
- Simulador de rescisão com cálculos automáticos
- Diferentes tipos de rescisão (demissão, pedido, acordo)
- Cálculo de verbas rescisórias (férias, 13º, FGTS, etc.)
- Geração de relatórios detalhados

## Tecnologias Utilizadas

### Backend (Flask)
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para banco de dados
- **Flask-CORS**: Suporte a CORS
- **SQLite**: Banco de dados local

### Frontend (React)
- **React**: Biblioteca para interface de usuário
- **Vite**: Build tool e servidor de desenvolvimento
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn/UI**: Componentes de interface
- **Lucide React**: Ícones
- **React Router**: Roteamento

## Estrutura do Projeto

```
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
```

## Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- pnpm

### Backend (Flask)

1. Ative o ambiente virtual:
```bash
cd sistema-rh
source venv/bin/activate
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute o servidor:
```bash
python src/main.py
```

O backend estará disponível em: `http://localhost:5000`

### Frontend (React)

1. Instale as dependências:
```bash
cd sistema-rh-frontend
pnpm install
```

2. Execute o servidor de desenvolvimento:
```bash
pnpm run dev
```

O frontend estará disponível em: `http://localhost:5173`

### Sistema Integrado

Para executar o sistema completo integrado:

1. Faça o build do frontend:
```bash
cd sistema-rh-frontend
pnpm run build
```

2. Copie os arquivos para o Flask:
```bash
cp -r dist/* ../sistema-rh/src/static/
```

3. Execute apenas o servidor Flask:
```bash
cd sistema-rh
source venv/bin/activate
python src/main.py
```

O sistema completo estará disponível em: `http://localhost:5000`

## API Endpoints

### Funcionários
- `GET /api/funcionarios` - Listar funcionários
- `POST /api/funcionarios` - Criar funcionário
- `GET /api/funcionarios/{id}` - Obter funcionário
- `PUT /api/funcionarios/{id}` - Atualizar funcionário
- `DELETE /api/funcionarios/{id}` - Deletar funcionário

### Pontos
- `GET /api/pontos` - Listar pontos
- `POST /api/pontos` - Registrar ponto
- `GET /api/pontos/{id}` - Obter ponto
- `PUT /api/pontos/{id}` - Atualizar ponto
- `DELETE /api/pontos/{id}` - Deletar ponto

### Benefícios
- `GET /api/beneficios` - Listar benefícios
- `POST /api/beneficios` - Criar benefício
- `GET /api/beneficios/{id}` - Obter benefício
- `PUT /api/beneficios/{id}` - Atualizar benefício
- `DELETE /api/beneficios/{id}` - Deletar benefício

### Rescisões
- `GET /api/rescisoes` - Listar rescisões
- `POST /api/rescisoes` - Criar rescisão
- `GET /api/rescisoes/{id}` - Obter rescisão
- `PUT /api/rescisoes/{id}` - Atualizar rescisão
- `DELETE /api/rescisoes/{id}` - Deletar rescisão
- `POST /api/rescisoes/simular` - Simular rescisão

## Funcionalidades Principais

### Cálculo de Rescisões
O sistema inclui um simulador completo de rescisões que calcula automaticamente:

- **Saldo de Salário**: Proporcional aos dias trabalhados no mês
- **Férias Vencidas**: Baseado nos anos completos de trabalho
- **Férias Proporcionais**: Baseado nos meses do ano atual
- **13º Salário Proporcional**: Calculado pelos meses trabalhados
- **Aviso Prévio**: Indenizado ou trabalhado
- **FGTS**: Valor para saque e multa de 40%
- **Descontos**: INSS e IRRF

### Controle de Ponto
- Registro automático de data/hora
- Cálculo de horas trabalhadas
- Controle de horas extras
- Relatórios por período

### Gestão de Benefícios
- Diferentes tipos de benefícios
- Controle de valores e vigência
- Associação múltipla funcionário-benefício
- Relatórios de custos

## Segurança e Boas Práticas

- Validação de dados no frontend e backend
- Sanitização de entradas
- Controle de CORS configurado
- Estrutura modular e escalável
- Código documentado e organizado

## Suporte e Manutenção

Para suporte técnico ou dúvidas sobre o sistema:
- Verifique a documentação da API
- Consulte os logs do servidor Flask
- Use a página de testes integrada (`/testes`) para verificar a conectividade

## Licença

Este sistema foi desenvolvido para uso interno da empresa.

