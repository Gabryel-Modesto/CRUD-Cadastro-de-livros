const express = require("express");
const { engine } = require("express-handlebars"); 
const pool = require('./db/conexao')

const app = express();
const port = 3000;

// Middleware para processar dados enviados via formulário (urlencoded)
// O 'extended: true' permite que objetos aninhados sejam passados através da URL
app.use(
  express.urlencoded({
    extended: true, // Permite que objetos e arrays sejam passados na URL
  })
);

// Middleware para processar dados JSON enviados no corpo da requisição
app.use(express.json());

// Configuração do Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

// Define uma rota POST para '/books/insertbooks'
app.post("/books/insertbooks", (req, res) => {
  // Extrai o título do livro do corpo da requisição
  const title = req.body.title;
  // Extrai a quantidade de páginas do livro do corpo da requisição
  const pages = req.body.pages;

  // Cria a string SQL para inserir um novo livro na tabela 'books'
  // DUAS ?? PARA COLUNAS E UMA ? PARA DADOS
  const sql = `INSERT INTO books (??,?? ) VALUES (?, ?)`;
  const data = ['title', 'pages', title, pages]

  // Executa a consulta SQL no banco de dados
  pool.query(sql, data, (err) => {
    // Verifica se ocorreu um erro na execução da consulta
    if (err) {
      // Loga o erro no console para depuração
      console.log(err);
    }

    // Redireciona o usuário para a rota raiz após a tentativa de inserção
    res.redirect("/books");
  });
});

// Rota para buscar todos os livros do banco de dados
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM books";

  pool.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const books = data;
    console.log(books);

    res.render("books", { books });
  });
});

// Rota para buscar um livro específico pelo ID
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM books WHERE ?? = ?`;
  const data = ['id', id];

  pool.query(sql, data, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const book = data[0];
    res.render("book", { book });
  });
});

// Rota para renderizar o formulário de edição de um livro específico
app.get("/books/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM books WHERE ?? = ?`;
  const data = ['id', id];

  pool.query(sql, data, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const book = data[0];
    res.render('editbook', { book });
  });
});

// Rota para atualizar as informações de um livro
app.post('/books/updatebook', (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const pages = req.body.pages;

  const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`;
  const data = ['title', title, 'pages', pages, 'id', id];

  pool.query(sql, data, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/books');
  });
});

// Rota para remover um livro específico pelo ID
app.post('/books/remove/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM books WHERE ?? = ?`;
  const data = ['id', id];
  
  pool.query(sql, data, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/books');
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});