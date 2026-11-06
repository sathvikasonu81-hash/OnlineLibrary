const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", copies: 5, available: 5 },
  { id: 2, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", copies: 3, available: 3 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", copies: 2, available: 2 }
];
let students = [{ id: 1, name: "Ananya", email: "ananya@example.com" }];
let loans = [];
let nextBook = 4, nextStudent = 2, nextLoan = 1;

app.get("/api/books", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  res.json(books.filter(b => `${b.title} ${b.author}`.toLowerCase().includes(q)));
});
app.post("/api/books", (req, res) => {
  const { title, author, copies } = req.body;
  if (!title || !author || Number(copies) < 1) return res.status(400).json({ error: "Enter title, author and at least one copy." });
  const book = { id: nextBook++, title, author, copies: Number(copies), available: Number(copies) };
  books.push(book); res.status(201).json(book);
});
app.put("/api/books/:id", (req, res) => {
  const b = books.find(x => x.id === Number(req.params.id));
  if (!b) return res.status(404).json({ error: "Book not found." });
  b.title = req.body.title || b.title; b.author = req.body.author || b.author;
  res.json(b);
});
app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (loans.some(l => l.bookId === id && !l.returned)) return res.status(400).json({ error: "Cannot delete a book that is currently issued." });
  books = books.filter(b => b.id !== id); res.json({ message: "Book deleted." });
});
app.post("/api/students", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required." });
  const student = { id: nextStudent++, name, email }; students.push(student);
  res.status(201).json(student);
});
app.get("/api/students", (req, res) => res.json(students));
app.post("/api/loans", (req, res) => {
  const book = books.find(b => b.id === Number(req.body.bookId));
  const student = students.find(s => s.id === Number(req.body.studentId));
  if (!book || !student) return res.status(400).json({ error: "Select a valid book and student." });
  if (book.available < 1) return res.status(400).json({ error: "No copies are currently available." });
  book.available--;
  const loan = { id: nextLoan++, bookId: book.id, bookTitle: book.title, studentName: student.name,
    issueDate: new Date().toISOString().slice(0,10), dueDate: new Date(Date.now()+7*86400000).toISOString().slice(0,10), returned: false };
  loans.push(loan); res.status(201).json(loan);
});
app.get("/api/loans", (req, res) => res.json(loans.map(l => ({ ...l, fine: l.returned ? 0 : Math.max(0, Math.floor((Date.now()-new Date(l.dueDate+"T00:00:00"))/86400000))*10 }))));
app.post("/api/loans/:id/return", (req, res) => {
  const loan = loans.find(l => l.id === Number(req.params.id) && !l.returned);
  if (!loan) return res.status(404).json({ error: "Active issue record not found." });
  loan.returned = true; const book = books.find(b => b.id === loan.bookId); if (book) book.available++;
  res.json({ message: "Book returned successfully.", loan });
});
app.get("/api/health", (req,res) => res.json({status:"ok", app:"Online Library Management System"}));
if (require.main === module) app.listen(process.env.PORT || 3000, () => console.log(`Library app running at http://localhost:${process.env.PORT || 3000}`));
module.exports = app;
