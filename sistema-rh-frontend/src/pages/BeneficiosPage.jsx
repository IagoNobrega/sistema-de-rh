import { useState, useEffect } from 'react'
import { Plus, Search, Gift, Users, DollarSign, Edit, Trash2 } from 'lucide-react'
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

const BeneficiosPage = () => {
  const [beneficios, setBeneficios] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [funcionarioBeneficios, setFuncionarioBeneficios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isBeneficioDialogOpen, setIsBeneficioDialogOpen] = useState(false)
  const [isVinculoDialogOpen, setIsVinculoDialogOpen] = useState(false)
  const [editingBeneficio, setEditingBeneficio] = useState(null)
  const [beneficioFormData, setBeneficioFormData] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    valor_empresa: '',
    valor_funcionario: ''
  })
  const [vinculoFormData, setVinculoFormData] = useState({
    funcionario_id: '',
    beneficio_id: '',
    data_inicio: '',
    data_fim: '',
    valor_personalizado: ''
  })

  // Dados simulados
  const beneficiosSimulados = [
    {
      id: 1,
      nome: 'Vale Refeição',
      descricao: 'Auxílio alimentação para refeições',
      tipo: 'vale_refeicao',
      valor_empresa: 500.00,
      valor_funcionario: 50.00,
      ativo: true
    },
    {
      id: 2,
      nome: 'Plano de Saúde',
      descricao: 'Plano de saúde empresarial',
      tipo: 'plano_saude',
      valor_empresa: 300.00,
      valor_funcionario: 100.00,
      ativo: true
    },
    {
      id: 3,
      nome: 'Vale Transporte',
      descricao: 'Auxílio transporte público',
      tipo: 'vale_transporte',
      valor_empresa: 200.00,
      valor_funcionario: 0.00,
      ativo: true
    },
    {
      id: 4,
      nome: 'Seguro de Vida',
      descricao: 'Seguro de vida em grupo',
      tipo: 'seguro_vida',
      valor_empresa: 50.00,
      valor_funcionario: 0.00,
      ativo: true
    }
  ]

  const funcionariosSimulados = [
    { id: 1, nome: 'Maria Silva', cargo: 'Desenvolvedora Senior' },
    { id: 2, nome: 'João Santos', cargo: 'Analista de RH' },
    { id: 3, nome: 'Ana Costa', cargo: 'Gerente de Vendas' }
  ]

  const funcionarioBeneficiosSimulados = [
    {
      id: 1,
      funcionario_id: 1,
      funcionario_nome: 'Maria Silva',
      beneficio_id: 1,
      beneficio_nome: 'Vale Refeição',
      data_inicio: '2024-01-01',
      data_fim: null,
      valor_personalizado: null,
      ativo: true
    },
    {
      id: 2,
      funcionario_id: 1,
      funcionario_nome: 'Maria Silva',
      beneficio_id: 2,
      beneficio_nome: 'Plano de Saúde',
      data_inicio: '2024-01-01',
      data_fim: null,
      valor_personalizado: null,
      ativo: true
    },
    {
      id: 3,
      funcionario_id: 2,
      funcionario_nome: 'João Santos',
      beneficio_id: 1,
      beneficio_nome: 'Vale Refeição',
      data_inicio: '2024-01-15',
      data_fim: null,
      valor_personalizado: 600.00,
      ativo: true
    }
  ]

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setBeneficios(beneficiosSimulados)
      setFuncionarios(funcionariosSimulados)
      setFuncionarioBeneficios(funcionarioBeneficiosSimulados)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredBeneficios = beneficios.filter(beneficio =>
    beneficio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beneficio.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBeneficioSubmit = (e) => {
    e.preventDefault()
    
    if (editingBeneficio) {
      // Atualizar benefício existente
      setBeneficios(prev => prev.map(ben => 
        ben.id === editingBeneficio.id 
          ? { 
              ...ben, 
              ...beneficioFormData,
              valor_empresa: parseFloat(beneficioFormData.valor_empresa),
              valor_funcionario: parseFloat(beneficioFormData.valor_funcionario)
            }
          : ben
      ))
    } else {
      // Criar novo benefício
      const novoBeneficio = {
        id: Date.now(),
        ...beneficioFormData,
        valor_empresa: parseFloat(beneficioFormData.valor_empresa),
        valor_funcionario: parseFloat(beneficioFormData.valor_funcionario),
        ativo: true
      }
      setBeneficios(prev => [...prev, novoBeneficio])
    }
    
    resetBeneficioForm()
    setIsBeneficioDialogOpen(false)
  }

  const handleVinculoSubmit = (e) => {
    e.preventDefault()
    
    const funcionario = funcionarios.find(f => f.id.toString() === vinculoFormData.funcionario_id)
    const beneficio = beneficios.find(b => b.id.toString() === vinculoFormData.beneficio_id)
    
    const novoVinculo = {
      id: Date.now(),
      funcionario_id: parseInt(vinculoFormData.funcionario_id),
      funcionario_nome: funcionario?.nome || '',
      beneficio_id: parseInt(vinculoFormData.beneficio_id),
      beneficio_nome: beneficio?.nome || '',
      data_inicio: vinculoFormData.data_inicio,
      data_fim: vinculoFormData.data_fim || null,
      valor_personalizado: vinculoFormData.valor_personalizado ? parseFloat(vinculoFormData.valor_personalizado) : null,
      ativo: true
    }
    
    setFuncionarioBeneficios(prev => [...prev, novoVinculo])
    resetVinculoForm()
    setIsVinculoDialogOpen(false)
  }

  const resetBeneficioForm = () => {
    setBeneficioFormData({
      nome: '',
      descricao: '',
      tipo: '',
      valor_empresa: '',
      valor_funcionario: ''
    })
    setEditingBeneficio(null)
  }

  const resetVinculoForm = () => {
    setVinculoFormData({
      funcionario_id: '',
      beneficio_id: '',
      data_inicio: '',
      data_fim: '',
      valor_personalizado: ''
    })
  }

  const handleEditBeneficio = (beneficio) => {
    setEditingBeneficio(beneficio)
    setBeneficioFormData({
      nome: beneficio.nome,
      descricao: beneficio.descricao,
      tipo: beneficio.tipo,
      valor_empresa: beneficio.valor_empresa.toString(),
      valor_funcionario: beneficio.valor_funcionario.toString()
    })
    setIsBeneficioDialogOpen(true)
  }

  const handleDeleteBeneficio = (id) => {
    if (confirm('Tem certeza que deseja excluir este benefício?')) {
      setBeneficios(prev => prev.filter(ben => ben.id !== id))
    }
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

  const getTipoLabel = (tipo) => {
    const tipos = {
      vale_refeicao: 'Vale Refeição',
      vale_transporte: 'Vale Transporte',
      plano_saude: 'Plano de Saúde',
      seguro_vida: 'Seguro de Vida',
      auxilio_creche: 'Auxílio Creche',
      gympass: 'Gympass'
    }
    return tipos[tipo] || tipo
  }

  const getStats = () => {
    const totalBeneficios = beneficios.length
    const totalVinculos = funcionarioBeneficios.filter(fb => fb.ativo).length
    const custoTotal = funcionarioBeneficios
      .filter(fb => fb.ativo)
      .reduce((total, fb) => {
        const beneficio = beneficios.find(b => b.id === fb.beneficio_id)
        const valor = fb.valor_personalizado || beneficio?.valor_empresa || 0
        return total + valor
      }, 0)
    
    return { totalBeneficios, totalVinculos, custoTotal }
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
          <h1 className="text-2xl font-bold text-gray-900">Benefícios</h1>
          <p className="text-gray-600">Gerencie os benefícios oferecidos aos funcionários</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isVinculoDialogOpen} onOpenChange={setIsVinculoDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetVinculoForm}>
                <Users className="h-4 w-4 mr-2" />
                Vincular Benefício
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vincular Benefício a Funcionário</DialogTitle>
                <DialogDescription>
                  Associe um benefício a um funcionário específico
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleVinculoSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="funcionario_id">Funcionário</Label>
                  <Select value={vinculoFormData.funcionario_id} onValueChange={(value) => setVinculoFormData(prev => ({ ...prev, funcionario_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map(funcionario => (
                        <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                          {funcionario.nome} - {funcionario.cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="beneficio_id">Benefício</Label>
                  <Select value={vinculoFormData.beneficio_id} onValueChange={(value) => setVinculoFormData(prev => ({ ...prev, beneficio_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o benefício" />
                    </SelectTrigger>
                    <SelectContent>
                      {beneficios.map(beneficio => (
                        <SelectItem key={beneficio.id} value={beneficio.id.toString()}>
                          {beneficio.nome} - {formatCurrency(beneficio.valor_empresa)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_inicio">Data de Início</Label>
                    <Input
                      id="data_inicio"
                      type="date"
                      value={vinculoFormData.data_inicio}
                      onChange={(e) => setVinculoFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_fim">Data de Fim (opcional)</Label>
                    <Input
                      id="data_fim"
                      type="date"
                      value={vinculoFormData.data_fim}
                      onChange={(e) => setVinculoFormData(prev => ({ ...prev, data_fim: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="valor_personalizado">Valor Personalizado (opcional)</Label>
                  <Input
                    id="valor_personalizado"
                    type="number"
                    step="0.01"
                    value={vinculoFormData.valor_personalizado}
                    onChange={(e) => setVinculoFormData(prev => ({ ...prev, valor_personalizado: e.target.value }))}
                    placeholder="Deixe vazio para usar valor padrão"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsVinculoDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Vincular Benefício</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isBeneficioDialogOpen} onOpenChange={setIsBeneficioDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetBeneficioForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Benefício
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBeneficio ? 'Editar Benefício' : 'Novo Benefício'}
                </DialogTitle>
                <DialogDescription>
                  {editingBeneficio 
                    ? 'Atualize as informações do benefício'
                    : 'Crie um novo benefício para os funcionários'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBeneficioSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Benefício</Label>
                  <Input
                    id="nome"
                    value={beneficioFormData.nome}
                    onChange={(e) => setBeneficioFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={beneficioFormData.tipo} onValueChange={(value) => setBeneficioFormData(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vale_refeicao">Vale Refeição</SelectItem>
                      <SelectItem value="vale_transporte">Vale Transporte</SelectItem>
                      <SelectItem value="plano_saude">Plano de Saúde</SelectItem>
                      <SelectItem value="seguro_vida">Seguro de Vida</SelectItem>
                      <SelectItem value="auxilio_creche">Auxílio Creche</SelectItem>
                      <SelectItem value="gympass">Gympass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={beneficioFormData.descricao}
                    onChange={(e) => setBeneficioFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valor_empresa">Valor Empresa</Label>
                    <Input
                      id="valor_empresa"
                      type="number"
                      step="0.01"
                      value={beneficioFormData.valor_empresa}
                      onChange={(e) => setBeneficioFormData(prev => ({ ...prev, valor_empresa: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor_funcionario">Desconto Funcionário</Label>
                    <Input
                      id="valor_funcionario"
                      type="number"
                      step="0.01"
                      value={beneficioFormData.valor_funcionario}
                      onChange={(e) => setBeneficioFormData(prev => ({ ...prev, valor_funcionario: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsBeneficioDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingBeneficio ? 'Atualizar' : 'Criar'} Benefício
                  </Button>
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
            <CardTitle className="text-sm font-medium">Total de Benefícios</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBeneficios}</div>
            <p className="text-xs text-muted-foreground">
              Tipos disponíveis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vínculos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVinculos}</div>
            <p className="text-xs text-muted-foreground">
              Funcionários com benefícios
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Total Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.custoTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Investimento em benefícios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="beneficios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
          <TabsTrigger value="vinculos">Vínculos</TabsTrigger>
        </TabsList>

        <TabsContent value="beneficios" className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar benefícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">
              {filteredBeneficios.length} benefício{filteredBeneficios.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Benefícios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBeneficios.map((beneficio) => (
              <Card key={beneficio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{beneficio.nome}</CardTitle>
                      <CardDescription>{getTipoLabel(beneficio.tipo)}</CardDescription>
                    </div>
                    <Badge variant={beneficio.ativo ? 'default' : 'secondary'}>
                      {beneficio.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{beneficio.descricao}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Custo Empresa:</span>
                      <span className="font-medium">{formatCurrency(beneficio.valor_empresa)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desconto Funcionário:</span>
                      <span className="font-medium">{formatCurrency(beneficio.valor_funcionario)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBeneficio(beneficio)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBeneficio(beneficio.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vinculos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vínculos de Benefícios</CardTitle>
              <CardDescription>
                Funcionários e seus benefícios ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Benefício</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Data Fim</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionarioBeneficios.map((vinculo) => {
                    const beneficio = beneficios.find(b => b.id === vinculo.beneficio_id)
                    const valor = vinculo.valor_personalizado || beneficio?.valor_empresa || 0
                    
                    return (
                      <TableRow key={vinculo.id}>
                        <TableCell className="font-medium">{vinculo.funcionario_nome}</TableCell>
                        <TableCell>{vinculo.beneficio_nome}</TableCell>
                        <TableCell>{formatDate(vinculo.data_inicio)}</TableCell>
                        <TableCell>{vinculo.data_fim ? formatDate(vinculo.data_fim) : '-'}</TableCell>
                        <TableCell>{formatCurrency(valor)}</TableCell>
                        <TableCell>
                          <Badge variant={vinculo.ativo ? 'default' : 'secondary'}>
                            {vinculo.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              
              {funcionarioBeneficios.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum vínculo encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece vinculando benefícios aos funcionários
                  </p>
                  <Button onClick={() => setIsVinculoDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Vincular Primeiro Benefício
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BeneficiosPage

