from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Beneficio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    tipo = db.Column(db.String(50), nullable=False)  # vale_refeicao, vale_transporte, plano_saude, etc
    valor_empresa = db.Column(db.Float, default=0.0)  # Valor pago pela empresa
    valor_funcionario = db.Column(db.Float, default=0.0)  # Valor descontado do funcionário
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    funcionarios = db.relationship('FuncionarioBeneficio', backref='beneficio', lazy=True)

    def __repr__(self):
        return f'<Beneficio {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'tipo': self.tipo,
            'valor_empresa': self.valor_empresa,
            'valor_funcionario': self.valor_funcionario,
            'ativo': self.ativo,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class FuncionarioBeneficio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionario.id'), nullable=False)
    beneficio_id = db.Column(db.Integer, db.ForeignKey('beneficio.id'), nullable=False)
    data_inicio = db.Column(db.Date, nullable=False)
    data_fim = db.Column(db.Date)
    valor_personalizado = db.Column(db.Float)  # Valor específico para este funcionário
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<FuncionarioBeneficio {self.funcionario_id} - {self.beneficio_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'funcionario_id': self.funcionario_id,
            'beneficio_id': self.beneficio_id,
            'data_inicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'data_fim': self.data_fim.isoformat() if self.data_fim else None,
            'valor_personalizado': self.valor_personalizado,
            'ativo': self.ativo,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

