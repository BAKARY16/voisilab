# Voisilab Application

Voisilab est une application web moderne et professionnelle développée avec React et TypeScript, conçue pour gérer les services, événements et innovations d'un Fablab. Ce projet est divisé en deux parties : le client (front-end) et le serveur (back-end), avec une base de données MySQL pour stocker les données.

## Structure du Projet

```
voisilab-app
├── client          # Dossier contenant le code du front-end
│   ├── public      # Fichiers publics
│   ├── src         # Code source de l'application React
│   ├── package.json # Dépendances et scripts du client
│   └── tsconfig.json # Configuration TypeScript du client
├── server          # Dossier contenant le code du back-end
│   ├── src         # Code source du serveur Express
│   ├── package.json # Dépendances et scripts du serveur
│   └── tsconfig.json # Configuration TypeScript du serveur
├── database        # Dossier contenant le schéma de la base de données
│   └── schema.sql  # Instructions SQL pour créer les tables
└── README.md       # Documentation du projet
```

## Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- MySQL

### Configuration de la Base de Données

1. Créez une base de données MySQL pour Voisilab.
2. Exécutez le fichier `database/schema.sql` pour créer les tables nécessaires.

### Installation du Client

1. Accédez au dossier `client` :
   ```
   cd client
   ```
2. Installez les dépendances :
   ```
   npm install
   ```

### Installation du Serveur

1. Accédez au dossier `server` :
   ```
   cd server
   ```
2. Installez les dépendances :
   ```
   npm install
   ```

## Démarrage de l'Application

### Démarrer le Serveur

Dans le dossier `server`, exécutez :
```
npm start
```

### Démarrer le Client

Dans le dossier `client`, exécutez :
```
npm start
```

L'application sera accessible à l'adresse `http://localhost:3000`.

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des problèmes ou des demandes de fonctionnalités.

## License

Ce projet est sous licence MIT.