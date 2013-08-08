/* jshint node: true */
'use strict';

var Lang = require('lang-js');
var createNestingParser = Lang.createNestingParser;
var detectString = Lang.detectString;
var Token = Lang.Token;
var Scope = Lang.Scope;

function Parser() {
  // initialise lang
  var lang = this.lang = new Lang();

  this.tokenise = function(expr) {
    return lang.tokenise(expr, tokenConverters);
  };

  this.evaluate = function(expr, injectedScope, returnAsTokens) {
    var scope = new Lang.Scope();
    scope.add(injectedScope);
    return lang.evaluate(expr, scope, tokenConverters, returnAsTokens);
  };
}

module.exports = Parser;

/**
  ### Parser
**/

var tokenConverters = [
  /**
  ### parentheses
  **/
  {
    name:"parentheses",
    precedence: 0,
    tokenise: function(substring) {
      if(substring.charAt(0) === '(' || substring.charAt(0) === ')'){
        return new Token(this, substring.charAt(0), 1);
      }
    },
    parse:createNestingParser(new RegExp('^\\($'),new RegExp('^\\)$')),
    evaluate:function(scope){        
      for(var i = 0; i < this.childTokens.length; i++){
        this.childTokens[i].evaluate(scope);
      }

      this.result = this.childTokens.slice(-1)[0].result;
    }
  },

  /**
  ### assignment (=)

  **/
  createOperatorHandler('assigment', '=', function(scope){
    this.rightToken.evaluate(scope);
    scope.set(this.leftToken.original, this.rightToken.result);
    this.result = undefined;
  }, 5),

  /**
  ### addition (+)
  **/
  createOperatorHandler('addition', '+', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result + this.rightToken.result;
  }),

  /**
  ### subtraction (-)
  **/
  createOperatorHandler('subtraction', '-', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result - this.rightToken.result;
  }),

  /**
  ### multiplication (*)
  **/
  createOperatorHandler('multiplication', '*', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result * this.rightToken.result;
  }),

  /**
  ### division (/)
  **/
  createOperatorHandler('division', '/', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result / this.rightToken.result;
  }),

  /**
  ### strict equality (===)
  **/
  createOperatorHandler('strict equality', '===', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result === this.rightToken.result;
  }),

  /**
  ### loose equality (==)
  **/
  createOperatorHandler('loose equality', '==', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result == this.rightToken.result;
  }),

  /**
  ### greater than or equal to (>=)
  **/
  createOperatorHandler('greater than or equal to', '>=', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result >= this.rightToken.result;
  }),

  /**
  ### less than or equal to (<=)
  **/
  createOperatorHandler('less than or equal to', '<=', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result <= this.rightToken.result;
  }),

  /**
  ### greater than (>)
  **/
  createOperatorHandler('greater than', '>', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result > this.rightToken.result;
  }),

  /**
  ### less than (<)
  **/
  createOperatorHandler('less than', '<', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result < this.rightToken.result;
  }),

  /**
  ### and (&&)
  **/
  createOperatorHandler('and', '&&', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result && this.rightToken.result;
  }),

  /**
  ### or (||)
  **/
  createOperatorHandler('or', '||', function(scope){
    this.leftToken.evaluate(scope);
    this.rightToken.evaluate(scope);
    this.result = this.leftToken.result || this.rightToken.result;
  }),

  /**
  ### delimiter
  **/
  {
    name:"delimiter",
    precedence: 0,
    tokenise: function(substring) {
      var i = 0;
      while (i < substring.length && substring.charAt(i).trim() === "" || substring.charAt(i) === ',') {
        i++;
      }

      if (i) return new Token(this, substring.slice(0, i), i);
    },
    parse:function(tokens, position){
      tokens.splice(position, 1);
    }
  },

  /**
  ### number
  **/
  {
    name:"number",
    precedence: 1,
    tokenise: function(substring) {
      var specials = {
        "NaN": Number.NaN,
        "-NaN": Number.NaN,
        "Infinity": Infinity,
        "-Infinity": -Infinity
      };
      var valids = "0123456789-.Eex";
      var index = 0;

      for (var key in specials) {
        if (substring.slice(0, key.length) === key) {
          return new Token(this, key, key.length);
        }
      }

      while (valids.indexOf(substring.charAt(index)||null) >= 0 && ++index) {}

      if (index > 0) {
        var result = substring.slice(0, index);
        if(isNaN(parseFloat(result))){
          return;
        }
        return new Token(this, result, index);
      }

      return;
    },
    evaluate:function(){
      this.result = parseFloat(this.original);
    }
  },

  /**
  ### identifier
  **/
  {
    name:"identifier",
    precedence: 6,
    tokenise: function(substring){
      var result = isIdentifier(substring);

      if(result != null){
        return new Token(this, result, result.length);
      }
    },
    evaluate:function(scope){
      this.result = scope.get(this.original);
    }
  },

  /**
  ### string
  **/
  {
    name:"string",
    precedence: 2,
    tokenise: function convertStringToken(substring) {
      return Lang.detectString(this, substring, '"', "double quoted");
    },
    evaluate:function(){
      this.result = this.original.slice(1, -1);
    }
  },

  /**
  ### singleQuoteString
  **/
  {
    name:"singleQuoteString",
    precedence: 2,
    tokenise: function convertStringToken(substring) {
      return Lang.detectString(this, substring, "'", "single quoted");
    },
    evaluate:function(){
      this.result = this.original.slice(1, -1);
    }
  },
];

/* internals */

function isIdentifier(substring){
  var valid = /^[$A-Z_][0-9A-Z_$]*/i;
  var possibleIdentifier = substring.match(valid);

  if (possibleIdentifier && possibleIdentifier.index === 0) {
    return possibleIdentifier[0];
  }
}

function createKeywordTokeniser(keyword){
  return function(substring){
    substring = isIdentifier(substring);
    if (substring === keyword) {
      return new Token(this, substring, substring.length);
    }
  };
}

function createOperatorHandler(name, operatorConst, evaluate, precedence) {
  return {
    name:name,
    precedence: precedence || 3,
    tokenise: function(substring) {
      if (substring.indexOf(operatorConst) === 0) {
        return new Token(this, operatorConst, operatorConst.length);
      }

      return;
    },
    parse: function(tokens, position){
      this.leftToken = tokens.splice(position-1,1)[0];
      this.rightToken = tokens.splice(position,1)[0];
    },
    evaluate:evaluate
  };
}