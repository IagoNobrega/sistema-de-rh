from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Funcionario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefone = db.Column(db.String(20))
    endereco = db.Column(db.Text)
    cargo = db.Column(db.String(100), nullable=False)
    departamento = db.Column(db.String(100))
    salario_base = db.Column(db.Float, nullable=False)
    data_admissao = db.Column(db.Date, nullable=False)
    data_demissao = db.Column(db.Date)
    status = db.Column(db.String(20), default='ativo')  # ativo, inativo, demitido
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    pontos = db.relationship('Ponto', backref='funcionario', lazy=True)
    beneficios = db.relationship('FuncionarioBeneficio', backref='funcionario', lazy=True)
    rescisoes = db.relationship('Rescisao', backref='funcionario', lazy=True)

    def __repr__(self):
        return f'<Funcionario {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cpf': self.cpf,
            'email': self.email,
            'telefone': self.telefone,
            'endereco': self.endereco,
            'cargo': self.cargo,
            'departamento': self.departamento,
            'salario_base': self.salario_base,
            'data_admissao': self.data_admissao.isoformat() if self.data_admissao else None,
            'data_demissao': self.data_demissao.isoformat() if self.data_demissao else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

