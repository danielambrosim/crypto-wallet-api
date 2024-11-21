npm init -y
node index.js
npm install body-parser
npm install express
npm install pg
npm install cors







crypto-wallet-manager/
│
├── node_modules/
├── src/
│   ├── controllers/
│   │   └── walletController.js
│   ├── routes/
│   │   └── walletRoutes.js
│   ├── models/
│   │   └── wallet.js
│   ├── config/
│   │   └── database.js
│   └── server.js
├── package.json
└── .env


Crie as tabelas no PostgreSQL


CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(255) NOT NULL,
    moeda_principal VARCHAR(10) NOT NULL,
    saldo NUMERIC DEFAULT 0
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    id_wallet INTEGER REFERENCES wallets(id),
    tipo_operacao VARCHAR(20) NOT NULL,
    moeda VARCHAR(10) NOT NULL,
    quantidade NUMERIC NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT
);
