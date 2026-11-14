
const comentarioModel = require("../models/comentario.model");
const tarefaModel = require("../models/tarefa.model");
const criarErro = require("../../utils/criarErro");

const comentariosController = {
  // GET - LISTAR COMENTÁRIOS DE UMA TAREFA
  async listar(req, res) {
    const tarefaId = Number(req.params.tarefaId);
    const usuarioId = req.usuario.id;

    const tarefa = await tarefaModel.buscar(tarefaId, usuarioId);

    if (!tarefa) {
      throw criarErro(404, "Tarefa não encontrada");
    }

    const comentarios = await comentarioModel.listarPorTarefa(
      tarefaId,
      usuarioId
    );

    res.json(comentarios);
  },

  // POST - CRIAR COMENTÁRIO
  async criar(req, res) {
    const tarefaId = Number(req.params.tarefaId);
    const usuarioId = req.usuario.id;
    const { texto } = req.body;

    if (typeof texto !== "string" || !texto.trim()) {
      throw criarErro(400, "O texto do comentário é obrigatório");
    }

    const tarefa = await tarefaModel.buscar(tarefaId, usuarioId);

    if (!tarefa) {
      throw criarErro(404, "Tarefa não encontrada");
    }

    const novoComentario = await comentarioModel.criar({
      texto: texto.trim(),
      tarefaId,
      usuarioId,
    });

    res.status(201).json(novoComentario);
  },

  // DELETE - EXCLUIR COMENTÁRIO
  async remover(req, res) {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;

    const comentario = await comentarioModel.buscar(id, usuarioId);

    if (!comentario) {
      throw criarErro(404, "Comentário não encontrado");
    }

    await comentarioModel.remover(id, usuarioId);

    res.status(200).json({
      mensagem: "Comentário excluído com sucesso",
    });
  },
};

module.exports = comentariosController;
