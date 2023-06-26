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
  foto: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

//schema collezione messaggi
const messaggioSchema = new mongoose.Schema({
  destinazione: { type: String, required: true },
  testo: { type: String, required: true },
  emailutente: { type: String, required: true },
  fotoutente: { type: String, required: true },
});
const Messaggio = mongoose.model('Messaggio', messaggioSchema, 'messaggi');

//schema collezione canali
const canaleSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  immagine: { type: String, required: true },
  creatore: [{ type: userSchema, required: true }],
});
const Canale = mongoose.model('Canale', canaleSchema, 'canali');



// Configura il parser del corpo della richiesta per ottenere i dati inviati dall'utente
app.use(bodyParser.json());



// Route per creare un nuovo utente
app.post('/login/signin', (req, res) => {
  const { email, password, foto } = req.body;
  const newUser = new User({ email, password, foto});
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
      res.status(200).json({ message: 'Login effettuato con successo', user }); 
    })
    .catch(error => {
      console.error('Errore durante il login:', error);
      res.status(500).json({ message: 'Errore durante il login' });
    });
});

//route getuserbyemail -- serve ad esempio per aggiungere un determinato utente ad un canale
app.post('/getuser', (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }
      res.status(200).json({ message: 'utente trovato con successo', user }); 
    })
    .catch(error => {
      console.error('Errore durante la ricerca:', error);
      res.status(500).json({ message: 'Errore durante la ricerca' });
    });
});

//route aggiunta messaggio
app.post('/messaggi', (req, res) => {
  const { destinazione, testo, emailutente, fotoutente } = req.body;
  const nuovoMessaggio = new Messaggio({ destinazione, testo, emailutente, fotoutente });
  nuovoMessaggio.save()
    .then(() => {
      res.status(201).json({ message: 'Messaggio pubblicato con successo' });
    })
    .catch((error) => {
      console.error('Errore durante la pubblicazione del messaggio:', error);
      res.status(500).json({ message: 'Errore durante la pubblicazione del messaggio' });
    });
});

// Route per ottenere i messaggi con un determinato destinatario
app.get('/messaggi/:destinatario', (req, res) => {
  const destinatario = req.params.destinatario;
  Messaggio.find({ destinazione: destinatario })
    .then(messaggi => {
      res.status(200).json(messaggi);
    })
    .catch(error => {
      console.error('Errore durante il recupero dei messaggi:', error);
      res.status(500).json({ message: 'Errore durante il recupero dei messaggi' });
    });
});

//route per ottenere la lista dei canali
app.get('/canali', (req, res) => {
  Canale.find()
    .then(canali => {
      res.status(200).json(canali);
    })
    .catch(error => {
      console.error('Errore durante il recupero dei canali:', error);
      res.status(500).json({ message: 'Errore durante il recupero dei canali' });
    });
});

//route per aggiungere un canale
app.post('/canali', (req, res) => {
  const { nome, immagine, creatore } = req.body;
  const nuovoCanale = new Canale({nome, immagine, creatore});
  nuovoCanale.save()
    .then(canale => {
      res.status(200).json(canale);
    })
    .catch(error => {
      console.error('Errore durante l\'aggiunta del canale:', error);
      res.status(500).json({ message: 'Errore durante l\'aggiunta del canale' });
    });
});

//route per eliminare un canale
app.delete('/canali/:id', (req, res) => {
  const canaleId = req.params.id;
  Canale.findByIdAndRemove(canaleId)
    .then(() => {
      res.status(200).json({ message: 'Canale eliminato con successo' });
    })
    .catch(error => {
      console.error('Errore durante l\'eliminazione del canale:', error);
      res.status(500).json({ message: 'Errore durante l\'eliminazione del canale' });
    });
});





// Avvia il server in ascolto su una porta specifica
app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
