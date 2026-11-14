
const prisma = require("../database/prisma");

const comentarioModel = {
  // Listar comentários de uma tarefa
  async listarPorTarefa(tarefaId, usuarioId) {
    return prisma.comentarios.findMany({
      where: {
        tarefa_id: Number(tarefaId),
        tarefas: {
          usuario_id: Number(usuarioId),
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        criado_em: "asc",
      },
    });
  },

  // Buscar comentário por ID
  async buscar(id, usuarioId) {
    return prisma.comentarios.findFirst({
      where: {
        id: Number(id),
        usuario_id: Number(usuarioId),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  },

  // Cadastrar comentário
  async criar({ texto, tarefaId, usuarioId }) {
    return prisma.comentarios.create({
      data: {
        texto,
        tarefa_id: Number(tarefaId),
        usuario_id: Number(usuarioId),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  },

  // Excluir comentário
  async remover(id, usuarioId) {
    const comentario = await this.buscar(id, usuarioId);

    if (!comentario) {
      return null;
    }

    return prisma.comentarios.delete({
      where: {
        id: Number(id),
      },
    });
  },
};

module.exports = comentarioModel;

