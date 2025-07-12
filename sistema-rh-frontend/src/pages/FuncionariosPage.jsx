import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'

const FuncionariosPage = () => {
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    cargo: '',
    departamento: '',
    salario_base: '',
    data_admissao: ''
  })

  // Dados simulados para demonstração
  const funcionariosSimulados = [
    {
      id: 1,
      nome: 'Maria Silva',
      cpf: '123.456.789-00',
      email: 'maria.silva@empresa.com',
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Flores, 123 - São Paulo/SP',
      cargo: 'Desenvolvedora Senior',
      departamento: 'Tecnologia',
      salario_base: 8000.00,
      data_admissao: '2022-01-15',
      status: 'ativo'
    },
    {
      id: 2,
      nome: 'João Santos',
      cpf: '987.654.321-00',
      email: 'joao.santos@empresa.com',
      telefone: '(11) 88888-8888',
      endereco: 'Av. Paulista, 456 - São Paulo/SP',
      cargo: 'Analista de RH',
      departamento: 'Recursos Humanos',
      salario_base: 5500.00,
      data_admissao: '2021-06-10',
      status: 'ativo'
    },
    {
      id: 3,
      nome: 'Ana Costa',
      cpf: '456.789.123-00',
      email: 'ana.costa@empresa.com',
      telefone: '(11) 77777-7777',
      endereco: 'Rua Augusta, 789 - São Paulo/SP',
      cargo: 'Gerente de Vendas',
      departamento: 'Comercial',
      salario_base: 12000.00,
      data_admissao: '2020-03-20',
      status: 'ativo'
    }
  ]

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setFuncionarios(funcionariosSimulados)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cpf.includes(searchTerm) ||
    funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingFuncionario) {
      // Atualizar funcionário existente
      setFuncionarios(prev => prev.map(func => 
        func.id === editingFuncionario.id 
          ? { ...func, ...formData, salario_base: parseFloat(formData.salario_base) }
          : func
      ))
    } else {
      // Criar novo funcionário
      const novoFuncionario = {
        id: Date.now(),
        ...formData,
        salario_base: parseFloat(formData.salario_base),
        status: 'ativo'
      }
      setFuncionarios(prev => [...prev, novoFuncionario])
    }
    
    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      endereco: '',
      cargo: '',
      departamento: '',
      salario_base: '',
      data_admissao: ''
    })
    setEditingFuncionario(null)
  }

  const handleEdit = (funcionario) => {
    setEditingFuncionario(funcionario)
    setFormData({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      email: funcionario.email,
      telefone: funcionario.telefone,
      endereco: funcionario.endereco,
      cargo: funcionario.cargo,
      departamento: funcionario.departamento,
      salario_base: funcionario.salario_base.toString(),
      data_admissao: funcionario.data_admissao
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      setFuncionarios(prev => prev.filter(func => func.id !== id))
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-gray-600">Gerencie os funcionários da empresa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
              </DialogTitle>
              <DialogDescription>
                {editingFuncionario 
                  ? 'Atualize as informações do funcionário'
                  : 'Preencha os dados do novo funcionário'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select value={formData.departamento} onValueChange={(value) => setFormData(prev => ({ ...prev, departamento: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operações">Operações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salario_base">Salário Base</Label>
                  <Input
                    id="salario_base"
                    type="number"
                    step="0.01"
                    value={formData.salario_base}
                    onChange={(e) => setFormData(prev => ({ ...prev, salario_base: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data_admissao">Data de Admissão</Label>
                  <Input
                    id="data_admissao"
                    type="date"
                    value={formData.data_admissao}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_admissao: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingFuncionario ? 'Atualizar' : 'Criar'} Funcionário
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredFuncionarios.length} funcionário{filteredFuncionarios.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Funcionários Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFuncionarios.map((funcionario) => (
          <Card key={funcionario.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{funcionario.nome}</CardTitle>
                  <CardDescription>{funcionario.cargo}</CardDescription>
                </div>
                <Badge variant={funcionario.status === 'ativo' ? 'default' : 'secondary'}>
                  {funcionario.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {funcionario.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {funcionario.telefone}
                </div>
                <div className="text-gray-600">
                  <strong>Departamento:</strong> {funcionario.departamento}
                </div>
                <div className="text-gray-600">
                  <strong>Salário:</strong> {formatCurrency(funcionario.salario_base)}
                </div>
                <div className="text-gray-600">
                  <strong>Admissão:</strong> {formatDate(funcionario.data_admissao)}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(funcionario)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(funcionario.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFuncionarios.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum funcionário encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Tente ajustar os termos de busca'
                : 'Comece adicionando o primeiro funcionário'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Funcionário
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FuncionariosPage

