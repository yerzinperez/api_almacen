import dotenv from "dotenv";
import { Sequelize } from 'sequelize';

dotenv.config();

const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("Connection string is missing. Please check your .env file.");
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DATABASE_URL,
});

export default sequelize;