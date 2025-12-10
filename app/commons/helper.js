const config = require('../../config.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.hashSenha = (senha) => {
  const hash = crypto.createHash('sha256'); //Cria um objeto hash usando o algoritmo sha256 
  hash.update(senha); //atualiza o conteudo dele com a senha para processar (ou seja, pego a senha digitada pelo usuário e colono nele)
  return hash.digest('hex'); 
};

exports.gerarTokenAcesso = (nome, id) => { //Gera token de autenticação, nele terá o nome e id do usuário
  return jwt.sign({ nome, id }, config.jwt.secret, {
    expiresIn: config.jwt.expiration, // define por quanto tempo o token é válido. 
  });
};

// No login: verifica email/senha, se estiver ok, chama gerarTokenAcesso para criar o token e devolver para o usuário.

//Nas rotas protegidas: verifica se o token enviado pelo usuário é válido (usando jwt.verify) antes de permitir o acesso.
//O cliente manda o token no POSTMAN. 