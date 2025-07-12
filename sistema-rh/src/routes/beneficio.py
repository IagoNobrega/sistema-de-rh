from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models.user import db
from src.models.beneficio import Beneficio, FuncionarioBeneficio
from src.models.funcionario import Funcionario

beneficio_bp = Blueprint('beneficio', __name__)

# Rotas para Benefícios
@beneficio_bp.route('/beneficios', methods=['GET'])
def listar_beneficios():
    """Lista todos os benefícios"""
    try:
        beneficios = Beneficio.query.filter_by(ativo=True).all()
        return jsonify([beneficio.to_dict() for beneficio in beneficios])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@beneficio_bp.route('/beneficios', methods=['POST'])
def criar_beneficio():
    """Cria um novo benefício"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if not data.get('nome') or not data.get('tipo'):
            return jsonify({'error': 'Nome e tipo são obrigatórios'}), 400
        
        beneficio = Beneficio(
            nome=data['nome'],
            descricao=data.get('descricao'),
            tipo=data['tipo'],
            valor_empresa=float(data.get('valor_empresa', 0)),
            valor_funcionario=float(data.get('valor_funcionario', 0))
        )
        
        db.session.add(beneficio)
        db.session.commit()
        
        return jsonify(beneficio.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@beneficio_bp.route('/beneficios/<int:beneficio_id>', methods=['GET'])
def obter_beneficio(beneficio_id):
    """Obtém um benefício específico"""
    try:
        beneficio = Beneficio.query.get_or_404(beneficio_id)
        return jsonify(beneficio.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@beneficio_bp.route('/beneficios/<int:beneficio_id>', methods=['PUT'])
def atualizar_beneficio(beneficio_id):
    """Atualiza um benefício"""
    try:
        beneficio = Beneficio.query.get_or_404(beneficio_id)
        data = request.get_json()
        
        # Atualiza campos
        if 'nome' in data:
            beneficio.nome = data['nome']
        if 'descricao' in data:
            beneficio.descricao = data['descricao']
        if 'tipo' in data:
            beneficio.tipo = data['tipo']
        if 'valor_empresa' in data:
            beneficio.valor_empresa = float(data['valor_empresa'])
        if 'valor_funcionario' in data:
            beneficio.valor_funcionario = float(data['valor_funcionario'])
        if 'ativo' in data:
            beneficio.ativo = data['ativo']
        
        beneficio.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(beneficio.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@beneficio_bp.route('/beneficios/<int:beneficio_id>', methods=['DELETE'])
def deletar_beneficio(beneficio_id):
    """Deleta um benefício"""
    try:
        beneficio = Beneficio.query.get_or_404(beneficio_id)
        beneficio.ativo = False
        beneficio.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Benefício desativado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rotas para Funcionário-Benefício
@beneficio_bp.route('/funcionarios/<int:funcionario_id>/beneficios', methods=['GET'])
def listar_beneficios_funcionario(funcionario_id):
    """Lista benefícios de um funcionário"""
    try:
        funcionario = Funcionario.query.get_or_404(funcionario_id)
        
        beneficios_funcionario = db.session.query(
            FuncionarioBeneficio, Beneficio
        ).join(
            Beneficio, FuncionarioBeneficio.beneficio_id == Beneficio.id
        ).filter(
            FuncionarioBeneficio.funcionario_id == funcionario_id,
            FuncionarioBeneficio.ativo == True
        ).all()
        
        resultado = []
        for func_ben, beneficio in beneficios_funcionario:
            item = func_ben.to_dict()
            item['beneficio'] = beneficio.to_dict()
            resultado.append(item)
        
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@beneficio_bp.route('/funcionarios/<int:funcionario_id>/beneficios', methods=['POST'])
def adicionar_beneficio_funcionario(funcionario_id):
    """Adiciona um benefício a um funcionário"""
    try:
        funcionario = Funcionario.query.get_or_404(funcionario_id)
        data = request.get_json()
        
        # Validações básicas
        if not data.get('beneficio_id') or not data.get('data_inicio'):
            return jsonify({'error': 'Benefício e data de início são obrigatórios'}), 400
        
        # Verifica se benefício existe
        beneficio = Beneficio.query.get(data['beneficio_id'])
        if not beneficio:
            return jsonify({'error': 'Benefício não encontrado'}), 404
        
        # Verifica se funcionário já possui este benefício ativo
        beneficio_existente = FuncionarioBeneficio.query.filter_by(
            funcionario_id=funcionario_id,
            beneficio_id=data['beneficio_id'],
            ativo=True
        ).first()
        
        if beneficio_existente:
            return jsonify({'error': 'Funcionário já possui este benefício ativo'}), 400
        
        data_inicio = datetime.strptime(data['data_inicio'], '%Y-%m-%d').date()
        data_fim = None
        if data.get('data_fim'):
            data_fim = datetime.strptime(data['data_fim'], '%Y-%m-%d').date()
        
        funcionario_beneficio = FuncionarioBeneficio(
            funcionario_id=funcionario_id,
            beneficio_id=data['beneficio_id'],
            data_inicio=data_inicio,
            data_fim=data_fim,
            valor_personalizado=float(data['valor_personalizado']) if data.get('valor_personalizado') else None
        )
        
        db.session.add(funcionario_beneficio)
        db.session.commit()
        
        return jsonify(funcionario_beneficio.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@beneficio_bp.route('/funcionarios/<int:funcionario_id>/beneficios/<int:funcionario_beneficio_id>', methods=['PUT'])
def atualizar_beneficio_funcionario(funcionario_id, funcionario_beneficio_id):
    """Atualiza um benefício de funcionário"""
    try:
        funcionario_beneficio = FuncionarioBeneficio.query.filter_by(
            id=funcionario_beneficio_id,
            funcionario_id=funcionario_id
        ).first_or_404()
        
        data = request.get_json()
        
        # Atualiza campos
        if 'data_inicio' in data:
            funcionario_beneficio.data_inicio = datetime.strptime(data['data_inicio'], '%Y-%m-%d').date()
        if 'data_fim' in data:
            funcionario_beneficio.data_fim = datetime.strptime(data['data_fim'], '%Y-%m-%d').date() if data['data_fim'] else None
        if 'valor_personalizado' in data:
            funcionario_beneficio.valor_personalizado = float(data['valor_personalizado']) if data['valor_personalizado'] else None
        if 'ativo' in data:
            funcionario_beneficio.ativo = data['ativo']
        
        funcionario_beneficio.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(funcionario_beneficio.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@beneficio_bp.route('/funcionarios/<int:funcionario_id>/beneficios/<int:funcionario_beneficio_id>', methods=['DELETE'])
def remover_beneficio_funcionario(funcionario_id, funcionario_beneficio_id):
    """Remove um benefício de um funcionário"""
    try:
        funcionario_beneficio = FuncionarioBeneficio.query.filter_by(
            id=funcionario_beneficio_id,
            funcionario_id=funcionario_id
        ).first_or_404()
        
        funcionario_beneficio.ativo = False
        funcionario_beneficio.data_fim = date.today()
        funcionario_beneficio.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Benefício removido do funcionário com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@beneficio_bp.route('/funcionarios/<int:funcionario_id>/beneficios/relatorio', methods=['GET'])
def relatorio_beneficios_funcionario(funcionario_id):
    """Gera relatório de benefícios de um funcionário"""
    try:
        funcionario = Funcionario.query.get_or_404(funcionario_id)
        
        beneficios_funcionario = db.session.query(
            FuncionarioBeneficio, Beneficio
        ).join(
            Beneficio, FuncionarioBeneficio.beneficio_id == Beneficio.id
        ).filter(
            FuncionarioBeneficio.funcionario_id == funcionario_id
        ).all()
        
        total_valor_empresa = 0
        total_valor_funcionario = 0
        beneficios_ativos = 0
        
        beneficios_lista = []
        for func_ben, beneficio in beneficios_funcionario:
            item = func_ben.to_dict()
            item['beneficio'] = beneficio.to_dict()
            beneficios_lista.append(item)
            
            if func_ben.ativo:
                beneficios_ativos += 1
                valor_empresa = func_ben.valor_personalizado or beneficio.valor_empresa
                valor_funcionario = beneficio.valor_funcionario
                total_valor_empresa += valor_empresa
                total_valor_funcionario += valor_funcionario
        
        relatorio = {
            'funcionario': funcionario.to_dict(),
            'resumo': {
                'total_beneficios': len(beneficios_lista),
                'beneficios_ativos': beneficios_ativos,
                'total_valor_empresa': total_valor_empresa,
                'total_valor_funcionario': total_valor_funcionario
            },
            'beneficios': beneficios_lista
        }
        
        return jsonify(relatorio)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

