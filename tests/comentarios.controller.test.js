
const comentariosController = require("../src/controllers/comentarios.controller");
const comentarioModel = require("../src/models/comentario.model");
const tarefaModel = require("../src/models/tarefa.model");

jest.mock("../src/models/comentario.model", () => ({
  listarPorTarefa: jest.fn(),
  buscar: jest.fn(),
  criar: jest.fn(),
  remover: jest.fn(),
}));

jest.mock("../src/models/tarefa.model", () => ({
  buscar: jest.fn(),
}));

describe("comentariosController", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { tarefaId: "1", id: "10" },
      body: { texto: "Comentário de teste" },
      usuario: { id: 2 },
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("listar", () => {
    test("lista comentários quando a tarefa pertence ao usuário", async () => {
      const comentarios = [{ id: 1, texto: "Teste" }];

      tarefaModel.buscar.mockResolvedValue({ id: 1 });
      comentarioModel.listarPorTarefa.mockResolvedValue(comentarios);

      await comentariosController.listar(req, res);

      expect(tarefaModel.buscar).toHaveBeenCalledWith(1, 2);
      expect(comentarioModel.listarPorTarefa).toHaveBeenCalledWith(1, 2);
      expect(res.json).toHaveBeenCalledWith(comentarios);
    });

    test("retorna erro quando a tarefa não pertence ao usuário", async () => {
      tarefaModel.buscar.mockResolvedValue(null);

      await expect(
        comentariosController.listar(req, res),
      ).rejects.toMatchObject({
        status: 404,
        message: "Tarefa não encontrada",
      });

      expect(comentarioModel.listarPorTarefa).not.toHaveBeenCalled();
    });
  });

  describe("criar", () => {
    test("cria comentário com texto válido", async () => {
      const comentario = { id: 10, texto: "Comentário de teste" };

      tarefaModel.buscar.mockResolvedValue({ id: 1 });
      comentarioModel.criar.mockResolvedValue(comentario);

      await comentariosController.criar(req, res);

      expect(comentarioModel.criar).toHaveBeenCalledWith({
        texto: "Comentário de teste",
        tarefaId: 1,
        usuarioId: 2,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(comentario);
    });

    test("rejeita comentário sem texto", async () => {
      req.body.texto = "   ";

      await expect(
        comentariosController.criar(req, res),
      ).rejects.toMatchObject({
        status: 400,
        message: "O texto do comentário é obrigatório",
      });

      expect(tarefaModel.buscar).not.toHaveBeenCalled();
      expect(comentarioModel.criar).not.toHaveBeenCalled();
    });

    test("não cria comentário em tarefa de outro usuário", async () => {
      tarefaModel.buscar.mockResolvedValue(null);

      await expect(
        comentariosController.criar(req, res),
      ).rejects.toMatchObject({
        status: 404,
        message: "Tarefa não encontrada",
      });

      expect(comentarioModel.criar).not.toHaveBeenCalled();
    });
  });

  describe("remover", () => {
    test("exclui comentário do usuário", async () => {
      comentarioModel.buscar.mockResolvedValue({ id: 10 });

      await comentariosController.remover(req, res);

      expect(comentarioModel.buscar).toHaveBeenCalledWith(10, 2);
      expect(comentarioModel.remover).toHaveBeenCalledWith(10, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Comentário excluído com sucesso",
      });
    });

    test("retorna erro quando o comentário não pertence ao usuário", async () => {
      comentarioModel.buscar.mockResolvedValue(null);

      await expect(
        comentariosController.remover(req, res),
      ).rejects.toMatchObject({
        status: 404,
        message: "Comentário não encontrado",
      });

      expect(comentarioModel.remover).not.toHaveBeenCalled();
    });
  });
});
