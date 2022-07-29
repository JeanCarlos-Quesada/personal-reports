import mysql2 from "mysql2";
import * as tedious from "tedious";
import {
  DatabaseCredentials,
  DbRequestConnection,
  Parameter,
} from "../interfaces/database";
import { SqlServerRow } from "../interfaces/sqlServerResult";
import Utilities from "./utilities";

class DbConnection {
  /**
   * This function sets the connection to the database based on the database type.
   * @param {DbRequestConnection} db - DbRequestConnection
   */
  public async initConnection(db: DbRequestConnection): Promise<DbConnection> {
    const DbCredentials: DatabaseCredentials = this.getCredentials(db.dbName);
    switch (db.dbType) {
      case "mysql":
        this.connection = this.setMySQLConnection(DbCredentials);
        break;
      case "sqlserver":
        this.connection = await this.setSqlServerConnection(DbCredentials);
        break;
      case "oracle":
        break;
    }

    this.databaseType = db.dbType;

    return this;
  }

  //#region props
  private connection: mysql2.Connection | tedious.Connection;
  private databaseType: string;
  //#endregion props

  //#region connections
  private getCredentials(dbName: string): DatabaseCredentials {
    // const DbCredentials: DatabaseCredentials = {
    //   server: "localhost",
    //   username: "Developer",
    //   password: "PerroCafe",
    //   databaseName: "e_commerce",
    // };

    const DbCredentials: DatabaseCredentials = {
      server: "127.0.0.1",
      username: "test1",
      password: "GhJ09876",
      databaseName: "e_commerce",
    };

    return DbCredentials;
  }

  /**
   * It creates a connection to a MySQL database using the credentials passed in as an argument.
   * @param {DatabaseCredentials} credentials - DatabaseCredentials
   * @returns A connection object.
   */
  private setMySQLConnection(
    credentials: DatabaseCredentials
  ): mysql2.Connection {
    const config = {
      host: credentials.server,
      user: credentials.username,
      password: credentials.password,
      dateStrings: true,
      port: 3306,
      database: credentials.databaseName,
      typeCast: function castField(field: any, useDefaultTypeCasting: any) {
        if (field.type === "BIT" && field.length === 1) {
          const bytes = field.buffer();

          return bytes[0] === 1;
        }

        return useDefaultTypeCasting();
      },
    };

    const connection: mysql2.Connection = mysql2.createConnection(config);
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
    const config = {
      server: credentials.server, // update me
      port: 1433,
      authentication: {
        type: "default",
        options: {
          userName: credentials.username, // update me
          password: credentials.password, // update me
        },
      },
      options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: false,
        database: credentials.databaseName, // update me
        rowCollectionOnRequestCompletion: true,
      },
    };
    const connection = new Connection(config);
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
  //#endregion connections

  //#region querys

  /**
   * This function executes a query against a database, and returns the results.
   * @param {string} query - string - The query to execute
   * @param {Parameter[]} parameters - Parameter[]
   */
  public async executeQuery(
    query: string,
    parameters: Parameter[]
  ): Promise<any> {
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
  ): Promise<any> {
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
  ): Promise<any> {
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

          const result: any[] = utilities.convertSqlServerResultToJSON(rows);
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
