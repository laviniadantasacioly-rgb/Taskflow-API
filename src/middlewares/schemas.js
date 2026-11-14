const schemas = {
  id: {
    id: {
      obrigatorio: true,
      tipo: "inteiro",
    },
  },

  filtroTarefas: {
    coluna: {
      obrigatorio: false,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },
  },

  // POST - CRIAR TAREFA
  tarefa: {
    texto: {
      obrigatorio: true,
      tipo: "string",
    },
    prioridade_id: {
      obrigatorio: true,
      tipo: "number",
    },
    coluna: {
      obrigatorio: false,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },
    projeto_id: {
      obrigatorio: true,
      tipo: "number",
    },
    ordem: {
      obrigatorio: false,
      tipo: "number",
    },
  },

  // PUT - ATUALIZAR TAREFA
  tarefaAtualizacao: {
    texto: {
      obrigatorio: false,
      tipo: "string",
    },
    prioridade_id: {
      obrigatorio: false,
      tipo: "number",
    },
    coluna: {
      obrigatorio: false,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },
    projeto_id: {
      obrigatorio: false,
      tipo: "number",
    },
    ordem: {
      obrigatorio: false,
      tipo: "number",
    },
  },

  usuario: {
    nome: {
      obrigatorio: true,
      tipo: "string",
      minLength: 3,
    },
    email: {
      obrigatorio: true,
      tipo: "string",
      formato: "email",
    },
    senha_hash: {
      obrigatorio: true,
      tipo: "string",
      minLength: 6,
    },
  },

  projeto: {
    nome: {
      obrigatorio: true,
      tipo: "string",
    },
    descricao: {
      obrigatorio: false,
      tipo: "string",
      maxLength: 200,
    },
  },

  descricao: {
    obrigatorio: false,
    tipo: "string",
    maxLength: 200,
  },
  // VALIDAÇÃO DO ID DA TAREFA NOS COMENTÁRIOS
  tarefaId: {
    tarefaId: {
      obrigatorio: true,
      tipo: "inteiro",
    },
  },

  // POST - CRIAR COMENTÁRIO
  comentario: {
    texto: {
      obrigatorio: true,
      tipo: "string",
    },
  },
};

module.exports = schemas;
