import mysql2 from "mysql2";
import tedious from "tedious";
import oracledb from "oracledb";
import {
  DatabaseCredentials,
  DbRequestConnection,
  Parameter,
} from "../interfaces/database";
import { SqlServerRow } from "../interfaces/sqlServerResult";
import Utilities from "./utilities";
import { config } from "../server/constants/config";
import { databaseNames } from "../server/constants/variablesConstants";

class DbConnection {
  /**
   * This function sets the connection to the database based on the database type.
   * @param {DbRequestConnection} db - DbRequestConnection
   */
  public async initConnection(db: DbRequestConnection): Promise<DbConnection> {
    const DbCredentials: DatabaseCredentials = await this.getCredentials(
      db.dbName
    );
    switch (db.dbType) {
      case databaseNames.mysql:
        this.connection = this.setMySQLConnection(DbCredentials);
        break;
      case databaseNames.sqlServer:
        this.connection = await this.setSqlServerConnection(DbCredentials);
        break;
      case databaseNames.oracle:
        this.connection = await this.setOracleConnection(DbCredentials);
        break;
    }

    this.databaseType = db.dbType;

    return this;
  }

  //#region props
  private connection:
    | mysql2.Connection
    | tedious.Connection
    | oracledb.Connection;
  private databaseType: string;
  //#endregion props

  //#region connections
  /**
   * It takes a database name as a parameter, and returns the credentials for that database.
   * If the dbName isn't send use the system database
   * @param {string} dbName - string - The name of the database you want to connect to.
   * @returns The credentials for the database.
   */
  private async getCredentials(dbName: string): Promise<DatabaseCredentials> {
    if (dbName) {
      const systemDatabase = this.setMySQLConnection(config.connectionString);
      try {
        const result = await (systemDatabase as mysql2.Connection)
          .promise()
          .query("select * from dbCredentials where name = ?", dbName);
        const rows = (result[0] as any[])[0];
        return rows;
      } catch (error) {
        console.error(error);
      }
    } else {
      return config.connectionString;
    }
  }

  /**
   * It creates a connection to a MySQL database using the credentials passed in as an argument.
   * @param {DatabaseCredentials} credentials - DatabaseCredentials
   * @returns A connection object.
   */
  private setMySQLConnection(
    credentials: DatabaseCredentials
  ): mysql2.Connection {
    const configDB = {
      host: credentials.server,
      user: credentials.username,
      password: credentials.password,
      dateStrings: true,
      port: credentials.port,
      database: credentials.databaseName,
      typeCast: function castField(field: any, useDefaultTypeCasting: any) {
        if (field.type === "BIT" && field.length === 1) {
          const bytes = field.buffer();

          return bytes[0] === 1;
        }

        return useDefaultTypeCasting();
      },
    };

    const connection: mysql2.Connection = mysql2.createConnection(configDB);
    return connection;
  }

  /**
   * This function takes a DatabaseCredentials object as a parameter, and returns a SqlServer connection
   * object.
   * @param {DatabaseCredentials} credentials - DatabaseCredentials
   * @returns A tedious.Connection object.
   */
  private async setSqlServerConnection(
    credentials: DatabaseCredentials
  ): Promise<tedious.Connection> {
    const Connection = tedious.Connection;
    const configDB = {
      server: credentials.server,
      port: credentials.port,
      authentication: {
        type: "default",
        options: {
          userName: credentials.username,
          password: credentials.password,
        },
      },
      options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: false,
        database: credentials.databaseName,
        rowCollectionOnRequestCompletion: true,
      },
    };
    const connection = new Connection(configDB);
    return new Promise((resolve, reject) => {
      connection.on("connect", (err) => {
        if (err) {
          return reject(err);
        }
        // If no error, then good to proceed.
        console.log("Connected");

        return resolve(connection);
      });

      connection.connect();
    });
  }

  /**
   * This function returns a promise that resolves to an Oracle database connection object.
   * @param {DatabaseCredentials} credentials - DatabaseCredentials
   * @returns A Promise&lt;oracledb.Connection&gt;
   */
  private async setOracleConnection(
    credentials: DatabaseCredentials
  ): Promise<oracledb.Connection> {
    const connection: oracledb.Connection = await oracledb.getConnection({
      user: credentials.username,
      password: credentials.password,
      connectionString: `${credentials.server}/${credentials.databaseName}`,
    });

    return connection;
  }
  //#endregion connections

  //#region querys

  /**
   * This function executes a query against a database, and returns the results.
   * @param {string} query - string - The query to execute
   * @param {Parameter[]} parameters - Parameter[]
   */
  public async executeQuery(
    query: string,
    parameters: Parameter[] = []
  ): Promise<any[]> {
    switch (this.databaseType) {
      case "mysql":
        return await this.executeMySqlQuery(query, parameters);
      case "sqlserver":
        return await this.executeSqlServerQuery(query, parameters);
      case "oracle":
        break;
    }
  }

  /**
   * It executes a MySQL query and returns the result.
   * @param {string} query - string = "SELECT * FROM table WHERE id = ?";
   * @param {Parameter[]} parameters - Parameter[]
   */
  private async executeMySqlQuery(
    query: string,
    parameters: Parameter[]
  ): Promise<any[]> {
    let queryResult: any[] = [];
    try {
      const result = await (this.connection as mysql2.Connection)
        .promise()
        .query(query, parameters);
      const rows = result[0] as any[];
      queryResult = rows;
    } catch (error) {
      console.error(error);
    }

    return queryResult;
  }

  /**
   * This function executes a SQL Server query and returns the results.
   * @param {string} query - string - the query to execute
   * @param {Parameter[]} parameters - Parameter[]
   */
  private async executeSqlServerQuery(
    query: string,
    parameters: Parameter[]
  ): Promise<any[]> {
    return new Promise<any>((resolve, reject) => {
      const Request = tedious.Request;

      const request = new Request(
        query,
        (err: Error, rowCount: number, rows: SqlServerRow[][]) => {
          if (err) {
            return reject(err);
          }

          (this.connection as tedious.Connection).close();

          const utilities: Utilities = new Utilities();

          const result: any[] =
            utilities.convertSqlServerResultToJSON(rows);
          return resolve(result);
        }
      );
      parameters.map((item) => {
        request.addParameter(item.name, null, item.value);
      });

      (this.connection as tedious.Connection).execSql(request);
    });
  }
  //#endregion querys
}

export { DbConnection };
