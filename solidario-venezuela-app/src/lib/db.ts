import { neon } from '@neondatabase/serverless';

export const getSql = () => neon(process.env.POSTGRES_URL!);
