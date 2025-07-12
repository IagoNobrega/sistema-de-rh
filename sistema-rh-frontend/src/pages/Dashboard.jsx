import { useState, useEffect } from 'react'
import { Users, Clock, Gift, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFuncionarios: 0,
    funcionariosAtivos: 0,
    totalBeneficios: 0,
    totalRescisoes: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simula dados para o dashboard
        setStats({
          totalFuncionarios: 45,
          funcionariosAtivos: 42,
          totalBeneficios: 8,
          totalRescisoes: 3
        })
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const chartData = [
    { name: 'Jan', funcionarios: 40, rescisoes: 2 },
    { name: 'Fev', funcionarios: 42, rescisoes: 1 },
    { name: 'Mar', funcionarios: 45, rescisoes: 3 },
    { name: 'Abr', funcionarios: 43, rescisoes: 2 },
    { name: 'Mai', funcionarios: 45, rescisoes: 0 },
    { name: 'Jun', funcionarios: 42, rescisoes: 3 },
  ]

  const beneficiosData = [
    { name: 'Vale Refeição', value: 35, color: '#0088FE' },
    { name: 'Plano de Saúde', value: 28, color: '#00C49F' },
    { name: 'Vale Transporte', value: 40, color: '#FFBB28' },
    { name: 'Seguro de Vida', value: 25, color: '#FF8042' },
  ]

  const statCards = [
    {
      title: 'Total de Funcionários',
      value: stats.totalFuncionarios,
      description: `${stats.funcionariosAtivos} ativos`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Horas Trabalhadas (Mês)',
      value: '1,840',
      description: '+12% vs mês anterior',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Benefícios Ativos',
      value: stats.totalBeneficios,
      description: 'Diferentes tipos',
      icon: Gift,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Rescisões (Mês)',
      value: stats.totalRescisoes,
      description: 'R$ 45.000 total',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de recursos humanos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionários vs Rescisões</CardTitle>
            <CardDescription>Evolução mensal dos funcionários e rescisões</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="funcionarios" fill="#3B82F6" name="Funcionários" />
                <Bar dataKey="rescisoes" fill="#EF4444" name="Rescisões" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Benefícios Mais Utilizados</CardTitle>
            <CardDescription>Distribuição dos benefícios entre funcionários</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={beneficiosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {beneficiosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas movimentações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: 'Novo funcionário cadastrado',
                details: 'Maria Silva - Desenvolvedora',
                time: '2 horas atrás',
                icon: Users,
                color: 'text-green-600'
              },
              {
                action: 'Rescisão processada',
                details: 'João Santos - R$ 15.000',
                time: '1 dia atrás',
                icon: FileText,
                color: 'text-red-600'
              },
              {
                action: 'Benefício adicionado',
                details: 'Vale Refeição para 5 funcionários',
                time: '2 dias atrás',
                icon: Gift,
                color: 'text-purple-600'
              },
              {
                action: 'Ponto registrado',
                details: '42 funcionários bateram ponto hoje',
                time: '3 horas atrás',
                icon: Clock,
                color: 'text-blue-600'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <div className={`p-2 rounded-full bg-gray-100`}>
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.details}</p>
                </div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

