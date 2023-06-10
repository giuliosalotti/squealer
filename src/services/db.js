const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/Squeeler';

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db();
    console.log('Connessione al database stabilita');
    return db;
  } catch (error) {
    console.error('Errore durante la connessione al database', error);
    throw error;
  }
}

module.exports = connectToDatabase;
