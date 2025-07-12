from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from src.models.user import db

class Rescisao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionario.id'), nullable=False)
    tipo_rescisao = db.Column(db.String(50), nullable=False)  # demissao_sem_justa_causa, demissao_justa_causa, pedido_demissao, acordo_mutuo
    data_rescisao = db.Column(db.Date, nullable=False)
    data_aviso_previo = db.Column(db.Date)
    aviso_previo_indenizado = db.Column(db.Boolean, default=False)
    dias_aviso_previo = db.Column(db.Integer, default=30)
    
    # Valores calculados
    saldo_salario = db.Column(db.Float, default=0.0)
    ferias_vencidas = db.Column(db.Float, default=0.0)
    ferias_proporcionais = db.Column(db.Float, default=0.0)
    decimo_terceiro_proporcional = db.Column(db.Float, default=0.0)
    aviso_previo_valor = db.Column(db.Float, default=0.0)
    multa_fgts = db.Column(db.Float, default=0.0)
    fgts_saque = db.Column(db.Float, default=0.0)
    
    # Descontos
    desconto_inss = db.Column(db.Float, default=0.0)
    desconto_irrf = db.Column(db.Float, default=0.0)
    outros_descontos = db.Column(db.Float, default=0.0)
    
    valor_total_bruto = db.Column(db.Float, default=0.0)
    valor_total_liquido = db.Column(db.Float, default=0.0)
    
    observacoes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Rescisao {self.funcionario_id} - {self.data_rescisao}>'

    def calcular_rescisao(self, funcionario):
        """Calcula todos os valores da rescisão"""
        self.calcular_saldo_salario(funcionario)
        self.calcular_ferias(funcionario)
        self.calcular_decimo_terceiro(funcionario)
        self.calcular_aviso_previo(funcionario)
        self.calcular_fgts(funcionario)
        self.calcular_descontos(funcionario)
        self.calcular_total()

    def calcular_saldo_salario(self, funcionario):
        """Calcula o saldo de salário proporcional aos dias trabalhados no mês"""
        if not self.data_rescisao:
            return
        
        dias_mes = self.data_rescisao.day
        dias_totais_mes = 30  # Considera 30 dias por mês
        
        self.saldo_salario = (funcionario.salario_base / dias_totais_mes) * dias_mes

    def calcular_ferias(self, funcionario):
        """Calcula férias vencidas e proporcionais"""
        if not funcionario.data_admissao or not self.data_rescisao:
            return
        
        # Calcula meses trabalhados
        meses_trabalhados = relativedelta(self.data_rescisao, funcionario.data_admissao).months
        anos_trabalhados = relativedelta(self.data_rescisao, funcionario.data_admissao).years
        
        # Férias vencidas (anos completos)
        if anos_trabalhados > 0:
            self.ferias_vencidas = funcionario.salario_base * anos_trabalhados
        
        # Férias proporcionais (meses do ano atual)
        meses_ano_atual = meses_trabalhados % 12
        if meses_ano_atual >= 1:
            self.ferias_proporcionais = (funcionario.salario_base / 12) * meses_ano_atual

    def calcular_decimo_terceiro(self, funcionario):
        """Calcula 13º salário proporcional"""
        if not funcionario.data_admissao or not self.data_rescisao:
            return
        
        # Considera apenas os meses do ano atual
        inicio_ano = date(self.data_rescisao.year, 1, 1)
        data_inicio = max(funcionario.data_admissao, inicio_ano)
        
        meses_trabalhados = relativedelta(self.data_rescisao, data_inicio).months + 1
        
        if meses_trabalhados >= 1:
            self.decimo_terceiro_proporcional = (funcionario.salario_base / 12) * meses_trabalhados

    def calcular_aviso_previo(self, funcionario):
        """Calcula valor do aviso prévio"""
        if self.tipo_rescisao in ['demissao_sem_justa_causa'] and self.aviso_previo_indenizado:
            self.aviso_previo_valor = funcionario.salario_base

    def calcular_fgts(self, funcionario):
        """Calcula FGTS e multa"""
        if not funcionario.data_admissao or not self.data_rescisao:
            return
        
        meses_trabalhados = relativedelta(self.data_rescisao, funcionario.data_admissao).months
        anos_trabalhados = relativedelta(self.data_rescisao, funcionario.data_admissao).years
        total_meses = (anos_trabalhados * 12) + meses_trabalhados
        
        # FGTS aproximado (8% do salário por mês)
        fgts_total = funcionario.salario_base * 0.08 * total_meses
        
        if self.tipo_rescisao == 'demissao_sem_justa_causa':
            self.multa_fgts = fgts_total * 0.4  # 40% de multa
            self.fgts_saque = fgts_total

    def calcular_descontos(self, funcionario):
        """Calcula descontos de INSS e IRRF"""
        valor_bruto = (self.saldo_salario + self.ferias_vencidas + 
                      self.ferias_proporcionais + self.decimo_terceiro_proporcional + 
                      self.aviso_previo_valor)
        
        # INSS (simplificado)
        if valor_bruto <= 1320.00:
            self.desconto_inss = valor_bruto * 0.075
        elif valor_bruto <= 2571.29:
            self.desconto_inss = valor_bruto * 0.09
        elif valor_bruto <= 3856.94:
            self.desconto_inss = valor_bruto * 0.12
        else:
            self.desconto_inss = valor_bruto * 0.14

    def calcular_total(self):
        """Calcula valores totais"""
        self.valor_total_bruto = (self.saldo_salario + self.ferias_vencidas + 
                                 self.ferias_proporcionais + self.decimo_terceiro_proporcional + 
                                 self.aviso_previo_valor + self.multa_fgts + self.fgts_saque)
        
        self.valor_total_liquido = (self.valor_total_bruto - self.desconto_inss - 
                                   self.desconto_irrf - self.outros_descontos)

    def to_dict(self):
        return {
            'id': self.id,
            'funcionario_id': self.funcionario_id,
            'tipo_rescisao': self.tipo_rescisao,
            'data_rescisao': self.data_rescisao.isoformat() if self.data_rescisao else None,
            'data_aviso_previo': self.data_aviso_previo.isoformat() if self.data_aviso_previo else None,
            'aviso_previo_indenizado': self.aviso_previo_indenizado,
            'dias_aviso_previo': self.dias_aviso_previo,
            'saldo_salario': self.saldo_salario,
            'ferias_vencidas': self.ferias_vencidas,
            'ferias_proporcionais': self.ferias_proporcionais,
            'decimo_terceiro_proporcional': self.decimo_terceiro_proporcional,
            'aviso_previo_valor': self.aviso_previo_valor,
            'multa_fgts': self.multa_fgts,
            'fgts_saque': self.fgts_saque,
            'desconto_inss': self.desconto_inss,
            'desconto_irrf': self.desconto_irrf,
            'outros_descontos': self.outros_descontos,
            'valor_total_bruto': self.valor_total_bruto,
            'valor_total_liquido': self.valor_total_liquido,
            'observacoes': self.observacoes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

