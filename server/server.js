// server.js

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
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
    if(ora === 0 && minuti === 0){
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
  categoria: [{ type: String }],
  reazioni: [{ type: String }],
  risposte: [{ type: String }],
});
const Messaggio = mongoose.model('Messaggio', messaggioSchema, 'messaggi');

//schema collezione canali
const canaleSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  immagine: { type: String, required: true },
  creatore: [{ type: userSchema, required: true }],
});
const Canale = mongoose.model('Canale', canaleSchema, 'canali');

//schema collezione vip
const vipSchema = new mongoose.Schema({
  email: { type: String, required: true },
});
const Vip = mongoose.model('Vip', vipSchema, 'vip');

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

//route per aggiornare quote
app.put('/users', (req, res) => {
  const { email, quotaD, quotaW, quotaM } = req.body;
  User.findOneAndUpdate(
    { email },
    { $set: { quotaD, quotaW, quotaM } },
    { new: true }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }
      res.status(200).json({ message: 'Quote aggiornate con successo', user: updatedUser });
    })
    .catch(error => {
      console.error('Errore durante l\'aggiornamento delle quote:', error);
      res.status(500).json({ message: 'Errore durante l\'aggiornamento delle quote' });
    });
});
//route per la modifica della password
app.put('/users/changepassword', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }
      user.password = password;
      return user.save();
    })
    .then(updatedUser => {
      res.status(200).json({ message: 'Password aggiornata con successo' });
    })
    .catch(error => {
      console.error('Errore durante l\'aggiornamento della password:', error);
      res.status(500).json({ message: 'Errore durante l\'aggiornamento della password' });
    });
});


