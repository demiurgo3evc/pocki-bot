import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  from!: string

  @Column('text')
  userMessage!: string

  @Column('text')
  botResponse!: string

  @Column({ default: 'CHAT' })
  intent!: string

  @CreateDateColumn()
  createdAt!: Date
}