// src/dealer/entities/dealer.entity.ts
import { Column, Table, Model, DataType, HasMany } from 'sequelize-typescript';
import { Property } from '../../property/entities/property.entity';

@Table({
  tableName: 'dealers',
  timestamps: true,
})
export class Dealer extends Model {
  @Column({
    type: DataType.STRING(50),
    primaryKey: true,
    unique: true,
  })
  dealerID: string;

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
