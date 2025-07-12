import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../services/api'

const TestePage = () => {
  const [testes, setTestes] = useState([])
  const [executando, setExecutando] = useState(false)

  const testesAPI = [
    {
      nome: 'Listar Funcionários',
      funcao: () => api.funcionarios.listar(),
      esperado: 'Array de funcionários'
    },
    {
      nome: 'Listar Benefícios',
      funcao: () => api.beneficios.listar(),
      esperado: 'Array de benefícios'
    },
    {
      nome: 'Listar Pontos',
      funcao: () => api.pontos.listar(),
      esperado: 'Array de pontos'
    },
    {
      nome: 'Listar Rescisões',
      funcao: () => api.rescisoes.listar(),
      esperado: 'Array de rescisões'
    },
    {
      nome: 'Criar Funcionário',
      funcao: () => api.funcionarios.criar({
        nome: 'Teste Usuario',
        cpf: '000.000.000-00',
        email: 'teste@teste.com',
        cargo: 'Testador',
        salario_base: 5000,
        data_admissao: '2024-01-01'
      }),
      esperado: 'Funcionário criado'
    },
    {
      nome: 'Simular Rescisão',
      funcao: () => api.rescisoes.simular({
        funcionario_id: '1',
        tipo_rescisao: 'demissao_sem_justa_causa',
        data_rescisao: '2024-01-15',
        aviso_previo_indenizado: true
      }),
      esperado: 'Simulação de rescisão'
    }
  ]

  const executarTeste = async (teste, index) => {
    const novosResultados = [...testes]
    novosResultados[index] = { ...teste, status: 'executando' }
    setTestes(novosResultados)

    try {
      const resultado = await teste.funcao()
      novosResultados[index] = {
        ...teste,
        status: 'sucesso',
        resultado: resultado,
        erro: null
      }
    } catch (error) {
      novosResultados[index] = {
        ...teste,
        status: 'erro',
        resultado: null,
        erro: error.message
      }
    }

    setTestes(novosResultados)
  }

  const executarTodosTestes = async () => {
    setExecutando(true)
    setTestes(testesAPI.map(teste => ({ ...teste, status: 'pendente' })))

    for (let i = 0; i < testesAPI.length; i++) {
      await executarTeste(testesAPI[i], i)
      // Pequena pausa entre os testes
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setExecutando(false)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'erro':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'executando':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sucesso':
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
      case 'erro':
        return <Badge variant="destructive">Erro</Badge>
      case 'executando':
        return <Badge className="bg-blue-100 text-blue-800">Executando</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  const resumo = {
    total: testes.length,
    sucesso: testes.filter(t => t.status === 'sucesso').length,
    erro: testes.filter(t => t.status === 'erro').length,
    pendente: testes.filter(t => t.status === 'pendente' || !t.status).length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Testes de Integração</h1>
        <p className="text-gray-600">Verificação da comunicação entre frontend e backend</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resumo.sucesso}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{resumo.erro}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{resumo.pendente}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex gap-4">
        <Button 
          onClick={executarTodosTestes} 
          disabled={executando}
          className="flex items-center gap-2"
        >
          {executando && <Loader2 className="h-4 w-4 animate-spin" />}
          {executando ? 'Executando Testes...' : 'Executar Todos os Testes'}
        </Button>
      </div>

      {/* Status da API */}
      <Alert>
        <AlertDescription>
          <strong>URL da API:</strong> http://localhost:5001/api
          <br />
          <strong>Status:</strong> {executando ? 'Testando...' : 'Pronto para teste'}
        </AlertDescription>
      </Alert>

      {/* Lista de Testes */}
      <div className="space-y-4">
        {(testes.length > 0 ? testes : testesAPI).map((teste, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(teste.status)}
                  <div>
                    <CardTitle className="text-lg">{teste.nome}</CardTitle>
                    <CardDescription>{teste.esperado}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(teste.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => executarTeste(teste, index)}
                    disabled={executando || teste.status === 'executando'}
                  >
                    Testar
                  </Button>
                </div>
              </div>
            </CardHeader>
            {(teste.resultado || teste.erro) && (
              <CardContent>
                {teste.status === 'sucesso' && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Resultado:</h4>
                    <pre className="text-sm text-green-700 overflow-auto max-h-40">
                      {JSON.stringify(teste.resultado, null, 2)}
                    </pre>
                  </div>
                )}
                {teste.status === 'erro' && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Erro:</h4>
                    <p className="text-sm text-red-700">{teste.erro}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TestePage

