const express = require("express");
const router = express.Router();

const tarefasController = require("../controllers/tarefas.controller");
const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

const idValido = validar(schemas.id, "params");

// GET - LISTAR TAREFAS
router.get(
  "/",
  validar(schemas.filtroTarefas, "query"),
  tarefasController.listar,
);

// GET - ESTATÍSTICAS
router.get("/estatisticas", tarefasController.estatisticas);

// GET - RESUMO DAS TAREFAS
router.get("/estatisticas/resumo", tarefasController.resumo);

// POST - CRIAR TAREFA
router.post("/", validar(schemas.tarefa), tarefasController.criar);

// PUT - ATUALIZAR TAREFA
router.put(
  "/:id",
  idValido,
  validar(schemas.tarefaAtualizacao),
  tarefasController.atualizar,
);

// DELETE - EXCLUIR TAREFA
router.delete("/:id", idValido, tarefasController.remover);

// GET - BUSCAR TAREFA POR ID
router.get("/:id", idValido, tarefasController.buscarPorId);

module.exports = router;
