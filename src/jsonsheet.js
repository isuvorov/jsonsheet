(function () {

  var root = this;

  var jsonsheet = {};

  root.jsonsheet = jsonsheet;

  /**
   * convert \n\t raw string to 2d array
   * @param raw string
   * @returns {Array|*}
   */
  jsonsheet.raw2Array = function (raw) {
    var rows = raw.split("\n");
    return rows.map(function (row) {
      return row.split("\t");
    });
  };

  /**
   * makes object[keyChain[0]][keyChain[1]]..[keyChain[n]] = value
   *
   * @param object
   * @param keyChain array
   * @param value
   */

  jsonsheet.assignKeyChainValue = function (object, keyChain, value) {
    //console.log('keyChain', keyChain)
    var key = keyChain.shift();
    //console.log('key', key)
    //console.log('keyChain2', keyChain)
    //console.log('object', object);
    //console.log('keyChain.length ', keyChain.length )
    if (keyChain.length == 0) {
      object[key] = value
    } else {
      if (!object[key]) {
        object[key] = {};
      }
      //console.log('object', object);
      jsonsheet.assignKeyChainValue(object[key], keyChain, value);
    }

  };

  /**
   *
   * if keyWithDots = "a.b.c.d.e"
   * makes: object.a.b.c.d.e = value
   *
   * @param object
   * @param keyWithDots
   * @param value
   * @returns {*}
   */
  jsonsheet.assignKeyValue = function (object, keyWithDots, value) {
    var keyChain = keyWithDots.split('.');
    jsonsheet.assignKeyChainValue(object, keyChain, value);
    return object;
  };

  /**
   * makes 2d array with header keys as
   * array of key-value rows
   *
   * @param array
   * @param assignDots bool
   * @returns {Array}
   */

  jsonsheet.array2tableArray = function (array, assignDots) {

    var header = array[0];
    var body = array.slice(1);

    var tableArray = [];

    body.forEach(function (row) {
      //console.log('row', row);
      var tableRow = {};
      for (var i = 0; i < header.length; i++) {
        if (assignDots) {
          jsonsheet.assignKeyValue(tableRow, header[i], row[i]);
        } else {
          tableRow[header[i]] = row[i];
        }
        //
      }
      tableArray.push(tableRow);

    });

    //console.log('tableArray', tableArray);
    return tableArray;

  };

  /**
   * cast type of element
   *  may be in future number(int), float, bool
   *
   * @param value
   * @param type enum json or notjson(string)
   * @returns {*}
   */
  jsonsheet.typeCast = function (value, type) {
    if (type == 'json') {
      try {
        return JSON.parse(value);
      } catch (ex) {
        return value;
      }
    } else {
      return value;
    }
  };

  jsonsheet.applyArrayParams = function (array, params) {
    var newArray = [];

    var header = array[0];
    var body = array.slice(1);


    newArray.push(header);

    body.forEach(function (row) {
      for (var i = 0; i < header.length; i++) {
        if (!params.keys[header[i]]) {
          continue;
        }
        row[i] = jsonsheet.typeCast(row[i], params.keys[header[i]].type);
      }
      newArray.push(row);
    });


    return newArray;

  };

  jsonsheet.parse2dTable = function (raw) {
    var array = jsonsheet.raw2Array(raw);

    var params = jsonsheet.typeCast(array[0][0], 'json');
    //console.log('params', params);

    var otherArray = array.slice(1);

    console.log('otherArray', otherArray);
    var otherArray2 = jsonsheet.applyArrayParams(otherArray, params);
    console.log('otherArray', otherArray2);
    var tableArray = jsonsheet.array2tableArray(otherArray2, true);

    console.log('tableArray', tableArray);

    return tableArray;

  }


}.call(this));
