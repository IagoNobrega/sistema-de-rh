from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models.user import db
from src.models.funcionario import Funcionario

funcionario_bp = Blueprint('funcionario', __name__)

@funcionario_bp.route('/funcionarios', methods=['GET'])
def listar_funcionarios():
    """Lista todos os funcionários"""
    try:
        funcionarios = Funcionario.query.all()
        return jsonify([funcionario.to_dict() for funcionario in funcionarios])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios', methods=['POST'])
def criar_funcionario():
    """Cria um novo funcionário"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if not data.get('nome') or not data.get('cpf') or not data.get('email'):
            return jsonify({'error': 'Nome, CPF e email são obrigatórios'}), 400
        
        # Converte data de admissão
        data_admissao = datetime.strptime(data['data_admissao'], '%Y-%m-%d').date()
        
        funcionario = Funcionario(
            nome=data['nome'],
            cpf=data['cpf'],
            email=data['email'],
            telefone=data.get('telefone'),
            endereco=data.get('endereco'),
            cargo=data['cargo'],
            departamento=data.get('departamento'),
            salario_base=float(data['salario_base']),
            data_admissao=data_admissao
        )
        
        db.session.add(funcionario)
        db.session.commit()
        
        return jsonify(funcionario.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios/<int:funcionario_id>', methods=['GET'])
def obter_funcionario(funcionario_id):
    """Obtém um funcionário específico"""
    try:
        funcionario = Funcionario.query.get_or_404(funcionario_id)
        return jsonify(funcionario.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios/<int:funcionario_id>', methods=['PUT'])
def atualizar_funcionario(funcionario_id):
    """Atualiza um funcionário"""
    try:
        funcionario = Funcionario.query.get_or_404(funcionario_id)
        data = request.get_json()
        
        # Atualiza campos
        if 'nome' in data:
            funcionario.nome = data['nome']
        if 'email' in data:
            funcionario.email = data['email']
        if 'telefone' in data:
            funcionario.telefone = data['telefone']
        if 'endereco' in data:
            funcionario.endereco = data['endereco']
        if 'cargo' in data:
            funcionario.cargo = data['cargo']
        if 'departamento' in data:
            funcionario.departamento = data['departamento']
        if 'salario_base' in data:
            funcionario.salario_base = float(data['salario_base'])
        if 'status' in data:
            funcionario.status = data['status']
        
        funcionario.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(funcionario.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios/<int:funcionario_id>', methods=['DELETE'])
def deletar_funcionario(funcionario_id):
    """Deleta um funcionário"""
    try:
        funcionario = Funcionario.query.get_or_404(funcionario_id)
        db.session.delete(funcionario)
        db.session.commit()
        
        return jsonify({'message': 'Funcionário deletado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios/buscar', methods=['GET'])
def buscar_funcionarios():
    """Busca funcionários por nome, CPF ou email"""
    try:
        termo = request.args.get('q', '')
        if not termo:
            return jsonify([])
        
        funcionarios = Funcionario.query.filter(
            (Funcionario.nome.contains(termo)) |
            (Funcionario.cpf.contains(termo)) |
            (Funcionario.email.contains(termo))
        ).all()
        
        return jsonify([funcionario.to_dict() for funcionario in funcionarios])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

