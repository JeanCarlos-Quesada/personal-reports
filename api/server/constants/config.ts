import { DatabaseCredentials } from "../../interfaces/database";

const config: any = {
  bodyParserLimit: "150mb",
  connectionString: {
    server: "localhost",
    username: "Developer",
    password: "PerroCafe",
    databaseName: "personal_reports",
    port: 3306,
  } as DatabaseCredentials,
};

export { config };
