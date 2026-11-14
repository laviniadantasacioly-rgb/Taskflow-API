const validar = require("../src/middlewares/validar");
const schemas = require("../src/middlewares/schemas");

// Uma tarefa com todos os campos certos
function tarefaValida() {
  return {
    texto: "Revisar o plano de teste",
    prioridade_id: 2,
    coluna: "afazer",
    usuario_id: 1,
    projeto_id: 1,
  };
}

// Executa a função e devolve o erro que ela lançou
function pegarErro(funcao) {
  try {
    funcao();
  } catch (erro) {
    return erro;
  }
}

describe("validar", () => {
  test("chama o next quando os dados estão corretos", () => {
    const middlewares = validar(schemas.tarefa);
    const req = { body: tarefaValida() };
    const next = jest.fn();

    middlewares(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("sem body: 400 com um detalhe por campo obrigatório", () => {
    const middleware = validar(schemas.tarefa);
    const req = {};
    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.message).toBe("Dados inválidos");
    expect(erro.detalhes).toEqual([
      "O campo 'texto' é obrigatório",
      "O campo 'prioridade_id' é obrigatório",
      "O campo 'projeto_id' é obrigatório",
    ]);

    expect(next).not.toHaveBeenCalled();
  });

  test("coluna fora da lista: diz os valores aceitos", () => {
    const middleware = validar(schemas.tarefa);
    const req = { body: { ...tarefaValida(), coluna: "feito" } };
    const next = jest.fn();
    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.detalhes).toEqual([
      "O campo 'coluna' deve ser um de: afazer, andamento, concluido",
    ]);
    expect(next).not.toHaveBeenCalled();
  });

  test("chama o next quando os dados estão certos", () => {
    const middleware = validar(schemas.tarefa);
    const req = { body: tarefaValida() };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("coluna fora da lista: diz os valores aceitos", () => {
    const middleware = validar(schemas.tarefa);
    const req = { body: { ...tarefaValida(), coluna: "feito" } };
    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.detalhes).toEqual([
      "O campo 'coluna' deve ser um de: afazer, andamento, concluido",
    ]);
    expect(next).not.toHaveBeenCalled();
  });

  test('id da URL: aceita "7" e barra "abc"', () => {
    const middleware = validar(schemas.id, "params");
    const nextBom = jest.fn();
    const nextRuim = jest.fn();

    middleware({ params: { id: "7" } }, {}, nextBom);

    const erro = pegarErro(() =>
      middleware({ params: { id: "abc" } }, {}, nextRuim),
    );

    expect(nextBom).toHaveBeenCalledTimes(1);
    expect(erro.detalhes).toEqual([
      "O campo 'id' deve ser um número inteiro positivo",
    ]);

    expect(nextRuim).not.toHaveBeenCalled();
  });

  test("campo opcional não enviado não gera erro", () => {
    const middleware = validar(schemas.projeto);
    const req = { body: { nome: "TaskFlow" } };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("tarefaId da URL: aceita número inteiro válido", () => {
    const middleware = validar(schemas.tarefaId, "params");
    const next = jest.fn();

    middleware({ params: { tarefaId: "7" } }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("tarefaId da URL: barra valor inválido", () => {
    const middleware = validar(schemas.tarefaId, "params");
    const next = jest.fn();

    const erro = pegarErro(() =>
      middleware({ params: { tarefaId: "abc" } }, {}, next),
    );

    expect(erro.status).toBe(400);
    expect(erro.detalhes).toEqual([
      "O campo 'tarefaId' deve ser um número inteiro positivo",
    ]);

    expect(next).not.toHaveBeenCalled();
  });

  test("comentário sem texto: retorna erro de campo obrigatório", () => {
    const middleware = validar(schemas.comentario);
    const next = jest.fn();

    const erro = pegarErro(() => middleware({ body: {} }, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.detalhes).toEqual(["O campo 'texto' é obrigatório"]);

    expect(next).not.toHaveBeenCalled();
  });

  test("comentário com texto: chama next", () => {
    const middleware = validar(schemas.comentario);
    const next = jest.fn();

    middleware({ body: { texto: "Comentário de teste" } }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
