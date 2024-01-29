const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: false
}));


app.get('/', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome back, ${req.session.user.firstName} ${req.session.user.lastName}!
    <br>
    Mobile: ${req.session.user.mobile}
    <br>
    Email: ${req.session.user.email}
    <br>
    <img src="${req.session.user.picture}" alt="Profile Picture">`);
  } else {
    res.send('Please <a href="/login">login</a> or <a href="/register">register</a>.');
  }
});

app.get('/register', (req, res) => {
  res.send(`
    <h2>Registration</h2>
    <section class="section" >

    <form action="/register" method="post">
      <input type="text" name="firstName" placeholder="First Name" required><br>
      <input type="text" name="lastName" placeholder="Last Name" required><br>
      <input type="tel" name="mobile" placeholder="Mobile Number" required><br>
      <input type="email" name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <input type="text" name="picture" placeholder="Profile Picture URL"><br>
      <input type="submit" value="Register">
    </form>
  `);
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, mobile, email, password, picture } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  req.session.user = { firstName, lastName, mobile, email, password: hashedPassword, picture };
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form action="/login" method="post">
      <input type="email" name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <input type="submit" value="Login">
    </form>
  `);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (req.session.user && req.session.user.email === email) {
    const passwordMatch = await bcrypt.compare(password, req.session.user.password);
    if (passwordMatch) {
      res.redirect('/');
    } else {
      res.send('Invalid Username or Password. Please try again.');
    }
  } else {
    res.send('Invalid Username or Password. Please try again.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});