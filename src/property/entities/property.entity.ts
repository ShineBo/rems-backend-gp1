import {
  Column,
  Table,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { Dealer } from '../../dealer/entities/dealer.entity';

@Table({
  tableName: 'properties',
  timestamps: true,
})
export class Property extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  propertyID: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  propertyTitle: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  propertyType: string;

  @Column({
    type: DataType.BLOB,
    allowNull: true,
  })
  propertyImages: Buffer;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  status: string;

  @ForeignKey(() => Dealer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dealerID: number;

  @BelongsTo(() => Dealer)
  dealer: Dealer;
}
