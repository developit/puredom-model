describe('puredom-model', function() {
	it('should be a constructor', function() {
		expect(puredom.model).to.exist;
		expect(puredom.model).to.be.a.function;
		expect(puredom.model).to.equal( puredom.Model );
	});

	it('should initialize with attributes', function() {
		var model,
			attrs = {
				key : 'value'
			};

		expect(function() {
			model = puredom.model(attrs);
		}).not.to.throw;

		model = puredom.model(attrs);
		expect( model ).to.be.an.instanceof( puredom.model );
		expect( model.attributes ).to.deep.equal( attrs );
	});

	it('should initialize with an id', function() {
		var model,
			id = 'test-id';

		expect(function() {
			model = puredom.model(id);
		}).not.to.throw;

		model = puredom.model(id);
		expect( model ).to.be.an.instanceof( puredom.model );
		expect( model.id ).to.equal( id );
	});

});

describe('#set()', function() {
	it('should set a named attribute', function() {
		var model = puredom.model({});
		model.set('key', 'value');
		expect( model.attributes.key ).to.equal( 'value' );
	});

	it('should update a named attribute', function() {
		var model = puredom.model({
			key : 'value'
		});
		model.set('key', 'new-value');
		expect( model.attributes.key ).to.equal( 'new-value' );
	});

	it('should fire a change event', function() {
		var model = puredom.model({
				key : 'old-value'
			}),
			change = sinon.spy();
		model.on('change', change);

		model.set('key', 'new-value');
		expect( change ).to.have.been.calledWithExactly('key', 'new-value', 'old-value');
	});

	it('should update the local cache', function() {
		var model = puredom.model();
		model.cache = sinon.spy();
		model.set('key', 'value');
		expect( model.cache ).to.have.been.calledOnce;
	});

	it('should sync changes to the server', function() {
		var model = puredom.model();
		model.sync = sinon.spy();
		model.set('key', 'value');
		expect( model.sync ).to.have.been.calledOnce;
	});
});

describe('#get()', function() {
	it('should return a named attribute', function() {
		var model = puredom.model({
			key : 'value'
		});
		expect( model.get('key') ).to.equal( 'value' );
	});

	it('should return undefined for missing attributes', function() {
		var model = new puredom.Model();
		expect( model.get('key') ).to.equal( undefined );
	});
});

describe('#toJSON()', function() {
	it('should return attributes', function() {
		var attrs = {
			foo : 'bar',
			baz : 'bat'
		};

		var model = puredom.model(attrs);

		expect( model.toJSON() ).to.deep.equal( attrs );
	});
});

describe('#fromJSON()', function() {
	it('should overwrite attributes', function() {
		var attrs = {
			foo : 'bar',
			baz : 'bat'
		};

		var model = puredom.model({
			overwrite : 'me'
		});

		model.fromJSON(attrs);

		expect( model.toJSON() ).to.deep.equal( attrs );
	});
});
