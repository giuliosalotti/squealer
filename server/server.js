// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inizializza l'app Express
const app = express();
app.use(cors()); //per accettare connessioni da porte differrenti

// Connessione al database MongoDB
mongoose.connect('mongodb://localhost:27017/Squeeler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connessione al database stabilita');
})
.catch((error) => {
  console.error('Errore durante la connessione al database:', error);
  process.exit(1);
});

// schema collezione users
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

//schema collezione messaggi
const messaggioSchema = new mongoose.Schema({
  destinazione: { type: String, required: true },
  testo: { type: String, required: true },
  emailutente: { type: String, required: true }
});
const Messaggio = mongoose.model('Messaggio', messaggioSchema, 'messaggi');



// Configura il parser del corpo della richiesta per ottenere i dati inviati dall'utente
app.use(bodyParser.json());



// Route per creare un nuovo utente
app.post('/login/signin', (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  newUser.save()
    .then(() => {
      res.status(201).json({ message: 'Utente creato con successo' });
    })
    .catch((error) => {
      console.error('Errore durante la creazione dell\'utente:', error);
      res.status(500).json({ message: 'Errore durante la creazione dell\'utente' });
    });
});

//route login
app.post('/login/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: 'Password errata' });
      }
      res.status(200).json({ message: 'Login effettuato con successo' });
    })
    .catch(error => {
      console.error('Errore durante il login:', error);
      res.status(500).json({ message: 'Errore durante il login' });
    });
});

//route aggiunta messaggio
app.post('/messaggi', (req, res) => {
  const { destinazione, testo, emailutente } = req.body;
  const nuovoMessaggio = new Messaggio({ destinazione, testo, emailutente });
  nuovoMessaggio.save()
    .then(() => {
      res.status(201).json({ message: 'Messaggio pubblicato con successo' });
    })
    .catch((error) => {
      console.error('Errore durante la pubblicazione del messaggio:', error);
      res.status(500).json({ message: 'Errore durante la pubblicazione del messaggio' });
    });
});



// Avvia il server in ascolto su una porta specifica
app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
