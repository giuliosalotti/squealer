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

//logica di aggiornamento giornaliero, settimanale e mensile

async function aggiornaValorePerUtenti(type, value) {
  try {
    if(type=='M'){
      await User.updateMany({}, { $set: { quotaM: value } });
      console.log('Aggiornamento del valore completato con successo per tutti gli utenti.');
    }else if(type=='W'){
      await User.updateMany({}, { $set: { quotaW: value } });
      console.log('Aggiornamento del valore completato con successo per tutti gli utenti.');
    }else{
      await User.updateMany({}, { $set: { quotaD: value } });
      console.log('Aggiornamento del valore completato con successo per tutti gli utenti.');
    }
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del valore:', error);
  }
}


function eseguiAggiornamento() {
  const giornaliero = 500;
  const settimanale = 3500;
  const mensile = 14000;
  
  // Imposta l'intervallo di esecuzione per l'inizio di ogni mese (il primo giorno del mese)
  setInterval(() => {
    // Verifica se è l'inizio di un nuovo mese
    const dataCorrente = new Date();
    const giornoMese = dataCorrente.getDate();
    const ora = dataCorrente.getHours();
    const minuti = dataCorrente.getMinutes();
    const giornoSettimana = dataCorrente.getDay();

    if (giornoMese === 1 && ora === 0 && minuti === 0) {
      // Esegui l'aggiornamento mensile del valore per tutti gli utenti
      aggiornaValorePerUtenti('M', mensile);
    }
    if(giornoSettimana === 1 && ora === 0 && minuti === 0){
      //esegui l'aggiornamento settimanale
      aggiornaValorePerUtenti('W', settimanale);
    }
    if(ora === 21 && minuti === 0){
      //esegui l'aggiornamento giornaliero
      aggiornaValorePerUtenti('D', giornaliero);
    }
  }, 59000); // Controlla ogni minuto se è l'inizio di un nuovo mese
}

// schema collezione users
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  foto: { type: String, required: true },
  quotaD: { type: Number, required: true },
  quotaW: { type: Number, required: true },
  quotaM: { type: Number, required: true },
});
const User = mongoose.model('User', userSchema);

//schema collezione messaggi
const messaggioSchema = new mongoose.Schema({
  destinazione: [{ simbolo: String, destinatario: String }],
  testo: { type: String, required: true },
  emailutente: { type: String, required: true },
  fotoutente: { type: String, required: true },
  dataOra: { type: Date, required: true },
  like: { type: Number, required: true },
  dislike: { type: Number, required: true },
  views: { type: Number, required: true },
  categoria: { type: String, required: true },
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
  const { email, password, foto, quotaD, quotaW, quotaM } = req.body;
  const newUser = new User({ email, password, foto, quotaD, quotaW, quotaM});
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
  const { destinazione, testo, emailutente, fotoutente, dataOra, like, dislike, views, categoria } = req.body;
  const nuovoMessaggio = new Messaggio({ destinazione, testo, emailutente, fotoutente, dataOra, like, dislike, views, categoria });
  nuovoMessaggio.save()
    .then(() => {
      res.status(201).json({ message: 'Messaggio pubblicato con successo' });
    })
    .catch((error) => {
      console.error('Errore durante la pubblicazione del messaggio:', error);
      res.status(500).json({ message: 'Errore durante la pubblicazione del messaggio' });
    });
});

// route per l'aggiornamento di un messaggio per nuove reaction o cose così
app.put('/messaggi/:id', (req, res) => {
  const idMessaggio = req.params.id;
  const nuovoMessaggio = req.body;
  // Effettua l'aggiornamento del messaggio nel database
  Messaggio.findByIdAndUpdate(idMessaggio, nuovoMessaggio, { new: true })
    .then(messaggioAggiornato => {
      res.status(200).json(messaggioAggiornato);
    })
    .catch(error => {
      console.error('Errore durante l\'aggiornamento del messaggio:', error);
      res.status(500).json({ message: 'Errore durante l\'aggiornamento del messaggio' });
    });
});

// Route per ottenere i messaggi con un determinato destinatario
app.get('/messaggi/:destinatario', (req, res) => {
  const destinatario = req.params.destinatario;
  Messaggio.find({ 'destinazione.destinatario': destinatario })
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



//avviare la funzione di controllo della quota
eseguiAggiornamento();
// Avvia il server in ascolto su una porta specifica
app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
