import { join } from 'path'

export default () => ({
  DATABASE_CONFIG: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'approximately',
    database: 'nestJs_BaseApp_database',
    entities: [join(__dirname, '../../' ,'dist/modules/**/**.entity{.ts,.js}')],
    synchronize: true
  }
});
