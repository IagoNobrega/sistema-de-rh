import { useState, useEffect } from 'react'
import { Plus, Search, Calculator, FileText, DollarSign, Calendar, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'

const RescisoesPage = () => {
  const [rescisoes, setRescisoes] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false)
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false)
  const [rescisaoSelecionada, setRescisaoSelecionada] = useState(null)
  const [simulacao, setSimulacao] = useState(null)
  const [formData, setFormData] = useState({
    funcionario_id: '',
    tipo_rescisao: '',
    data_rescisao: '',
    data_aviso_previo: '',
    aviso_previo_indenizado: false,
    dias_aviso_previo: '30',
    observacoes: ''
  })

  // Dados simulados
  const funcionariosSimulados = [
    { 
      id: 1, 
      nome: 'Maria Silva', 
      cargo: 'Desenvolvedora Senior',
      salario_base: 8000.00,
      data_admissao: '2022-01-15',
      status: 'ativo'
    },
    { 
      id: 2, 
      nome: 'João Santos', 
      cargo: 'Analista de RH',
      salario_base: 5500.00,
      data_admissao: '2021-06-10',
      status: 'ativo'
    },
    { 
      id: 3, 
      nome: 'Ana Costa', 
      cargo: 'Gerente de Vendas',
      salario_base: 12000.00,
      data_admissao: '2020-03-20',
      status: 'demitido'
    }
  ]

  const rescisoesSimuladas = [
    {
      id: 1,
      funcionario_id: 3,
      funcionario_nome: 'Ana Costa',
      funcionario_cargo: 'Gerente de Vendas',
      tipo_rescisao: 'demissao_sem_justa_causa',
      data_rescisao: '2024-01-15',
      data_aviso_previo: '2023-12-15',
      aviso_previo_indenizado: true,
      dias_aviso_previo: 30,
      saldo_salario: 6000.00,
      ferias_vencidas: 12000.00,
      ferias_proporcionais: 4000.00,
      decimo_terceiro_proporcional: 1000.00,
      aviso_previo_valor: 12000.00,
      multa_fgts: 3840.00,
      fgts_saque: 9600.00,
      desconto_inss: 1680.00,
      desconto_irrf: 0.00,
      outros_descontos: 0.00,
      valor_total_bruto: 48440.00,
      valor_total_liquido: 46760.00,
      observacoes: 'Rescisão por reestruturação da empresa'
    }
  ]

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setFuncionarios(funcionariosSimulados)
      setRescisoes(rescisoesSimuladas)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredRescisoes = rescisoes.filter(rescisao =>
    rescisao.funcionario_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rescisao.tipo_rescisao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const funcionariosAtivos = funcionarios.filter(f => f.status === 'ativo')

  const calcularRescisao = (funcionario, dadosRescisao) => {
    const dataAdmissao = new Date(funcionario.data_admissao)
    const dataRescisao = new Date(dadosRescisao.data_rescisao)
    
    // Cálculo simplificado para demonstração
    const mesesTrabalhados = Math.floor((dataRescisao - dataAdmissao) / (1000 * 60 * 60 * 24 * 30))
    const anosTrabalhados = Math.floor(mesesTrabalhados / 12)
    
    // Saldo de salário (proporcional aos dias do mês)
    const diasMes = dataRescisao.getDate()
    const saldoSalario = (funcionario.salario_base / 30) * diasMes
    
    // Férias vencidas (anos completos)
    const feriasVencidas = funcionario.salario_base * anosTrabalhados
    
    // Férias proporcionais (meses do ano atual)
    const mesesAnoAtual = mesesTrabalhados % 12
    const feriasProporcionais = mesesAnoAtual >= 1 ? (funcionario.salario_base / 12) * mesesAnoAtual : 0
    
    // 13º proporcional
    const decimoTerceiroProporcionais = (funcionario.salario_base / 12) * (mesesAnoAtual + 1)
    
    // Aviso prévio
    const avisoPrevioValor = dadosRescisao.tipo_rescisao === 'demissao_sem_justa_causa' && dadosRescisao.aviso_previo_indenizado 
      ? funcionario.salario_base : 0
    
    // FGTS (aproximado)
    const fgtsTotal = funcionario.salario_base * 0.08 * mesesTrabalhados
    const multaFgts = dadosRescisao.tipo_rescisao === 'demissao_sem_justa_causa' ? fgtsTotal * 0.4 : 0
    const fgtsSaque = dadosRescisao.tipo_rescisao === 'demissao_sem_justa_causa' ? fgtsTotal : 0
    
    // Descontos (simplificado)
    const valorBruto = saldoSalario + feriasVencidas + feriasProporcionais + decimoTerceiroProporcionais + avisoPrevioValor
    const descontoInss = valorBruto * 0.11 // Simplificado
    const descontoIrrf = 0 // Simplificado
    
    const valorTotalBruto = valorBruto + multaFgts + fgtsSaque
    const valorTotalLiquido = valorTotalBruto - descontoInss - descontoIrrf
    
    return {
      saldo_salario: saldoSalario,
      ferias_vencidas: feriasVencidas,
      ferias_proporcionais: feriasProporcionais,
      decimo_terceiro_proporcional: decimoTerceiroProporcionais,
      aviso_previo_valor: avisoPrevioValor,
      multa_fgts: multaFgts,
      fgts_saque: fgtsSaque,
      desconto_inss: descontoInss,
      desconto_irrf: descontoIrrf,
      outros_descontos: 0,
      valor_total_bruto: valorTotalBruto,
      valor_total_liquido: valorTotalLiquido
    }
  }

  const handleSimular = () => {
    if (!formData.funcionario_id || !formData.tipo_rescisao || !formData.data_rescisao) {
      alert('Preencha os campos obrigatórios para simular')
      return
    }

    const funcionario = funcionarios.find(f => f.id.toString() === formData.funcionario_id)
    if (!funcionario) return

    const calculoRescisao = calcularRescisao(funcionario, formData)
    
    setSimulacao({
      funcionario,
      dados_rescisao: formData,
      calculo: calculoRescisao
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const funcionario = funcionarios.find(f => f.id.toString() === formData.funcionario_id)
    if (!funcionario) return

    const calculoRescisao = calcularRescisao(funcionario, formData)
    
    const novaRescisao = {
      id: Date.now(),
      funcionario_id: parseInt(formData.funcionario_id),
      funcionario_nome: funcionario.nome,
      funcionario_cargo: funcionario.cargo,
      ...formData,
      ...calculoRescisao
    }
    
    setRescisoes(prev => [...prev, novaRescisao])
    
    // Atualiza status do funcionário
    setFuncionarios(prev => prev.map(func => 
      func.id === parseInt(formData.funcionario_id)
        ? { ...func, status: 'demitido' }
        : func
    ))
    
    resetForm()
    setIsDialogOpen(false)
    setSimulacao(null)
  }

  const resetForm = () => {
    setFormData({
      funcionario_id: '',
      tipo_rescisao: '',
      data_rescisao: '',
      data_aviso_previo: '',
      aviso_previo_indenizado: false,
      dias_aviso_previo: '30',
      observacoes: ''
    })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getTipoRescisaoLabel = (tipo) => {
    const tipos = {
      demissao_sem_justa_causa: 'Demissão sem Justa Causa',
      demissao_justa_causa: 'Demissão por Justa Causa',
      pedido_demissao: 'Pedido de Demissão',
      acordo_mutuo: 'Acordo Mútuo'
    }
    return tipos[tipo] || tipo
  }

  const getStats = () => {
    const totalRescisoes = rescisoes.length
    const valorTotal = rescisoes.reduce((total, r) => total + r.valor_total_liquido, 0)
    const mediaValor = totalRescisoes > 0 ? valorTotal / totalRescisoes : 0
    
    return { totalRescisoes, valorTotal, mediaValor }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rescisões</h1>
          <p className="text-gray-600">Gerencie as rescisões de contrato dos funcionários</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isSimuladorOpen} onOpenChange={setIsSimuladorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                Simulador
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Simulador de Rescisão</DialogTitle>
                <DialogDescription>
                  Simule os cálculos de rescisão antes de processar
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sim_funcionario_id">Funcionário</Label>
                    <Select value={formData.funcionario_id} onValueChange={(value) => setFormData(prev => ({ ...prev, funcionario_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        {funcionariosAtivos.map(funcionario => (
                          <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                            {funcionario.nome} - {funcionario.cargo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sim_tipo_rescisao">Tipo de Rescisão</Label>
                    <Select value={formData.tipo_rescisao} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_rescisao: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demissao_sem_justa_causa">Demissão sem Justa Causa</SelectItem>
                        <SelectItem value="demissao_justa_causa">Demissão por Justa Causa</SelectItem>
                        <SelectItem value="pedido_demissao">Pedido de Demissão</SelectItem>
                        <SelectItem value="acordo_mutuo">Acordo Mútuo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sim_data_rescisao">Data da Rescisão</Label>
                    <Input
                      id="sim_data_rescisao"
                      type="date"
                      value={formData.data_rescisao}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_rescisao: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sim_aviso_previo_indenizado"
                      checked={formData.aviso_previo_indenizado}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, aviso_previo_indenizado: checked }))}
                    />
                    <Label htmlFor="sim_aviso_previo_indenizado">Aviso Prévio Indenizado</Label>
                  </div>

                  <Button onClick={handleSimular} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Simular Rescisão
                  </Button>
                </div>

                <div>
                  {simulacao ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Resultado da Simulação</CardTitle>
                        <CardDescription>
                          {simulacao.funcionario.nome} - {simulacao.funcionario.cargo}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Saldo Salário:</span>
                            <div className="font-medium">{formatCurrency(simulacao.calculo.saldo_salario)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Férias Vencidas:</span>
                            <div className="font-medium">{formatCurrency(simulacao.calculo.ferias_vencidas)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Férias Proporcionais:</span>
                            <div className="font-medium">{formatCurrency(simulacao.calculo.ferias_proporcionais)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">13º Proporcional:</span>
                            <div className="font-medium">{formatCurrency(simulacao.calculo.decimo_terceiro_proporcional)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Aviso Prévio:</span>
                            <div className="font-medium">{formatCurrency(simulacao.calculo.aviso_previo_valor)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Multa FGTS:</span>
                            <div className="font-medium">{formatCurrency(simulacao.calculo.multa_fgts)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">FGTS Saque:</span>
                            <div className="font-medium">{formatCurrency(simulacao.calculo.fgts_saque)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Desconto INSS:</span>
                            <div className="font-medium text-red-600">-{formatCurrency(simulacao.calculo.desconto_inss)}</div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Bruto:</span>
                            <span className="font-bold">{formatCurrency(simulacao.calculo.valor_total_bruto)}</span>
                          </div>
                          <div className="flex justify-between items-center text-lg">
                            <span className="font-medium">Total Líquido:</span>
                            <span className="font-bold text-green-600">{formatCurrency(simulacao.calculo.valor_total_liquido)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Preencha os dados e clique em "Simular Rescisão" para ver os cálculos
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSimuladorOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Rescisão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Rescisão</DialogTitle>
                <DialogDescription>
                  Processe uma nova rescisão de contrato
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="funcionario_id">Funcionário</Label>
                    <Select value={formData.funcionario_id} onValueChange={(value) => setFormData(prev => ({ ...prev, funcionario_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        {funcionariosAtivos.map(funcionario => (
                          <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                            {funcionario.nome} - {funcionario.cargo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tipo_rescisao">Tipo de Rescisão</Label>
                    <Select value={formData.tipo_rescisao} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_rescisao: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demissao_sem_justa_causa">Demissão sem Justa Causa</SelectItem>
                        <SelectItem value="demissao_justa_causa">Demissão por Justa Causa</SelectItem>
                        <SelectItem value="pedido_demissao">Pedido de Demissão</SelectItem>
                        <SelectItem value="acordo_mutuo">Acordo Mútuo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_rescisao">Data da Rescisão</Label>
                    <Input
                      id="data_rescisao"
                      type="date"
                      value={formData.data_rescisao}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_rescisao: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_aviso_previo">Data do Aviso Prévio</Label>
                    <Input
                      id="data_aviso_previo"
                      type="date"
                      value={formData.data_aviso_previo}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_aviso_previo: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aviso_previo_indenizado"
                    checked={formData.aviso_previo_indenizado}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, aviso_previo_indenizado: checked }))}
                  />
                  <Label htmlFor="aviso_previo_indenizado">Aviso Prévio Indenizado</Label>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    rows={3}
                    placeholder="Observações sobre a rescisão"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Processar Rescisão</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Rescisões</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRescisoes}</div>
            <p className="text-xs text-muted-foreground">
              Processadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.valorTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Em rescisões
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.mediaValor)}</div>
            <p className="text-xs text-muted-foreground">
              Por rescisão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar rescisões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredRescisoes.length} rescisão{filteredRescisoes.length !== 1 ? 'ões' : 'ão'}
        </Badge>
      </div>

      {/* Rescisões Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rescisões Processadas</CardTitle>
          <CardDescription>
            Histórico de rescisões de contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data Rescisão</TableHead>
                <TableHead>Valor Bruto</TableHead>
                <TableHead>Valor Líquido</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRescisoes.map((rescisao) => (
                <TableRow key={rescisao.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rescisao.funcionario_nome}</div>
                      <div className="text-sm text-gray-500">{rescisao.funcionario_cargo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTipoRescisaoLabel(rescisao.tipo_rescisao)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(rescisao.data_rescisao)}</TableCell>
                  <TableCell>{formatCurrency(rescisao.valor_total_bruto)}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(rescisao.valor_total_liquido)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRescisaoSelecionada(rescisao)
                        setIsDetalhesOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRescisoes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma rescisão encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? 'Tente ajustar os termos de busca'
                  : 'Comece processando a primeira rescisão'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Processar Primeira Rescisão
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Rescisão</DialogTitle>
            <DialogDescription>
              {rescisaoSelecionada?.funcionario_nome} - {rescisaoSelecionada?.funcionario_cargo}
            </DialogDescription>
          </DialogHeader>
          {rescisaoSelecionada && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Rescisão</Label>
                  <p className="font-medium">{getTipoRescisaoLabel(rescisaoSelecionada.tipo_rescisao)}</p>
                </div>
                <div>
                  <Label>Data da Rescisão</Label>
                  <p className="font-medium">{formatDate(rescisaoSelecionada.data_rescisao)}</p>
                </div>
              </div>

              <div>
                <Label>Cálculos da Rescisão</Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Saldo de Salário:</span>
                    <span>{formatCurrency(rescisaoSelecionada.saldo_salario)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Férias Vencidas:</span>
                    <span>{formatCurrency(rescisaoSelecionada.ferias_vencidas)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Férias Proporcionais:</span>
                    <span>{formatCurrency(rescisaoSelecionada.ferias_proporcionais)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>13º Proporcional:</span>
                    <span>{formatCurrency(rescisaoSelecionada.decimo_terceiro_proporcional)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aviso Prévio:</span>
                    <span>{formatCurrency(rescisaoSelecionada.aviso_previo_valor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multa FGTS (40%):</span>
                    <span>{formatCurrency(rescisaoSelecionada.multa_fgts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FGTS para Saque:</span>
                    <span>{formatCurrency(rescisaoSelecionada.fgts_saque)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Desconto INSS:</span>
                    <span>-{formatCurrency(rescisaoSelecionada.desconto_inss)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Bruto:</span>
                      <span>{formatCurrency(rescisaoSelecionada.valor_total_bruto)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-green-600">
                      <span>Total Líquido:</span>
                      <span>{formatCurrency(rescisaoSelecionada.valor_total_liquido)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {rescisaoSelecionada.observacoes && (
                <div>
                  <Label>Observações</Label>
                  <p className="mt-1 text-sm text-gray-600">{rescisaoSelecionada.observacoes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetalhesOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RescisoesPage

