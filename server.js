import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3003;
const SECRET_KEY = 'f21e25478227affd18643586a765653d';//Colocar em variável de ambiente'

app.use(express.json());

const users = [
    { id: 1, username: 'user1', password: 'pass', role: 'admin' }, //bscript para senha
    { id: 2, username: 'user2', password: 'pass', role: 'admin' },
    { id: 3, username: 'user3', password: 'pass', role: 'usuario' },
];

//Rota para realizar a autenticação e gerar o token JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    console.log(user)
    if(user){
        const token = jwt.sign({ id: user.id, role: user.role}, SECRET_KEY, { expiresIn: '1h'});
        res.status(200).json({ token})
    }else{
        res.status(401).json({message: 'Usuário ou senha inválidos'})
    }
})

const authenticateToken = (req,res, next) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json({message: 'Token não fornecido'});

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json({message: 'Token inválido'});

        req.user = user;
        next();
    })
}
//Rota Autenticada
app.get
('/protected', authenticateToken, (req, res) => {
    res.status(200).json({message: 'Acesso concedido à rota protegida', user: req.user})
})

//Rota Autenticada e Privada para usuário admin
app.get('/admin', authenticateToken, (req, res) => {
    req.user.role !== 'admin' ? res.status(403).json({message: 'Acesso negado: Recurso restrito a administradores'}) :
    res.status(200).json({message: 'Acesso concedido à rota de administrador', user: req.user})
})
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});