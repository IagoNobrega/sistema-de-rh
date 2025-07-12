from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models.user import db
from src.models.rescisao import Rescisao
from src.models.funcionario import Funcionario

rescisao_bp = Blueprint('rescisao', __name__)

@rescisao_bp.route('/rescisoes', methods=['GET'])
def listar_rescisoes():
    """Lista todas as rescisões"""
    try:
        rescisoes = Rescisao.query.order_by(Rescisao.data_rescisao.desc()).all()
        resultado = []
        
        for rescisao in rescisoes:
            item = rescisao.to_dict()
            funcionario = Funcionario.query.get(rescisao.funcionario_id)
            if funcionario:
                item['funcionario'] = funcionario.to_dict()
            resultado.append(item)
        
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rescisao_bp.route('/rescisoes', methods=['POST'])
def criar_rescisao():
    """Cria uma nova rescisão"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if not data.get('funcionario_id') or not data.get('tipo_rescisao') or not data.get('data_rescisao'):
            return jsonify({'error': 'Funcionário, tipo de rescisão e data são obrigatórios'}), 400
        
        # Verifica se funcionário existe
        funcionario = Funcionario.query.get(data['funcionario_id'])
        if not funcionario:
            return jsonify({'error': 'Funcionário não encontrado'}), 404
        
        # Verifica se funcionário já possui rescisão
        rescisao_existente = Rescisao.query.filter_by(funcionario_id=data['funcionario_id']).first()
        if rescisao_existente:
            return jsonify({'error': 'Funcionário já possui rescisão registrada'}), 400
        
        data_rescisao = datetime.strptime(data['data_rescisao'], '%Y-%m-%d').date()
        data_aviso_previo = None
        if data.get('data_aviso_previo'):
            data_aviso_previo = datetime.strptime(data['data_aviso_previo'], '%Y-%m-%d').date()
        
        rescisao = Rescisao(
            funcionario_id=data['funcionario_id'],
            tipo_rescisao=data['tipo_rescisao'],
            data_rescisao=data_rescisao,
            data_aviso_previo=data_aviso_previo,
            aviso_previo_indenizado=data.get('aviso_previo_indenizado', False),
            dias_aviso_previo=int(data.get('dias_aviso_previo', 30)),
            observacoes=data.get('observacoes')
        )
        
        # Calcula todos os valores da rescisão
        rescisao.calcular_rescisao(funcionario)
        
        # Atualiza status do funcionário
        funcionario.status = 'demitido'
        funcionario.data_demissao = data_rescisao
        funcionario.updated_at = datetime.utcnow()
        
        db.session.add(rescisao)
        db.session.commit()
        
        return jsonify(rescisao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@rescisao_bp.route('/rescisoes/<int:rescisao_id>', methods=['GET'])
def obter_rescisao(rescisao_id):
    """Obtém uma rescisão específica"""
    try:
        rescisao = Rescisao.query.get_or_404(rescisao_id)
        resultado = rescisao.to_dict()
        
        funcionario = Funcionario.query.get(rescisao.funcionario_id)
        if funcionario:
            resultado['funcionario'] = funcionario.to_dict()
        
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rescisao_bp.route('/rescisoes/<int:rescisao_id>', methods=['PUT'])
def atualizar_rescisao(rescisao_id):
    """Atualiza uma rescisão"""
    try:
        rescisao = Rescisao.query.get_or_404(rescisao_id)
        data = request.get_json()
        
        # Atualiza campos básicos
        if 'tipo_rescisao' in data:
            rescisao.tipo_rescisao = data['tipo_rescisao']
        if 'data_rescisao' in data:
            rescisao.data_rescisao = datetime.strptime(data['data_rescisao'], '%Y-%m-%d').date()
        if 'data_aviso_previo' in data:
            rescisao.data_aviso_previo = datetime.strptime(data['data_aviso_previo'], '%Y-%m-%d').date() if data['data_aviso_previo'] else None
        if 'aviso_previo_indenizado' in data:
            rescisao.aviso_previo_indenizado = data['aviso_previo_indenizado']
        if 'dias_aviso_previo' in data:
            rescisao.dias_aviso_previo = int(data['dias_aviso_previo'])
        if 'observacoes' in data:
            rescisao.observacoes = data['observacoes']
        
        # Permite atualização manual de valores
        if 'outros_descontos' in data:
            rescisao.outros_descontos = float(data['outros_descontos'])
        
        # Recalcula valores
        funcionario = Funcionario.query.get(rescisao.funcionario_id)
        rescisao.calcular_rescisao(funcionario)
        
        rescisao.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(rescisao.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@rescisao_bp.route('/rescisoes/<int:rescisao_id>', methods=['DELETE'])
def deletar_rescisao(rescisao_id):
    """Deleta uma rescisão"""
    try:
        rescisao = Rescisao.query.get_or_404(rescisao_id)
        
        # Reativa o funcionário
        funcionario = Funcionario.query.get(rescisao.funcionario_id)
        if funcionario:
            funcionario.status = 'ativo'
            funcionario.data_demissao = None
            funcionario.updated_at = datetime.utcnow()
        
        db.session.delete(rescisao)
        db.session.commit()
        
        return jsonify({'message': 'Rescisão deletada com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@rescisao_bp.route('/rescisoes/<int:rescisao_id>/recalcular', methods=['POST'])
def recalcular_rescisao(rescisao_id):
    """Recalcula os valores de uma rescisão"""
    try:
        rescisao = Rescisao.query.get_or_404(rescisao_id)
        funcionario = Funcionario.query.get(rescisao.funcionario_id)
        
        if not funcionario:
            return jsonify({'error': 'Funcionário não encontrado'}), 404
        
        # Recalcula todos os valores
        rescisao.calcular_rescisao(funcionario)
        rescisao.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(rescisao.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@rescisao_bp.route('/rescisoes/simular', methods=['POST'])
def simular_rescisao():
    """Simula uma rescisão sem salvar no banco"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if not data.get('funcionario_id') or not data.get('tipo_rescisao') or not data.get('data_rescisao'):
            return jsonify({'error': 'Funcionário, tipo de rescisão e data são obrigatórios'}), 400
        
        # Verifica se funcionário existe
        funcionario = Funcionario.query.get(data['funcionario_id'])
        if not funcionario:
            return jsonify({'error': 'Funcionário não encontrado'}), 404
        
        data_rescisao = datetime.strptime(data['data_rescisao'], '%Y-%m-%d').date()
        data_aviso_previo = None
        if data.get('data_aviso_previo'):
            data_aviso_previo = datetime.strptime(data['data_aviso_previo'], '%Y-%m-%d').date()
        
        # Cria rescisão temporária (não salva no banco)
        rescisao_temp = Rescisao(
            funcionario_id=data['funcionario_id'],
            tipo_rescisao=data['tipo_rescisao'],
            data_rescisao=data_rescisao,
            data_aviso_previo=data_aviso_previo,
            aviso_previo_indenizado=data.get('aviso_previo_indenizado', False),
            dias_aviso_previo=int(data.get('dias_aviso_previo', 30)),
            observacoes=data.get('observacoes')
        )
        
        # Calcula valores
        rescisao_temp.calcular_rescisao(funcionario)
        
        resultado = rescisao_temp.to_dict()
        resultado['funcionario'] = funcionario.to_dict()
        resultado['simulacao'] = True
        
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rescisao_bp.route('/rescisoes/relatorio', methods=['GET'])
def relatorio_rescisoes():
    """Gera relatório de rescisões por período"""
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        tipo_rescisao = request.args.get('tipo_rescisao')
        
        query = Rescisao.query
        
        if data_inicio:
            data_inicio = datetime.strptime(data_inicio, '%Y-%m-%d').date()
            query = query.filter(Rescisao.data_rescisao >= data_inicio)
        
        if data_fim:
            data_fim = datetime.strptime(data_fim, '%Y-%m-%d').date()
            query = query.filter(Rescisao.data_rescisao <= data_fim)
        
        if tipo_rescisao:
            query = query.filter(Rescisao.tipo_rescisao == tipo_rescisao)
        
        rescisoes = query.order_by(Rescisao.data_rescisao.desc()).all()
        
        total_rescisoes = len(rescisoes)
        total_valor_bruto = sum(r.valor_total_bruto for r in rescisoes)
        total_valor_liquido = sum(r.valor_total_liquido for r in rescisoes)
        
        # Agrupa por tipo de rescisão
        tipos_rescisao = {}
        for rescisao in rescisoes:
            tipo = rescisao.tipo_rescisao
            if tipo not in tipos_rescisao:
                tipos_rescisao[tipo] = {'quantidade': 0, 'valor_total': 0}
            tipos_rescisao[tipo]['quantidade'] += 1
            tipos_rescisao[tipo]['valor_total'] += rescisao.valor_total_liquido
        
        relatorio = {
            'periodo': {
                'data_inicio': data_inicio.isoformat() if data_inicio else None,
                'data_fim': data_fim.isoformat() if data_fim else None
            },
            'resumo': {
                'total_rescisoes': total_rescisoes,
                'total_valor_bruto': total_valor_bruto,
                'total_valor_liquido': total_valor_liquido
            },
            'por_tipo': tipos_rescisao,
            'rescisoes': [rescisao.to_dict() for rescisao in rescisoes]
        }
        
        return jsonify(relatorio)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

