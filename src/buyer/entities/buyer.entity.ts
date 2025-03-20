import { Column, Table, Model, DataType, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'buyers',
  timestamps: true,
})
export class Buyer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  buyerID: number;

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
    allowNull: true, // Optional
  })
  profilePhoto: Buffer;
}