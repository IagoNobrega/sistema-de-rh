import { useState, useEffect } from 'react'
import { Plus, Search, Clock, Calendar, Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'

const PontosPage = () => {
  const [pontos, setPontos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFuncionario, setSelectedFuncionario] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPonto, setEditingPonto] = useState(null)
  const [formData, setFormData] = useState({
    funcionario_id: '',
    data: '',
    entrada_manha: '',
    saida_almoco: '',
    entrada_tarde: '',
    saida_tarde: '',
    observacoes: ''
  })

  // Dados simulados
  const funcionariosSimulados = [
    { id: 1, nome: 'Maria Silva', cargo: 'Desenvolvedora Senior' },
    { id: 2, nome: 'João Santos', cargo: 'Analista de RH' },
    { id: 3, nome: 'Ana Costa', cargo: 'Gerente de Vendas' }
  ]

  const pontosSimulados = [
    {
      id: 1,
      funcionario_id: 1,
      funcionario_nome: 'Maria Silva',
      data: '2024-01-15',
      entrada_manha: '08:00',
      saida_almoco: '12:00',
      entrada_tarde: '13:00',
      saida_tarde: '17:00',
      horas_trabalhadas: 8.0,
      horas_extras: 0.0,
      observacoes: ''
    },
    {
      id: 2,
      funcionario_id: 1,
      funcionario_nome: 'Maria Silva',
      data: '2024-01-16',
      entrada_manha: '08:00',
      saida_almoco: '12:00',
      entrada_tarde: '13:00',
      saida_tarde: '18:00',
      horas_trabalhadas: 9.0,
      horas_extras: 1.0,
      observacoes: 'Hora extra aprovada'
    },
    {
      id: 3,
      funcionario_id: 2,
      funcionario_nome: 'João Santos',
      data: '2024-01-15',
      entrada_manha: '09:00',
      saida_almoco: '12:30',
      entrada_tarde: '13:30',
      saida_tarde: '18:00',
      horas_trabalhadas: 8.0,
      horas_extras: 0.0,
      observacoes: ''
    }
  ]

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setFuncionarios(funcionariosSimulados)
      setPontos(pontosSimulados)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPontos = pontos.filter(ponto => {
    const matchesSearch = ponto.funcionario_nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFuncionario = !selectedFuncionario || ponto.funcionario_id.toString() === selectedFuncionario
    const matchesMonth = ponto.data.startsWith(selectedMonth)
    return matchesSearch && matchesFuncionario && matchesMonth
  })

  const calcularHorasTrabalhadas = (entrada_manha, saida_almoco, entrada_tarde, saida_tarde) => {
    if (!entrada_manha || !saida_almoco || !entrada_tarde || !saida_tarde) return 0

    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }

    const entradaManhaMin = parseTime(entrada_manha)
    const saidaAlmocoMin = parseTime(saida_almoco)
    const entradaTardeMin = parseTime(entrada_tarde)
    const saidaTardeMin = parseTime(saida_tarde)

    const periodoManha = saidaAlmocoMin - entradaManhaMin
    const periodoTarde = saidaTardeMin - entradaTardeMin

    return (periodoManha + periodoTarde) / 60
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const horasTrabalhadas = calcularHorasTrabalhadas(
      formData.entrada_manha,
      formData.saida_almoco,
      formData.entrada_tarde,
      formData.saida_tarde
    )

    const horasExtras = horasTrabalhadas > 8 ? horasTrabalhadas - 8 : 0
    const funcionario = funcionarios.find(f => f.id.toString() === formData.funcionario_id)

    if (editingPonto) {
      // Atualizar ponto existente
      setPontos(prev => prev.map(ponto => 
        ponto.id === editingPonto.id 
          ? { 
              ...ponto, 
              ...formData,
              funcionario_nome: funcionario?.nome || '',
              horas_trabalhadas: horasTrabalhadas,
              horas_extras: horasExtras
            }
          : ponto
      ))
    } else {
      // Criar novo ponto
      const novoPonto = {
        id: Date.now(),
        ...formData,
        funcionario_id: parseInt(formData.funcionario_id),
        funcionario_nome: funcionario?.nome || '',
        horas_trabalhadas: horasTrabalhadas,
        horas_extras: horasExtras
      }
      setPontos(prev => [...prev, novoPonto])
    }
    
    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      funcionario_id: '',
      data: '',
      entrada_manha: '',
      saida_almoco: '',
      entrada_tarde: '',
      saida_tarde: '',
      observacoes: ''
    })
    setEditingPonto(null)
  }

  const handleEdit = (ponto) => {
    setEditingPonto(ponto)
    setFormData({
      funcionario_id: ponto.funcionario_id.toString(),
      data: ponto.data,
      entrada_manha: ponto.entrada_manha,
      saida_almoco: ponto.saida_almoco,
      entrada_tarde: ponto.entrada_tarde,
      saida_tarde: ponto.saida_tarde,
      observacoes: ponto.observacoes
    })
    setIsDialogOpen(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatHours = (hours) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h${m > 0 ? ` ${m}m` : ''}`
  }

  const getTotalHours = () => {
    return filteredPontos.reduce((total, ponto) => total + ponto.horas_trabalhadas, 0)
  }

  const getTotalExtraHours = () => {
    return filteredPontos.reduce((total, ponto) => total + ponto.horas_extras, 0)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Controle de Ponto</h1>
          <p className="text-gray-600">Gerencie o registro de ponto dos funcionários</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Ponto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPonto ? 'Editar Ponto' : 'Registrar Ponto'}
              </DialogTitle>
              <DialogDescription>
                {editingPonto 
                  ? 'Atualize as informações do ponto'
                  : 'Registre o ponto do funcionário'
                }
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
                      {funcionarios.map(funcionario => (
                        <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                          {funcionario.nome} - {funcionario.cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="entrada_manha">Entrada Manhã</Label>
                  <Input
                    id="entrada_manha"
                    type="time"
                    value={formData.entrada_manha}
                    onChange={(e) => setFormData(prev => ({ ...prev, entrada_manha: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="saida_almoco">Saída Almoço</Label>
                  <Input
                    id="saida_almoco"
                    type="time"
                    value={formData.saida_almoco}
                    onChange={(e) => setFormData(prev => ({ ...prev, saida_almoco: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="entrada_tarde">Entrada Tarde</Label>
                  <Input
                    id="entrada_tarde"
                    type="time"
                    value={formData.entrada_tarde}
                    onChange={(e) => setFormData(prev => ({ ...prev, entrada_tarde: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="saida_tarde">Saída Tarde</Label>
                  <Input
                    id="saida_tarde"
                    type="time"
                    value={formData.saida_tarde}
                    onChange={(e) => setFormData(prev => ({ ...prev, saida_tarde: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={3}
                  placeholder="Observações sobre o ponto (opcional)"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPonto ? 'Atualizar' : 'Registrar'} Ponto
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPontos.length}</div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabalhadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatHours(getTotalHours())}</div>
            <p className="text-xs text-muted-foreground">
              Total no período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Extras</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatHours(getTotalExtraHours())}</div>
            <p className="text-xs text-muted-foreground">
              Total no período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar funcionário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todos os funcionários" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os funcionários</SelectItem>
            {funcionarios.map(funcionario => (
              <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                {funcionario.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full sm:w-[150px]"
        />
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Pontos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Ponto</CardTitle>
          <CardDescription>
            {filteredPontos.length} registro{filteredPontos.length !== 1 ? 's' : ''} encontrado{filteredPontos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Saída Almoço</TableHead>
                <TableHead>Entrada Tarde</TableHead>
                <TableHead>Saída</TableHead>
                <TableHead>Horas Trabalhadas</TableHead>
                <TableHead>Horas Extras</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPontos.map((ponto) => (
                <TableRow key={ponto.id}>
                  <TableCell className="font-medium">{ponto.funcionario_nome}</TableCell>
                  <TableCell>{formatDate(ponto.data)}</TableCell>
                  <TableCell>{ponto.entrada_manha}</TableCell>
                  <TableCell>{ponto.saida_almoco}</TableCell>
                  <TableCell>{ponto.entrada_tarde}</TableCell>
                  <TableCell>{ponto.saida_tarde}</TableCell>
                  <TableCell>{formatHours(ponto.horas_trabalhadas)}</TableCell>
                  <TableCell>
                    {ponto.horas_extras > 0 ? (
                      <Badge variant="secondary">{formatHours(ponto.horas_extras)}</Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ponto)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPontos.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum registro encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedFuncionario
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece registrando o primeiro ponto'
                }
              </p>
              {!searchTerm && !selectedFuncionario && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primeiro Ponto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PontosPage

