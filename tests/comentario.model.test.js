
const prisma = require("../src/database/prisma");
const comentarioModel = require("../src/models/comentario.model");

jest.mock("../src/database/prisma", () => ({
  comentarios: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("comentarioModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lista comentários de uma tarefa pertencente ao usuário", async () => {
    prisma.comentarios.findMany.mockResolvedValue([]);

    await comentarioModel.listarPorTarefa(1, 2);

    expect(prisma.comentarios.findMany).toHaveBeenCalledWith({
      where: {
        tarefa_id: 1,
        tarefas: {
          usuario_id: 2,
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
  });

  test("busca comentário pelo ID e usuário", async () => {
    prisma.comentarios.findFirst.mockResolvedValue(null);

    await comentarioModel.buscar(5, 2);

    expect(prisma.comentarios.findFirst).toHaveBeenCalledWith({
      where: {
        id: 5,
        usuario_id: 2,
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
  });

  test("cria comentário com os dados informados", async () => {
    const comentario = {
      id: 1,
      texto: "Comentário de teste",
      tarefa_id: 3,
      usuario_id: 2,
    };

    prisma.comentarios.create.mockResolvedValue(comentario);

    const resultado = await comentarioModel.criar({
      texto: "Comentário de teste",
      tarefaId: 3,
      usuarioId: 2,
    });

    expect(prisma.comentarios.create).toHaveBeenCalledWith({
      data: {
        texto: "Comentário de teste",
        tarefa_id: 3,
        usuario_id: 2,
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

    expect(resultado).toEqual(comentario);
  });

  test("não exclui comentário inexistente", async () => {
    prisma.comentarios.findFirst.mockResolvedValue(null);

    const resultado = await comentarioModel.remover(10, 2);

    expect(resultado).toBeNull();
    expect(prisma.comentarios.delete).not.toHaveBeenCalled();
  });

  test("exclui comentário existente", async () => {
    const comentario = {
      id: 10,
      texto: "Comentário de teste",
      usuario_id: 2,
    };

    prisma.comentarios.findFirst.mockResolvedValue(comentario);
    prisma.comentarios.delete.mockResolvedValue(comentario);

    const resultado = await comentarioModel.remover(10, 2);

    expect(prisma.comentarios.findFirst).toHaveBeenCalled();
    expect(prisma.comentarios.delete).toHaveBeenCalledWith({
      where: {
        id: 10,
      },
    });

    expect(resultado).toEqual(comentario);
  });
});
