//Middleware de seguranca para validar token JWT

const jwt = require('jsonwebtoken');
const config = require('../../config.js');

class TokenValido {
  async check(request, response, next) { //check: middleware que roda antes do controller. //next: manda seguir para o proximo controller se estiver tudo certo. 
    const cabecalhoAuth = request.headers['authorization'];

    //se não vier nada do header eu bloqueio:
    if (!cabecalhoAuth) {
      return response.status(401).json({ //401, falta autorização. 
        message: 'Sem autorizacao ou nao possui authorization nos headers da requisicao.',
      });
    }

    //se o cabecalho de autenticacao bearer não foi fornecido:
    if (!cabecalhoAuth.startsWith('Bearer')) {
      return response.status(401).json({
        message: 'mecanismo de autenticacao invalido, configure Bearer Token.',
      });
    }

    const token = cabecalhoAuth.split(' ')[1];
    //se o cabecalho de autenticacao foi fornecido mas o token não foi:
    if (!token) {
      return response.status(401).json({
        message: 'Bearer token nao fornecido.',
      });
    }

    //verifica token JWT
    jwt.verify(token, config.jwt.secret, (erro, clientedata) => { //confere se tem o mesmo segredo, se não expirou
      if (erro) {
        return response.status(403).json({
          message: 'token esta invalido, realize o login novamente.',
        });
      }
      next(); //segue a requisição. (vai para o controller)
    });
  }
}
module.exports = new TokenValido();
