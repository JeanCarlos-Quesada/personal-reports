interface DatabaseCredentials {
  server: string;
  username: string;
  password: string;
  databaseName: string;
  port: number;
}

interface DbRequestConnection {
  dbType: string;
  dbName: string;
}

interface Parameter {
  name: string;
  value: string;
}

export { DatabaseCredentials, DbRequestConnection, Parameter };
