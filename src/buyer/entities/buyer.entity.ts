// src/buyer/entities/buyer.entity.ts
import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'buyers',
  timestamps: true,
})
export class Buyer extends Model {
  @Column({
    type: DataType.STRING(50),
    primaryKey: true,
    unique: true,
  })
  buyerID: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  buyerName: string;

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
}
