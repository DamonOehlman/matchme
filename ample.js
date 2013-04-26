(function (root, factory) {
    if(typeof exports === 'object'){
        module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
        define(factory);
    }else{
        root.ample = factory();
    }
}(this, function () {

    var Lang = require('lang-js');

    var createNestingParser = Lang.createNestingParser,
        detectString = Lang.detectString,
        Token = Lang.Token,
        Scope = Lang.Scope;

    function isIdentifier(substring){
        var valid = /^[$A-Z_][0-9A-Z_$]*/i,
            possibleIdentifier = substring.match(valid);

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

    function createOpperatorHandler(name, opperatorConst, evaluate, precedence){
        return {
                name:name,
                precedence: precedence || 3,
                tokenise: function(substring) {
                    if (substring.indexOf(opperatorConst) === 0) return new Token(this, opperatorConst, opperatorConst.length);
                    return;
                },
                parse: function(tokens, position){
                    this.leftToken = tokens.splice(position-1,1)[0];
                    this.rightToken = tokens.splice(position,1)[0];
                },
                evaluate:evaluate
            };
    }

    var tokenConverters = [
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
            createOpperatorHandler('assigment', '=', function(scope){
                this.rightToken.evaluate(scope);
                scope.set(this.leftToken.original, this.rightToken.result);
                this.result = undefined;
            }, 5),
            createOpperatorHandler('addition', '+', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result + this.rightToken.result;
            }),
            createOpperatorHandler('subtraction', '-', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result - this.rightToken.result;
            }),
            createOpperatorHandler('multiplication', '*', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result * this.rightToken.result;
            }),
            createOpperatorHandler('division', '/', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result / this.rightToken.result;
            }),
            createOpperatorHandler('strict equality', '===', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result === this.rightToken.result;
            }),
            createOpperatorHandler('loose equality', '==', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result == this.rightToken.result;
            }),
            createOpperatorHandler('greater than or equal to', '>=', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result >= this.rightToken.result;
            }),
            createOpperatorHandler('less than or equal to', '<=', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result <= this.rightToken.result;
            }),
            createOpperatorHandler('greater than', '>', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result > this.rightToken.result;
            }),
            createOpperatorHandler('less than', '<', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result < this.rightToken.result;
            }),
            createOpperatorHandler('and', '&&', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result && this.rightToken.result;
            }),
            createOpperatorHandler('or', '||', function(scope){
                this.leftToken.evaluate(scope);
                this.rightToken.evaluate(scope);
                this.result = this.leftToken.result || this.rightToken.result;
            }),
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
                    for (var key in specials) {
                        if (substring.slice(0, key.length) === key) {
                            return new Token(this, key, key.length);
                        }
                    }
            
                    var valids = "0123456789-.Eex",
                        index = 0;
                        
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

    
    return function(){    
        var ample = {},
            lang = new Lang();
            
        ample.lang = lang;
        ample.tokenise = function(expression){
            return ample.lang.tokenise(expression, tokenConverters);
        }
        ample.evaluate = function(expression, injectedScope, returnAsTokens){
            var scope = new Lang.Scope();

            scope.add(injectedScope);

            return lang.evaluate(expression, scope, tokenConverters, returnAsTokens);
        };
        
        return ample;
    };
    
}));