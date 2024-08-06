const parsedQueries = require('./parsed-queries');

// function that gives the possibility to filter the queries by table name (INSERT INTO)
const filterQueries = (queries, filter) => {
  if (!filter) {
    return queries;
  }

  return queries.filter(query => query['INSERT INTO'] === filter);
}

// function that returns the table names, already mapping aliases, from the query
const getTableNames = (from, index = 0) => {
  if (typeof from === 'object') {
    if (from instanceof Array) {
      let result = {};

      from.forEach(table => {
        result = { ...result, ...getTableNames(table, index++) }
      });

      return result;
    }

    if (from.name) {
      const result = {
        [from.name]: from.value
      };

      if (index === 0) {
        return {
          ...result,
          __root: from.value
        }
      }

      return {
        [from.name]: from.value
      };
    }

    if (from.join) {
      return getTableNames(from.join, index++);
    }

    return getTableNames(from['left outer join'], index++);
  }

  const result = {
    [from]: from
  };

  if (index === 0) {
    return {
      ...result,
      __root: from
    }
  }

  return result;
}

// function that returns the column names from functions
const getFunctionValue = (functionObject) => {
  const functionName = Object.keys(functionObject)[0];

  // ignores literal values
  if (functionName === 'literal') {
    return [];
  }

  const functionValue = functionObject[functionName];

  if (functionValue instanceof Array) {
    let result = [];

    functionValue.forEach(value => {
      if (typeof value === 'object') {
        result = [...result, ...getFunctionValue(value)];
      } else {
        result.push(value);
      }
    });

    return result;
  }

  if (typeof functionValue === 'object') {
    return getFunctionValue(functionValue);
  }

  return [functionValue];
}

// function that returns the column names, already mapping aliases and functions, from the query
const getColumns = (select) => {
  if (typeof select === 'object') {

    if (select instanceof Array) {
      let columns = {};
      select.forEach(column => {
        columns = {
          ...columns,
          ...getColumns(column)
        }
      });

      return columns;
    }

    if (select.name) {
      // if value is an object, it means it's a function
      if (typeof select.value === 'object') {
        return {
          [select.name]: getFunctionValue(select.value)
        }
      }

      return {
        [select.name]: select.value
      }
    }

    return getColumns(select.value);
  }

  const name = select.split('.').slice(-1)[0];

  return {
    [name]: select
  };
}

// uses table mapping to remove aliases from column names
const removeAliases = (column, tables) => {
  if (typeof column === 'string') {
    const parts = column.split('.');

    if (parts.length > 1) {
      return `${tables[parts[0]]}.${parts[1]}`;
    }

    return `${tables.__root}.${parts[0]}`;
  } else {
    return column.map(c => removeAliases(c, tables)).join(',');
  }
}

const processLineage = (query) => {
  console.log(query['INSERT INTO']);

  let tableMap = {};

  tableMap = getTableNames(query.content.from);

  let columnMap = {};

  columnMap = getColumns(query.content.select);

  Object.keys(columnMap).sort().forEach(column => {
    const lineage = removeAliases(columnMap[column], tableMap);
    console.log(`${column}, ${lineage}`);
  })

  console.log();
}

const main = () => {
  const queries = filterQueries(parsedQueries);


  for (let query of queries) {
    processLineage(query);
  }
}

main();
