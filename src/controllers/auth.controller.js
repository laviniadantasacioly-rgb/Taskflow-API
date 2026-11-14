const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const usuarioModel = require("../models/usuario.model");

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // 1. Validar os campos
      if (!email || !senha) {
        return res.status(400).json({
          erro: "Email e senha são obrigatórios",
        });
      }

      // 2. Buscar o usuário no PostgreSQL
      const usuario = await usuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({
          erro: {
            mensagem: "E-mail ou senha incorretos",
          },
        });
      }

      // 3. Verificar a senha com bcrypt
      const senhaCorreta = await bcrypt.compare(
        senha,
        usuario.senha_hash
      );

      if (!senhaCorreta) {
        return res.status(401).json({
          erro: {
            mensagem: "E-mail ou senha incorretos",
          },
        });
      }

      // 4. Gerar o token JWT
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        process.env.JWT_SECRET,
        { expiresIn: "8h" },
      );

      // 5. Retornar o token e os dados públicos
      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
        },
      });
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);

      return res.status(500).json({
        erro: "Erro interno ao realizar login",
      });
    }
  },
};

module.exports = authController;
