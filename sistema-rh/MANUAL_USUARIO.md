# Manual do Usuário - Sistema de RH

## Introdução

Este manual irá guiá-lo através das principais funcionalidades do Sistema de RH, explicando como usar cada módulo de forma eficiente.

## Acessando o Sistema

1. Abra seu navegador web
2. Acesse: `http://localhost:5000`
3. O sistema carregará automaticamente o dashboard principal

## Navegação

O sistema possui um menu lateral com as seguintes opções:
- **Dashboard**: Visão geral do sistema
- **Funcionários**: Gestão de funcionários
- **Controle de Ponto**: Registro e controle de horários
- **Benefícios**: Gestão de benefícios
- **Rescisões**: Cálculo e gestão de rescisões
- **Testes API**: Página para verificar conectividade (uso técnico)

## Dashboard

A página inicial apresenta:
- **Total de Funcionários**: Número de funcionários ativos
- **Horas Trabalhadas**: Total de horas do mês atual
- **Benefícios Ativos**: Quantidade de tipos de benefícios
- **Rescisões**: Número e valor total das rescisões
- **Gráfico**: Evolução mensal de funcionários vs rescisões

## Gestão de Funcionários

### Cadastrar Novo Funcionário

1. Clique em **"Funcionários"** no menu lateral
2. Clique no botão **"Novo Funcionário"**
3. Preencha os campos obrigatórios:
   - Nome completo
   - CPF (formato: 000.000.000-00)
   - Email
   - Telefone
   - Cargo
   - Departamento
   - Salário base
   - Data de admissão
4. Clique em **"Salvar"**

### Editar Funcionário

1. Na lista de funcionários, clique no ícone de edição (lápis)
2. Modifique os campos desejados
3. Clique em **"Salvar Alterações"**

### Buscar Funcionários

- Use a barra de busca para encontrar funcionários por nome, cargo ou departamento
- Os resultados são filtrados automaticamente conforme você digita

## Controle de Ponto

### Registrar Ponto

1. Acesse **"Controle de Ponto"**
2. Clique em **"Registrar Ponto"**
3. Selecione o funcionário
4. Escolha o tipo de registro:
   - Entrada
   - Saída para Almoço
   - Retorno do Almoço
   - Saída
5. A data e hora são registradas automaticamente
6. Clique em **"Registrar"**

### Visualizar Relatórios

- Use os filtros de data para ver registros de períodos específicos
- O sistema calcula automaticamente as horas trabalhadas
- Horas extras são destacadas quando ultrapassam 8 horas diárias

## Gestão de Benefícios

### Cadastrar Benefício

1. Acesse **"Benefícios"**
2. Clique em **"Novo Benefício"**
3. Preencha:
   - Nome do benefício
   - Descrição
   - Valor
   - Tipo (Vale Refeição, Vale Transporte, Plano de Saúde, etc.)
4. Clique em **"Salvar"**

### Associar Benefício a Funcionário

1. Na lista de benefícios, clique em **"Gerenciar Funcionários"**
2. Selecione os funcionários que receberão o benefício
3. Defina a data de início
4. Clique em **"Associar"**

### Relatórios de Benefícios

- Visualize o custo total por benefício
- Veja quais funcionários possuem cada benefício
- Acompanhe o histórico de concessões

## Cálculo de Rescisões

### Simular Rescisão

1. Acesse **"Rescisões"**
2. Clique em **"Simulador"**
3. Preencha os dados:
   - Selecione o funcionário
   - Escolha o tipo de rescisão:
     - Demissão sem Justa Causa
     - Demissão por Justa Causa
     - Pedido de Demissão
     - Acordo Mútuo
   - Data da rescisão
   - Marque se o aviso prévio será indenizado
4. Clique em **"Simular Rescisão"**
5. O sistema calculará automaticamente todos os valores

### Processar Rescisão

1. Após simular, se os valores estiverem corretos
2. Clique em **"Nova Rescisão"**
3. Preencha os mesmos dados da simulação
4. Adicione observações se necessário
5. Clique em **"Processar Rescisão"**

### Entendendo os Cálculos

O sistema calcula automaticamente:

**Verbas a Receber:**
- **Saldo de Salário**: Dias trabalhados no mês da rescisão
- **Férias Vencidas**: Períodos de férias não gozados (anos completos)
- **Férias Proporcionais**: Proporcional aos meses do ano atual
- **13º Proporcional**: Baseado nos meses trabalhados no ano
- **Aviso Prévio**: Valor do salário (se indenizado)
- **FGTS para Saque**: Valor disponível para saque
- **Multa FGTS**: 40% sobre o FGTS (demissão sem justa causa)

**Descontos:**
- **INSS**: Desconto previdenciário sobre as verbas
- **IRRF**: Imposto de renda (quando aplicável)

## Dicas de Uso

### Boas Práticas

1. **Backup Regular**: Faça backup do arquivo de banco de dados regularmente
2. **Dados Consistentes**: Mantenha os dados dos funcionários sempre atualizados
3. **Registros Diários**: Registre os pontos diariamente para maior precisão
4. **Simulações**: Sempre simule rescisões antes de processá-las definitivamente

### Solução de Problemas

**Sistema não carrega:**
- Verifique se o servidor Flask está rodando
- Confirme se está acessando `http://localhost:5000`

**Dados não aparecem:**
- Verifique a conexão com o banco de dados
- Use a página de "Testes API" para verificar conectividade

**Cálculos incorretos:**
- Verifique se os dados do funcionário estão corretos
- Confirme as datas de admissão e rescisão
- Revise o tipo de rescisão selecionado

## Suporte

Para dúvidas ou problemas:
1. Consulte este manual
2. Verifique os logs do sistema
3. Use a funcionalidade de testes integrada
4. Entre em contato com o suporte técnico

## Atualizações

O sistema pode receber atualizações que incluam:
- Novas funcionalidades
- Melhorias nos cálculos
- Correções de bugs
- Otimizações de performance

Sempre consulte a documentação atualizada após atualizações do sistema.

