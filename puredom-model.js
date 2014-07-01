/** A synchronized model base class. */
(function(factory) {
	if (typeof define==='function' && define.amd) {
		define(['puredom'], factory);
	}
	else if (typeof module==='object' && typeof require==='function') {
		module.exports = factory(require('puredom'));
	}
	else {
		window.puredom.Model = factory(window.puredom);
	}
}(function($) {
	/** @exports Model as puredom.model */
	
	function noop() {}

	function getId() { return (Date.now() + Math.random()).toString(36).replace('.','-'); }
	
	function Model(attributes, callback) {
		var args = [].slice.call(arguments),
			self = this;
		
		if (this===$ || !(this instanceof Model)) {
			return new Model(args[0], args[1], args[2]);
		}
		
		this.attributes = {};
		$.EventEmitter.call(this);
		
		if (arguments.length===3) {
			callback = args[2];
			this.db = args[1];
		}
		callback = callback || noop;

		if (attributes) {
			if (typeof attributes==='string' || typeof attributes==='number') {
				this.id = this.attributes.id = attributes;
			}
			else {
				this.fromJSON(attributes);
			}
		}

		if (this.id) {
			this.fetch(callback);
		}
		else {
			this.localId = getId();
			setTimeout(function() {
				self.fromCache();
				callback.call(self, null, self.attributes);
				self = null;
			}, 1);
		}
	}

	$.inherits(Model, $.EventEmitter);
	
	$.extend(Model.prototype, {
		type : 'Model',
		url : '/api/{{type}}/{{id}}',
		idPath : 'id',
		synced : false,
		attributes : {},

		set : function(key, value) {
			var old = this.attributes[key];
			this.attributes[key] = value;
			this.emit('change', [key, value, old]);
			this.cache();
			this.sync();
		},

		get : function(key, callback) {
			if (typeof callback==='function') {
				return this._fetchIfNotSynced(function() {
					callback(this.attributes[key]);
				});
			}
			return this.attributes[key];
		},

		cache : function(db) {
			var id = this.localId || this.id,
				dba = db || this.db;
			if (dba) {
				dba.setValue('$.Model.'+this.type+'.'+id, this.toJSON());
			}
			return this;
		},

		fromCache : function(db) {
			var id = this.localId || this.id,
				dba = db || this.db,
				json = dba && id && dba.getValue('$.Model.'+this.type+'.'+id);
			if (json) {
				this.fromJSON(json);
			}
			return this;
		},

		fetch : function(callback) {
			var self = this,
				json = this.toJSON();
			callback = callback || noop;
			this.emit('beforefetch, fetchstart', this);
			json.id = this.id || json.id;
			$.net.get($.template(this.url, json), function(success, json) {
				if (!success) {
					self.emit('fetcherror', self);
					return callback.call(self, 'Error: '+json, null);
				}
				self.fromJSON(json);
				self.synced = true;
				self.emit('fetch, fetchend', self);
				callback.call(self, null, json);
			});
			return this;
		},

		sync : function(callback) {
			var self = this,
				json;
			callback = callback || noop;
			if (this.initialized!==true) {
				return callback();
			}
			this.emit('beforesync, syncstart', this);
			json = this.toJSON();
			delete json.localId;
			$.net.post($.template(this.url, json), json, function(success, json) {
				if (!success) {
					self.emit('syncerror', json);
					return callback.call(self, 'Error: '+json, null);
				}
				self.synced = true;
				self.id = $.delve(json, self.idPath);
				self.emit('sync, syncend', self);
				callback.call(self, null, json);
			});
			return this;
		},

		_fetchIfNotSynced : function(callback) {
			var self = this;
			callback = callback || noop;
			if (this.synced===true) {
				return setTimeout(function() {
					callback.call(self, true);
				}, 1);
			}
			return this.fetch(callback);
		},

		toJSON : function() {
			return $.extend({}, this.attributes);
		},

		fromJSON : function(json) {
			this.attributes = $.extend({}, json);
			if (json.id) {
				this.id = json.id;
				if (this.localId) {
					db.removeKey('$.Model.'+this.type+'.'+this.localId);
					delete this.localId;
					this.cache();
				}
			}
			else if (!this.id && !this.localId && json.localId) {
				this.localId = json.localId;
				this.cache();
			}
			return this;
		}
	});

	// Come on, it'll be fun
	$.model = $.Model = Model.Model = Model;
	return Model;
}));
