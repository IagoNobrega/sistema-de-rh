from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Ponto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionario.id'), nullable=False)
    data = db.Column(db.Date, nullable=False)
    entrada_manha = db.Column(db.Time)
    saida_almoco = db.Column(db.Time)
    entrada_tarde = db.Column(db.Time)
    saida_tarde = db.Column(db.Time)
    horas_trabalhadas = db.Column(db.Float, default=0.0)
    horas_extras = db.Column(db.Float, default=0.0)
    observacoes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Ponto {self.funcionario_id} - {self.data}>'

    def calcular_horas_trabalhadas(self):
        """Calcula as horas trabalhadas no dia"""
        if not all([self.entrada_manha, self.saida_almoco, self.entrada_tarde, self.saida_tarde]):
            return 0.0
        
        # Converte time para minutos
        entrada_manha_min = self.entrada_manha.hour * 60 + self.entrada_manha.minute
        saida_almoco_min = self.saida_almoco.hour * 60 + self.saida_almoco.minute
        entrada_tarde_min = self.entrada_tarde.hour * 60 + self.entrada_tarde.minute
        saida_tarde_min = self.saida_tarde.hour * 60 + self.saida_tarde.minute
        
        # Calcula horas trabalhadas
        periodo_manha = saida_almoco_min - entrada_manha_min
        periodo_tarde = saida_tarde_min - entrada_tarde_min
        
        total_minutos = periodo_manha + periodo_tarde
        return total_minutos / 60.0

    def to_dict(self):
        return {
            'id': self.id,
            'funcionario_id': self.funcionario_id,
            'data': self.data.isoformat() if self.data else None,
            'entrada_manha': self.entrada_manha.strftime('%H:%M') if self.entrada_manha else None,
            'saida_almoco': self.saida_almoco.strftime('%H:%M') if self.saida_almoco else None,
            'entrada_tarde': self.entrada_tarde.strftime('%H:%M') if self.entrada_tarde else None,
            'saida_tarde': self.saida_tarde.strftime('%H:%M') if self.saida_tarde else None,
            'horas_trabalhadas': self.horas_trabalhadas,
            'horas_extras': self.horas_extras,
            'observacoes': self.observacoes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

