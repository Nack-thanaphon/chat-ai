import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Module({})
export class AuthModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}
