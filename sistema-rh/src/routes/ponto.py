from flask import Blueprint, request, jsonify
from datetime import datetime, date, time
from src.models.user import db
from src.models.ponto import Ponto
from src.models.funcionario import Funcionario

ponto_bp = Blueprint('ponto', __name__)

@ponto_bp.route('/pontos', methods=['GET'])
def listar_pontos():
    """Lista todos os pontos"""
    try:
        funcionario_id = request.args.get('funcionario_id')
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = Ponto.query
        
        if funcionario_id:
            query = query.filter(Ponto.funcionario_id == funcionario_id)
        
        if data_inicio:
            data_inicio = datetime.strptime(data_inicio, '%Y-%m-%d').date()
            query = query.filter(Ponto.data >= data_inicio)
        
        if data_fim:
            data_fim = datetime.strptime(data_fim, '%Y-%m-%d').date()
            query = query.filter(Ponto.data <= data_fim)
        
        pontos = query.order_by(Ponto.data.desc()).all()
        return jsonify([ponto.to_dict() for ponto in pontos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ponto_bp.route('/pontos', methods=['POST'])
def registrar_ponto():
    """Registra um novo ponto"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if not data.get('funcionario_id') or not data.get('data'):
            return jsonify({'error': 'Funcionário e data são obrigatórios'}), 400
        
        # Verifica se funcionário existe
        funcionario = Funcionario.query.get(data['funcionario_id'])
        if not funcionario:
            return jsonify({'error': 'Funcionário não encontrado'}), 404
        
        data_ponto = datetime.strptime(data['data'], '%Y-%m-%d').date()
        
        # Verifica se já existe ponto para esta data
        ponto_existente = Ponto.query.filter_by(
            funcionario_id=data['funcionario_id'],
            data=data_ponto
        ).first()
        
        if ponto_existente:
            return jsonify({'error': 'Já existe ponto registrado para esta data'}), 400
        
        # Converte horários
        entrada_manha = None
        saida_almoco = None
        entrada_tarde = None
        saida_tarde = None
        
        if data.get('entrada_manha'):
            entrada_manha = datetime.strptime(data['entrada_manha'], '%H:%M').time()
        if data.get('saida_almoco'):
            saida_almoco = datetime.strptime(data['saida_almoco'], '%H:%M').time()
        if data.get('entrada_tarde'):
            entrada_tarde = datetime.strptime(data['entrada_tarde'], '%H:%M').time()
        if data.get('saida_tarde'):
            saida_tarde = datetime.strptime(data['saida_tarde'], '%H:%M').time()
        
        ponto = Ponto(
            funcionario_id=data['funcionario_id'],
            data=data_ponto,
            entrada_manha=entrada_manha,
            saida_almoco=saida_almoco,
            entrada_tarde=entrada_tarde,
            saida_tarde=saida_tarde,
            observacoes=data.get('observacoes')
        )
        
        # Calcula horas trabalhadas
        ponto.horas_trabalhadas = ponto.calcular_horas_trabalhadas()
        
        # Calcula horas extras (acima de 8 horas)
        if ponto.horas_trabalhadas > 8:
            ponto.horas_extras = ponto.horas_trabalhadas - 8
        
        db.session.add(ponto)
        db.session.commit()
        
        return jsonify(ponto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ponto_bp.route('/pontos/<int:ponto_id>', methods=['GET'])
def obter_ponto(ponto_id):
    """Obtém um ponto específico"""
    try:
        ponto = Ponto.query.get_or_404(ponto_id)
        return jsonify(ponto.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ponto_bp.route('/pontos/<int:ponto_id>', methods=['PUT'])
def atualizar_ponto(ponto_id):
    """Atualiza um ponto"""
    try:
        ponto = Ponto.query.get_or_404(ponto_id)
        data = request.get_json()
        
        # Atualiza horários
        if 'entrada_manha' in data:
            ponto.entrada_manha = datetime.strptime(data['entrada_manha'], '%H:%M').time() if data['entrada_manha'] else None
        if 'saida_almoco' in data:
            ponto.saida_almoco = datetime.strptime(data['saida_almoco'], '%H:%M').time() if data['saida_almoco'] else None
        if 'entrada_tarde' in data:
            ponto.entrada_tarde = datetime.strptime(data['entrada_tarde'], '%H:%M').time() if data['entrada_tarde'] else None
        if 'saida_tarde' in data:
            ponto.saida_tarde = datetime.strptime(data['saida_tarde'], '%H:%M').time() if data['saida_tarde'] else None
        if 'observacoes' in data:
            ponto.observacoes = data['observacoes']
        
        # Recalcula horas trabalhadas
        ponto.horas_trabalhadas = ponto.calcular_horas_trabalhadas()
        
        # Recalcula horas extras
        if ponto.horas_trabalhadas > 8:
            ponto.horas_extras = ponto.horas_trabalhadas - 8
        else:
            ponto.horas_extras = 0
        
        ponto.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(ponto.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ponto_bp.route('/pontos/<int:ponto_id>', methods=['DELETE'])
def deletar_ponto(ponto_id):
    """Deleta um ponto"""
    try:
        ponto = Ponto.query.get_or_404(ponto_id)
        db.session.delete(ponto)
        db.session.commit()
        
        return jsonify({'message': 'Ponto deletado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ponto_bp.route('/pontos/relatorio', methods=['GET'])
def relatorio_pontos():
    """Gera relatório de pontos por funcionário e período"""
    try:
        funcionario_id = request.args.get('funcionario_id')
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        if not funcionario_id or not data_inicio or not data_fim:
            return jsonify({'error': 'Funcionário, data início e data fim são obrigatórios'}), 400
        
        funcionario = Funcionario.query.get(funcionario_id)
        if not funcionario:
            return jsonify({'error': 'Funcionário não encontrado'}), 404
        
        data_inicio = datetime.strptime(data_inicio, '%Y-%m-%d').date()
        data_fim = datetime.strptime(data_fim, '%Y-%m-%d').date()
        
        pontos = Ponto.query.filter(
            Ponto.funcionario_id == funcionario_id,
            Ponto.data >= data_inicio,
            Ponto.data <= data_fim
        ).order_by(Ponto.data).all()
        
        total_horas = sum(ponto.horas_trabalhadas for ponto in pontos)
        total_horas_extras = sum(ponto.horas_extras for ponto in pontos)
        
        relatorio = {
            'funcionario': funcionario.to_dict(),
            'periodo': {
                'data_inicio': data_inicio.isoformat(),
                'data_fim': data_fim.isoformat()
            },
            'resumo': {
                'total_dias': len(pontos),
                'total_horas': total_horas,
                'total_horas_extras': total_horas_extras
            },
            'pontos': [ponto.to_dict() for ponto in pontos]
        }
        
        return jsonify(relatorio)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