//route aggiunta messaggio
app.post('/messaggi', (req, res) => {
  const { destinazione, testo, emailutente, fotoutente, dataOra, like, dislike, views, categoria, reazioni, risposte } = req.body;
  const nuovoMessaggio = new Messaggio({ destinazione, testo, emailutente, fotoutente, dataOra, like, dislike, views, categoria, reazioni, risposte});
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

// Route per ottenere i messaggi di un determinato utente
app.get('/messaggi/vip/:emailutente', (req, res) => {
  const emailutente = req.params.emailutente;
  Messaggio.find({ emailutente })
    .then(messaggi => {
      res.status(200).json(messaggi);
    })
    .catch(error => {
      console.error('Errore durante il recupero dei messaggi:', error);
      res.status(500).json({ message: 'Errore durante il recupero dei messaggi' });
    });
});

//top 10 trend
app.get('/vip/trends', (req, res) => {
  Messaggio.find()
    .sort({ views: -1 })
    .limit(10)
    .then(messaggi => {
      res.status(200).json(messaggi);
    })
    .catch(error => {
      console.error('Errore durante il recupero dei messaggi:', error);
      res.status(500).json({ message: 'Errore durante il recupero dei messaggi' });
    });
});

//l'utente è vip o no?
app.get('/vip/check/:email', (req, res) => {
  const email = req.params.email;
  Vip.findOne({ email: email })
    .then(vip => {
      if (vip) {
        // L'utente è un VIP, invia una risposta con un flag true
        res.status(200).json({ isVip: true });
      } else {
        // L'utente non è un VIP, invia una risposta con un flag false
        res.status(200).json({ isVip: false });
      }
    })
    .catch(error => {
      console.error('Errore durante la verifica dell\'utente VIP:', error);
      res.status(500).json({ message: 'Errore durante la verifica dell\'utente VIP' });
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

//controllo messaggi popolari
async function aggiornaCategoriaMessaggi() {
  try {
    const messaggi = await Messaggio.find();

    for (let messaggio of messaggi) {
      const { like, dislike, views, categoria } = messaggio;
      const limitePopolarita = views * 0.25;

      if (like > limitePopolarita && dislike <= limitePopolarita) {
        if (!categoria.includes("Popolare")) {
          messaggio.categoria.push("Popolare");
          messaggio.destinazione.push({simbolo: "§", destinatario:"TRENDING"});
          await messaggio.save();
          // Incrementa le quote dell'utente
          await User.findOneAndUpdate(
            { email: messaggio.emailutente },
            { $inc: { quotaD: 100, quotaW: 100, quotaM: 100 } }
          );
        }
      } else if (dislike > limitePopolarita && like <= limitePopolarita) {
        if (!categoria.includes("Impopolare")) {
          messaggio.categoria.push("Impopolare");
          await messaggio.save();
          // Diminuisci le quote per l'utente
          try {
            const user = await User.findOne({ email: messaggio.emailutente });
            if (!user) {
              console.error('Utente non trovato');
              return;
            }
        
            const nuovaQuotaD = Math.max(user.quotaD - 100, 0);
            const nuovaQuotaW = Math.max(user.quotaW - 100, 0);
            const nuovaQuotaM = Math.max(user.quotaM - 100, 0);
        
            await User.findOneAndUpdate(
              { email: messaggio.emailutente },
              { $set: { quotaD: nuovaQuotaD, quotaW: nuovaQuotaW, quotaM: nuovaQuotaM } }
            );
        
          } catch (error) {
            console.error('Errore durante la decrementazione della quota:', error);
          }

        }
      } else if (like > limitePopolarita && dislike > limitePopolarita) {
        if (categoria.includes("Popolare")) {
          categoria.splice(categoria.indexOf("Popolare"), 1);
        }
        if (categoria.includes("Impopolare")) {
          categoria.splice(categoria.indexOf("Impopolare"), 1);
        }
        if (!categoria.includes("Controverso")) {
          messaggio.categoria.push("Controverso");
          messaggio.destinazione.push({simbolo: "§", destinatario:"CONTROVERSIAL"});
          await messaggio.save();
        }
      }
    }

  } catch (error) {
    console.error("Errore durante l'aggiornamento delle categorie dei messaggi popolari:", error);
  }
}
setInterval(aggiornaCategoriaMessaggi, 60000);
//fine controllo messaggi popolari

//creazione canale top 1000
async function topmille() {
  try {
    const top1000Messaggi = await Messaggio.find()
      .sort({ like: -1 })
      .limit(1000);

    const top1000Destinazione = { simbolo:"§", destinatario: 'TOP_1000' };
    await Messaggio.updateMany(
      { 'destinazione.destinatario': 'TOP_1000' },
      { $pull: { destinazione: { destinatario: 'TOP_1000' } } }
    );

    // Aggiungi l'oggetto { dest: 'Top1000' } ai primi 1000 messaggi in ordine di like
    await Promise.all(
      top1000Messaggi.map(messaggio =>
        Messaggio.findByIdAndUpdate(messaggio._id, { $push: { destinazione: { simbolo:"§", destinatario: 'TOP_1000' } } })
      )
    );
    console.log('Aggiornamento della destinazione Top1000 completato con successo.');
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della destinazione Top1000:', error);
  }
}
setInterval(topmille, 3600000);
//creazione canale top1000

//creazione messaggi temporizzati
async function getQuotesFromAPI() {
  try {
    const response = await axios.get('https://api.quotable.io/quotes/random');
    const news = response.data;

    // Crea un messaggio per ogni news ottenuta e salvalo nel database
    news.forEach(async (item) => {
      const nuovoMessaggio = new Messaggio({
        destinazione: [{ simbolo:"§", destinatario: 'CITAZIONI' }],
        testo: item.content,
        emailutente: item.author, 
        fotoutente: 'data:image/png;base64,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',
        dataOra: new Date(),
        like: 0,
        dislike: 0,
        views: 0,
        categoria: ['Temporizzato'],
        reazioni: [],
        risposte:[],
      });

      await nuovoMessaggio.save();
      console.log('Messaggio creato:', nuovoMessaggio);
    });

    console.log('News ottenute correttamente.');
  } catch (error) {
    console.error('Errore durante l\'ottenimento delle news:', error);
  }
}
setInterval(getQuotesFromAPI, 3600000);

async function getTriviaFromAPI() {
  try {
    const response = await axios.get('http://jservice.io/api/random');
    const news = response.data;

    // Crea un messaggio per ogni news ottenuta e salvalo nel database
    news.forEach(async (item) => {
      const nuovoMessaggio = new Messaggio({
        destinazione: [{ simbolo:"§", destinatario: 'TRIVIA' }],
        testo: item.question,
        emailutente: "Jeopardy", 
        fotoutente: 'https://png.pngtree.com/png-vector/20210507/ourlarge/pngtree-quiz-png-transparent-background-png-image_3257641.jpg',
        dataOra: new Date(),
        like: 0,
        dislike: 0,
        views: 0,
        categoria: ['Temporizzato'],
        reazioni: [],
        risposte:[],
      });

      await nuovoMessaggio.save();
      console.log('Messaggio creato:', nuovoMessaggio);
    });

    console.log('News ottenute correttamente.');
  } catch (error) {
    console.error('Errore durante l\'ottenimento delle news:', error);
  }
}
setInterval(getTriviaFromAPI, 3600000);
//creazione messaggi temporizzati

//avviare la funzione di controllo della quota
eseguiAggiornamento();
// Avvia il server in ascolto su una porta specifica
app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
