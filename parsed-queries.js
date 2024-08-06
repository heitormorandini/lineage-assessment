module.exports = [
  {
    "raw": "INSERT INTO simple_select\nSELECT col1, col2\nFROM source;",
    "INSERT INTO": "simple_select",
    "content": {
      "select": [{ "value": "col1" }, { "value": "col2" }],
      "from": "source"
    }
  },
  {
    "raw": "\n\nINSERT INTO simple_select_with_table_alias\nSELECT col1, src.col2\nFROM source as src;",
    "INSERT INTO": "simple_select_with_table_alias",
    "content": {
      "select": [{ "value": "col1" }, { "value": "src.col2" }],
      "from": { "value": "source", "name": "src" }
    }
  },
  {
    "raw": "\n\nINSERT INTO simple_select_with_column_alias\nSELECT src.col1, col2 as col3\nFROM source as src;",
    "INSERT INTO": "simple_select_with_column_alias",
    "content": {
      "select": [{ "value": "src.col1" }, { "value": "col2", "name": "col3" }],
      "from": { "value": "source", "name": "src" }
    }
  },
  {
    "raw": "\n\nINSERT INTO simple_select_with_function\nSELECT col1, UPPER(col2) as normalized_col2\nFROM source;",
    "INSERT INTO": "simple_select_with_function",
    "content": {
      "select": [
        { "value": "col1" },
        { "value": { "upper": "col2" }, "name": "normalized_col2" }
      ],
      "from": "source"
    }
  },
  {
    "raw": "\n\nINSERT INTO simple_select_with_function_literal\nSELECT col1, UPPER(col2, 'literal.value') as normalized_col2\nFROM source;",
    "INSERT INTO": "simple_select_with_function_literal",
    "content": {
      "select": [
        { "value": "col1" },
        {
          "value": { "upper": ["col2", { "literal": "literal.value" }] },
          "name": "normalized_col2"
        }
      ],
      "from": "source"
    }
  },
  {
    "raw": "\n\nINSERT INTO select_from_multiple_tables\nSELECT src1.col as col2, src2.col as col1\nFROM src2, src1;",
    "INSERT INTO": "select_from_multiple_tables",
    "content": {
      "select": [
        { "value": "src1.col", "name": "col2" },
        { "value": "src2.col", "name": "col1" }
      ],
      "from": ["src2", "src1"]
    }
  },
  {
    "raw": "\n\nINSERT INTO select_with_join\nSELECT col1, other.col2 as col3\nFROM source\nJOIN other ON (id);",
    "INSERT INTO": "select_with_join",
    "content": {
      "select": [
        { "value": "col1" },
        { "value": "other.col2", "name": "col3" }
      ],
      "from": ["source", { "join": "other", "on": "id" }]
    }
  },
  {
    "raw": "\n\nINSERT INTO select_with_deep_function\nSELECT col1, UPPER(other.foo, LOWER(test.col2)) as normalized_col2\nFROM test\nJOIN other ON (id);",
    "INSERT INTO": "select_with_deep_function",
    "content": {
      "select": [
        { "value": "col1" },
        {
          "value": { "upper": ["other.foo", { "lower": "test.col2" }] },
          "name": "normalized_col2"
        }
      ],
      "from": ["test", { "join": "other", "on": "id" }]
    }
  },
  {
    "raw": "\n\nINSERT INTO select_with_deep_function_and_aliases\nSELECT col1, UPPER(test3.foo, LOWER(test2.col2)) as normalized_col2\nFROM test AS test2\nJOIN other AS test3 ON (id);",
    "INSERT INTO": "select_with_deep_function_and_aliases",
    "content": {
      "select": [
        { "value": "col1" },
        {
          "value": { "upper": ["test3.foo", { "lower": "test2.col2" }] },
          "name": "normalized_col2"
        }
      ],
      "from": [
        { "value": "test", "name": "test2" },
        { "join": { "name": "test3", "value": "other" }, "on": "id" }
      ]
    }
  },
  {
    "raw": "\n\nINSERT INTO filtered_pagecounts\nSELECT REGEXP_REPLACE(REFLECT('java.net.URLDecoder', 'decode', REFLECT('java.net.URLDecoder', 'decode', pvs.page_title)), '^\\s*([a-zA-Z0-9]+).*', '$1') AS page_title,\n  SUM(pvs.views) AS total_views,\n  SUM(pvs.bytes_sent) AS total_bytes_sent\nFROM pagecounts as pvs\nWHERE\n  NOT pvs.page_title LIKE '(MEDIA|SPECIAL||Talk|User|User_talk|Project|MediaWiki'AND\n  pvs.page_title LIKE '^([A-Z])(.*)'AND\n  not pvs.page_title LIKE '(.*).(jpg|gif|png|JPG|GIF|PNG|txt|ico)$'AND\n  pvs.page_title <> '404_error/'AND\n  pvs.page_title <> 'Main_Page'AND\n  pvs.dt = '2020-01-01'\nGROUP BY\n  REGEXP_REPLACE(REFLECT('java.net.URLDecoder', 'decode', REFLECT('java.net.URLDecoder', 'decode', pvs.page_title)), '^\\s*([a-zA-Z0-9]+).*', '$1')\n",
    "INSERT INTO": "filtered_pagecounts",
    "content": {
      "select": [
        {
          "value": {
            "regexp_replace": [
              {
                "reflect": [
                  { "literal": "java.net.URLDecoder" },
                  { "literal": "decode" },
                  {
                    "reflect": [
                      { "literal": "java.net.URLDecoder" },
                      { "literal": "decode" },
                      "pvs.page_title"
                    ]
                  }
                ]
              },
              { "literal": "^\\s*([a-zA-Z0-9]+).*" },
              { "literal": "$1" }
            ]
          },
          "name": "page_title"
        },
        { "value": { "sum": "pvs.views" }, "name": "total_views" },
        { "value": { "sum": "pvs.bytes_sent" }, "name": "total_bytes_sent" }
      ],
      "from": { "value": "pagecounts", "name": "pvs" },
      "where": {
        "and": [
          {
            "not": {
              "like": [
                "pvs.page_title",
                {
                  "literal": "(MEDIA|SPECIAL||Talk|User|User_talk|Project|MediaWiki"
                }
              ]
            }
          },
          { "like": ["pvs.page_title", { "literal": "^([A-Z])(.*)" }] },
          {
            "not": {
              "like": [
                "pvs.page_title",
                { "literal": "(.*).(jpg|gif|png|JPG|GIF|PNG|txt|ico)$" }
              ]
            }
          },
          { "neq": ["pvs.page_title", { "literal": "404_error/" }] },
          { "neq": ["pvs.page_title", { "literal": "Main_Page" }] },
          { "eq": ["pvs.dt", { "literal": "2020-01-01" }] }
        ]
      },
      "groupby": {
        "value": {
          "regexp_replace": [
            {
              "reflect": [
                { "literal": "java.net.URLDecoder" },
                { "literal": "decode" },
                {
                  "reflect": [
                    { "literal": "java.net.URLDecoder" },
                    { "literal": "decode" },
                    "pvs.page_title"
                  ]
                }
              ]
            },
            { "literal": "^\\s*([a-zA-Z0-9]+).*" },
            { "literal": "$1" }
          ]
        }
      }
    }
  }
]
