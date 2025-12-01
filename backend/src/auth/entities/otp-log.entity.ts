import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('otp_logs')
export class OtpLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  otp: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  used: boolean;

  @Column()
  ipAddress: string;

  @Column()
  deviceFingerprint: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

