import { createConnection } from 'mysql2/promise';

const databaseConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'voisilab_db',
};

const connectToDatabase = async () => {
  try {
    const connection = await createConnection(databaseConfig);
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export { connectToDatabase };