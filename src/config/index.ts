import { join } from 'path'

export default () => ({
  DATABASE_CONFIG: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1qwer',
    database: 'nestjs_baseapp_database',
    entities: [join(__dirname, '../../' ,'dist/modules/**/**.entity{.ts,.js}')],
    synchronize: true
  }
});
