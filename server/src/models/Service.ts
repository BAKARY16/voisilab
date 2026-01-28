import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Service extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'services',
    timestamps: true,
  }
);

export default Service;