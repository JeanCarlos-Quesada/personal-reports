interface SqlServerRow {
  value: any;
  metadata: Metadata;
}

interface Metadata {
  colName: string;
}


export { SqlServerRow };
