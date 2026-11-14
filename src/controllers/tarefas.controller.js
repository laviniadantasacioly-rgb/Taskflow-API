
const tarefaModel = require("../models/tarefa.model");
const projetoModel = require("../models/projeto.model");
const prioridadeModel = require("../models/prioridade.model");
const criarErro = require("../../utils/criarErro");

const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

function contarPorColuna(tarefas) {
  return {
    afazer: tarefas.filter((t) => t.coluna === "afazer").length,
    andamento: tarefas.filter((t) => t.coluna === "andamento").length,
    concluido: tarefas.filter((t) => t.coluna === "concluido").length,
  };
}

function contarPorPrioridade(tarefas) {
  return tarefas.reduce((resultado, tarefa) => {
    const descricao = tarefa.prioridade || "Sem prioridade";

    resultado[descricao] = (resultado[descricao] || 0) + 1;

    return resultado;
  }, {});
}

const tarefasController = {
  // GET - LISTAR TAREFAS DO USUÁRIO AUTENTICADO
  async listar(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { coluna } = req.query;

      let resultado = await tarefaModel.listarPorUsuario(usuarioId);

      if (coluna) {
        resultado = resultado.filter(
          (tarefa) => tarefa.coluna === coluna
        );
      }

      res.json(resultado);
    } catch (erro) {
      throw erro;
    }
  },

  // GET - ESTATÍSTICAS DO USUÁRIO AUTENTICADO
  async estatisticas(req, res) {
    try {
      const tarefas = await tarefaModel.listarPorUsuario(
        req.usuario.id
      );

      const porColuna = contarPorColuna(tarefas);
      const porPrioridade = contarPorPrioridade(tarefas);

      const comMaisTarefas = Object.entries(porColuna).sort(
        (a, b) => b[1] - a[1]
      );

      res.json({
        total: tarefas.length,
        porColuna,
        porPrioridade,
        "Mais Tarefas": comMaisTarefas,
      });
    } catch (erro) {
      throw erro;
    }
  },

  // GET - RESUMO DAS TAREFAS DO USUÁRIO AUTENTICADO
  async resumo(req, res) {
    try {
      const tarefas = await tarefaModel.listarPorUsuario(
        req.usuario.id
      );

      const porColuna = contarPorColuna(tarefas);
      const porPrioridade = contarPorPrioridade(tarefas);

      const prioridadeMaisComum = Object.entries(porPrioridade)
        .sort((a, b) => b[1] - a[1])[0];

      const nomePrioridade = prioridadeMaisComum
        ? prioridadeMaisComum[0]
        : "nenhuma";

      const mensagem =
        `Você tem ${tarefas.length} tarefa(s): ` +
        `${porColuna.concluido} concluída(s), ` +
        `${porColuna.andamento} em andamento e ` +
        `${porColuna.afazer} a fazer. ` +
        `A prioridade mais comum: ${nomePrioridade}.`;

      res.json(mensagem);
    } catch (erro) {
      throw erro;
    }
  },

  // GET - BUSCAR TAREFA POR ID
  async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);

      const tarefa = await tarefaModel.buscar(
        id,
        req.usuario.id
      );

      if (!tarefa) {
        throw criarErro(404, "Tarefa não encontrada");
      }

      res.json(tarefa);
    } catch (erro) {
      throw erro;
    }
  },

  // POST - CRIAR TAREFA
  async criar(req, res) {
    try {
      const {
        texto,
        prioridade_id,
        coluna,
        projeto_id,
        ordem,
      } = req.body;

      const usuarioId = req.usuario.id;

      if (typeof texto !== "string" || !texto.trim()) {
        throw criarErro(400, "Texto obrigatório");
      }

      if (
        !Number.isInteger(Number(projeto_id)) ||
        Number(projeto_id) <= 0
      ) {
        throw criarErro(400, "Projeto inválido");
      }

      if (
        !Number.isInteger(Number(prioridade_id)) ||
        Number(prioridade_id) <= 0
      ) {
        throw criarErro(400, "Prioridade inválida");
      }

      if (coluna !== undefined && !COLUNAS_VALIDAS.includes(coluna)) {
        throw criarErro(400, "Coluna inválida");
      }

      if (
        ordem !== undefined &&
        (!Number.isInteger(Number(ordem)) || Number(ordem) < 0)
      ) {
        throw criarErro(400, "Ordem inválida");
      }

      const projeto = await projetoModel.buscarProjeto(
        Number(projeto_id),
        usuarioId
      );

      if (!projeto) {
        throw criarErro(404, "Projeto não encontrado");
      }

      // Verificar se a prioridade existe e está ativa
      const prioridade = await prioridadeModel.buscarAtiva(
        Number(prioridade_id)
      );

      if (!prioridade) {
        throw criarErro(400, "Prioridade inválida ou inativa");
      }

      const novaTarefa = await tarefaModel.adicionar({
        texto: texto.trim(),
        prioridade_id: Number(prioridade_id),
        coluna,
        usuarioId,
        projetoId: Number(projeto_id),
        ordem,
      });

      res.status(201).json(novaTarefa);
    } catch (erro) {
      throw erro;
    }
  },

  // PUT - ATUALIZAR TAREFA
  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);

      const tarefa = await tarefaModel.buscar(
        id,
        req.usuario.id
      );

      if (!tarefa) {
        throw criarErro(404, "Tarefa não encontrada");
      }

      const {
        texto,
        prioridade_id,
        coluna,
        projeto_id,
        ordem,
      } = req.body;

      if (
        texto !== undefined &&
        (typeof texto !== "string" || !texto.trim())
      ) {
        throw criarErro(400, "Texto inválido");
      }

      if (
        prioridade_id !== undefined &&
        (!Number.isInteger(Number(prioridade_id)) ||
          Number(prioridade_id) <= 0)
      ) {
        throw criarErro(400, "Prioridade inválida");
      }

      if (coluna !== undefined && !COLUNAS_VALIDAS.includes(coluna)) {
        throw criarErro(400, "Coluna inválida");
      }

      if (
        ordem !== undefined &&
        (!Number.isInteger(Number(ordem)) || Number(ordem) < 0)
      ) {
        throw criarErro(400, "Ordem inválida");
      }

      if (projeto_id !== undefined) {
        if (
          !Number.isInteger(Number(projeto_id)) ||
          Number(projeto_id) <= 0
        ) {
          throw criarErro(400, "Projeto inválido");
        }

        const projeto = await projetoModel.buscarProjeto(
          Number(projeto_id),
          req.usuario.id
        );

        if (!projeto) {
          throw criarErro(404, "Projeto não encontrado");
        }
      }

      // Verificar a prioridade somente quando ela for alterada
      if (prioridade_id !== undefined) {
        const prioridade = await prioridadeModel.buscarAtiva(
          Number(prioridade_id)
        );

        if (!prioridade) {
          throw criarErro(400, "Prioridade inválida ou inativa");
        }
      }

      const dadosAtualizacao = {};

      if (texto !== undefined) {
        dadosAtualizacao.texto = texto.trim();
      }

      if (prioridade_id !== undefined) {
        dadosAtualizacao.prioridade_id = Number(prioridade_id);
      }

      if (coluna !== undefined) {
        dadosAtualizacao.coluna = coluna;
      }

      if (projeto_id !== undefined) {
        dadosAtualizacao.projeto_id = Number(projeto_id);
      }

      if (ordem !== undefined) {
        dadosAtualizacao.ordem = Number(ordem);
      }

      const atualizada = await tarefaModel.atualizar(
        id,
        dadosAtualizacao,
        req.usuario.id
      );

      if (!atualizada) {
        throw criarErro(404, "Tarefa não encontrada");
      }

      res.json(atualizada);
    } catch (erro) {
      throw erro;
    }
  },

  // DELETE - REMOVER TAREFA
  async remover(req, res) {
    try {
      const id = Number(req.params.id);

      const tarefa = await tarefaModel.buscar(
        id,
        req.usuario.id
      );

      if (!tarefa) {
        throw criarErro(404, "Tarefa não encontrada");
      }

      await tarefaModel.remover(id, req.usuario.id);

      res.status(200).json({
        mensagem: "Tarefa excluída com sucesso",
      });
    } catch (erro) {
      throw erro;
    }
  },
};

module.exports = tarefasController;
