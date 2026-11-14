const express = require("express");
const router = express.Router();

const comentariosController = require("../controllers/comentarios.controller");
const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

const idValido = validar(schemas.id, "params");
const tarefaIdValido = validar(schemas.tarefaId, "params");

// GET - LISTAR COMENTÁRIOS DE UMA TAREFA
router.get(
  "/tarefa/:tarefaId",
  tarefaIdValido,
  comentariosController.listar
);

// POST - CRIAR COMENTÁRIO
router.post(
  "/tarefa/:tarefaId",
  tarefaIdValido,
  validar(schemas.comentario),
  comentariosController.criar
);

// DELETE - EXCLUIR COMENTÁRIO
router.delete("/:id", idValido, comentariosController.remover);

module.exports = router;