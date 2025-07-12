// Configuração da API base
const API_BASE_URL = 'http://localhost:5001/api'

// Função auxiliar para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Serviços de Funcionários
export const funcionariosAPI = {
  // Listar todos os funcionários
  listar: () => apiRequest('/funcionarios'),
  
  // Obter funcionário por ID
  obter: (id) => apiRequest(`/funcionarios/${id}`),
  
  // Criar novo funcionário
  criar: (dados) => apiRequest('/funcionarios', {
    method: 'POST',
    body: JSON.stringify(dados),
  }),
  
  // Atualizar funcionário
  atualizar: (id, dados) => apiRequest(`/funcionarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  }),
  
  // Deletar funcionário
  deletar: (id) => apiRequest(`/funcionarios/${id}`, {
    method: 'DELETE',
  }),
  
  // Buscar funcionários
  buscar: (termo) => apiRequest(`/funcionarios/buscar?q=${encodeURIComponent(termo)}`),
}

// Serviços de Pontos
export const pontosAPI = {
  // Listar pontos
  listar: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/pontos${queryString ? `?${queryString}` : ''}`)
  },
  
  // Obter ponto por ID
  obter: (id) => apiRequest(`/pontos/${id}`),
  
  // Registrar novo ponto
  registrar: (dados) => apiRequest('/pontos', {
    method: 'POST',
    body: JSON.stringify(dados),
  }),
  
  // Atualizar ponto
  atualizar: (id, dados) => apiRequest(`/pontos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  }),
  
  // Deletar ponto
  deletar: (id) => apiRequest(`/pontos/${id}`, {
    method: 'DELETE',
  }),
  
  // Relatório de pontos
  relatorio: (funcionarioId, dataInicio, dataFim) => 
    apiRequest(`/pontos/relatorio?funcionario_id=${funcionarioId}&data_inicio=${dataInicio}&data_fim=${dataFim}`),
}

// Serviços de Benefícios
export const beneficiosAPI = {
  // Listar benefícios
  listar: () => apiRequest('/beneficios'),
  
  // Obter benefício por ID
  obter: (id) => apiRequest(`/beneficios/${id}`),
  
  // Criar novo benefício
  criar: (dados) => apiRequest('/beneficios', {
    method: 'POST',
    body: JSON.stringify(dados),
  }),
  
  // Atualizar benefício
  atualizar: (id, dados) => apiRequest(`/beneficios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  }),
  
  // Deletar benefício
  deletar: (id) => apiRequest(`/beneficios/${id}`, {
    method: 'DELETE',
  }),
  
  // Benefícios de um funcionário
  funcionario: {
    listar: (funcionarioId) => apiRequest(`/funcionarios/${funcionarioId}/beneficios`),
    adicionar: (funcionarioId, dados) => apiRequest(`/funcionarios/${funcionarioId}/beneficios`, {
      method: 'POST',
      body: JSON.stringify(dados),
    }),
    atualizar: (funcionarioId, beneficioId, dados) => apiRequest(`/funcionarios/${funcionarioId}/beneficios/${beneficioId}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),
    remover: (funcionarioId, beneficioId) => apiRequest(`/funcionarios/${funcionarioId}/beneficios/${beneficioId}`, {
      method: 'DELETE',
    }),
    relatorio: (funcionarioId) => apiRequest(`/funcionarios/${funcionarioId}/beneficios/relatorio`),
  },
}

// Serviços de Rescisões
export const rescisoesAPI = {
  // Listar rescisões
  listar: () => apiRequest('/rescisoes'),
  
  // Obter rescisão por ID
  obter: (id) => apiRequest(`/rescisoes/${id}`),
  
  // Criar nova rescisão
  criar: (dados) => apiRequest('/rescisoes', {
    method: 'POST',
    body: JSON.stringify(dados),
  }),
  
  // Atualizar rescisão
  atualizar: (id, dados) => apiRequest(`/rescisoes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  }),
  
  // Deletar rescisão
  deletar: (id) => apiRequest(`/rescisoes/${id}`, {
    method: 'DELETE',
  }),
  
  // Recalcular rescisão
  recalcular: (id) => apiRequest(`/rescisoes/${id}/recalcular`, {
    method: 'POST',
  }),
  
  // Simular rescisão
  simular: (dados) => apiRequest('/rescisoes/simular', {
    method: 'POST',
    body: JSON.stringify(dados),
  }),
  
  // Relatório de rescisões
  relatorio: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/rescisoes/relatorio${queryString ? `?${queryString}` : ''}`)
  },
}

// Exportação padrão com todos os serviços
const api = {
  funcionarios: funcionariosAPI,
  pontos: pontosAPI,
  beneficios: beneficiosAPI,
  rescisoes: rescisoesAPI,
}

export default api

