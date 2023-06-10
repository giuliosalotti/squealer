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

// Definisci lo schema per la collezione "users"
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Crea il modello per la collezione "users"
const User = mongoose.model('User', userSchema);

// Configura il parser del corpo della richiesta per ottenere i dati inviati dall'utente
app.use(bodyParser.json());



// Route per creare un nuovo utente
app.post('/login/signin', (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
// Salva il nuovo utente nel database
  newUser.save()
    .then(() => {
      res.status(201).json({ message: 'Utente creato con successo' });
    })
    .catch((error) => {
      console.error('Errore durante la creazione dell\'utente:', error);
      res.status(500).json({ message: 'Errore durante la creazione dell\'utente' });
    });
});

app.post('/login/login', (req, res) => {
  const { email, password } = req.body;
  // Cerca l'utente corrispondente all'email fornita nel database
  User.findOne({ email })
    .then(user => {
      if (!user) {
        // L'utente non esiste
        return res.status(404).json({ message: 'Utente non trovato' });
      }
      // Verifica la corrispondenza della password
      if (user.password !== password) {
        // La password non è corretta
        return res.status(401).json({ message: 'Password errata' });
      }
      // Login riuscito
      res.status(200).json({ message: 'Login effettuato con successo' });
    })
    .catch(error => {
      console.error('Errore durante il login:', error);
      res.status(500).json({ message: 'Errore durante il login' });
    });
});



// Avvia il server in ascolto su una porta specifica
app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
