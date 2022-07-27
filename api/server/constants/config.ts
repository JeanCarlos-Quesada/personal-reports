const config: any = {
  bodyParserLimit: "150mb",
  connectionString: "",
  connectionStrings: [
    {
      name: "mysql",
      connectionString: "",
      dbType: "mysql",
    },
    {
      name: "oracleDB",
      connectionString: "",
      dbType: "oracleDB",
    },
    {
      name: "sqlServer",
      connectionString: "",
      dbType: "sqlServer",
    },
  ],
};

export { config };
