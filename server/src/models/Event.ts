import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Event extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public date!: Date;
  public location!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Event.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'events',
  }
);

export default Event;