
const paths = {
  "/comentarios/tarefa/{tarefaId}": {
    get: {
      tags: ["Comentários"],
      summary: "Lista os comentários de uma tarefa",
      parameters: [
        {
          name: "tarefaId",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID da tarefa",
        },
      ],
      responses: {
        200: {
          description: "Lista de comentários",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Comentario",
                },
              },
            },
          },
        },
        400: {
          description: "ID da tarefa inválido",
        },
        401: {
          description: "Não autenticado",
        },
        404: {
          description: "Tarefa não encontrada",
        },
      },
    },

    post: {
      tags: ["Comentários"],
      summary: "Adiciona um comentário a uma tarefa",
      parameters: [
        {
          name: "tarefaId",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID da tarefa",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ComentarioEntrada",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Comentário criado com sucesso",
        },
        400: {
          description: "Texto do comentário inválido",
        },
        401: {
          description: "Não autenticado",
        },
        404: {
          description: "Tarefa não encontrada",
        },
      },
    },
  },

  "/comentarios/{id}": {
    delete: {
      tags: ["Comentários"],
      summary: "Exclui um comentário",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID do comentário",
        },
      ],
      responses: {
        200: {
          description: "Comentário excluído com sucesso",
        },
        400: {
          description: "ID inválido",
        },
        401: {
          description: "Não autenticado",
        },
        404: {
          description: "Comentário não encontrado",
        },
      },
    },
  },
};

const schemas = {
  Comentario: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      texto: {
        type: "string",
        example: "Comecei a desenvolver esta tela.",
      },
      tarefa_id: {
        type: "integer",
        example: 1,
      },
      usuario_id: {
        type: "integer",
        example: 2,
      },
      criado_em: {
        type: "string",
        format: "date-time",
        example: "2026-11-16T18:30:00.000Z",
      },
      usuario: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 2,
          },
          nome: {
            type: "string",
            example: "Junior",
          },
        },
      },
    },
  },

  ComentarioEntrada: {
    type: "object",
    required: ["texto"],
    properties: {
      texto: {
        type: "string",
        example: "Comecei a desenvolver esta tela.",
      },
    },
  },
};

module.exports = { paths, schemas };
