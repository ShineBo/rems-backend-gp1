// src/property/entities/property.entity.ts
import {
  Column,
  Table,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Dealer } from '../../dealer/entities/dealer.entity';

@Table({
  tableName: 'properties',
  timestamps: true,
})
export class Property extends Model {
  @Column({
    type: DataType.STRING(50),
    primaryKey: true,
    unique: true,
  })
  propertyID: string;

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

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  dealerInfo: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  contactInfo: string;

  @ForeignKey(() => Dealer)
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  dealerID: string;

  @BelongsTo(() => Dealer)
  dealer: Dealer;
}
