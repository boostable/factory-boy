// Generated by CoffeeScript 1.6.2
(function() {
  var Factory, FactoryBase, createWith, factoryDirs, initializeWith, path, utils;

  path = require('path');

  utils = require('./utils');

  FactoryBase = require('./factory_base');

  initializeWith = function(klass, attributes, callback) {
    return callback(null, new klass(attributes));
  };

  createWith = function(klass, attributes, callback) {
    return klass.create(attributes, callback);
  };

  factoryDirs = ['./test/factories'];

  Factory = {
    factories: {},
    define: function(name, options, callback) {
      if (options == null) {
        options = {};
      }
      if (!options["class"]) {
        throw Error("Missing class parameter");
      }
      return this._defineFactory(name, options, callback);
    },
    build: function(name, attrs, callback) {
      var factory,
        _this = this;

      if (attrs == null) {
        attrs = {};
      }
      if (typeof attrs === 'function') {
        callback = attrs;
      }
      factory = utils.extend(new FactoryBase, this._fetchFactory(name));
      factory = utils.extend(factory, attrs);
      return this._evaluateLazyAttributes(factory, function() {
        var initializeMethod;

        initializeMethod = factory.initializeWith || _this.initializeWith;
        return initializeMethod(factory.options["class"], factory.attributes(), callback);
      });
    },
    create: function(name, attrs, callback) {
      var factory,
        _this = this;

      if (attrs == null) {
        attrs = {};
      }
      if (typeof attrs === 'function') {
        callback = attrs;
      }
      factory = utils.extend(new FactoryBase, this._fetchFactory(name));
      factory = utils.extend(factory, attrs);
      return this._evaluateLazyAttributes(factory, function() {
        var createMethod;

        createMethod = factory.createWith || _this.createWith;
        return createMethod(factory.options["class"], factory.attributes(), callback);
      });
    },
    load: function(dirs) {
      if (!dirs) {
        dirs = this.factoryDirs;
      }
      if (typeof dirs === 'string') {
        dirs = [dirs];
      }
      dirs.forEach(function(dir) {
        return require("fs").readdirSync(dir).forEach(function(file) {
          return require(path.join(process.env.PWD, dir, file));
        });
      });
      return Factory;
    },
    reload: function() {
      this.createWith = createWith;
      this.initializeWith = initializeWith;
      this.factoryDirs = factoryDirs;
      return this.factories = {};
    },
    _evaluateLazyAttributes: function(factory, callback) {
      var lazyFunctions, prop;

      lazyFunctions = [];
      for (prop in factory.lazyProperties()) {
        lazyFunctions.push({
          field: prop,
          func: factory[prop]
        });
      }
      if (lazyFunctions.length) {
        return utils.series(factory, lazyFunctions, callback);
      } else {
        return callback();
      }
    },
    _defineFactory: function(name, options, callback) {
      if (this.factories[name]) {
        throw Error("Factory already defined: " + name);
      }
      return this.factories[name] = new FactoryBase(options, callback);
    },
    _fetchFactory: function(name) {
      return this.factories[name] || (function() {
        throw Error("Factory not defined: " + name);
      })();
    }
  };

  Factory.reload();

  module.exports = Factory;

}).call(this);
