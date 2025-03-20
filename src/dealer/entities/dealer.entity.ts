import {
  Column,
  Table,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Property } from '../../property/entities/property.entity';

@Table({
  tableName: 'dealers',
  timestamps: true,
})
export class Dealer extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  dealerID: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  businessName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  licenseNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.BLOB,
    allowNull: false,
  })
  profilePhoto: Buffer;

  @HasMany(() => Property)
  properties: Property[];
}