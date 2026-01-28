import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Innovation extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Innovation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'innovations',
  }
);