puredom.Model ![Version](http://img.shields.io/github/release/developit/puredom.Model.svg?style=flat) ⎔ [![Build Status](https://img.shields.io/travis/developit/puredom.Model.svg?style=flat&branch=master)](https://travis-ci.org/developit/puredom.Model) 
=============

A synchronized model base class for puredom.


Usage
-----

```JavaScript
// Grab via browserify, AMD or <script>:
var Model = require('puredom.Model'),
	$ = require('puredom'),
	db = new $.LocalStorage('babies');


// Create a class that inherits from Model
function Fox(attributesOrId, callback) {
	Model.call(this, attributesOrId, db, callback);
}

$.inherits(Fox, Model);

$.extend(Fox.prototype, {
	type : 'Fox',
	url : '/api/fox/{{id}}',
	
	/** Check if the fox is in posession of bacon */
	hasBacon : function() {
		return this.get('bacon') > 0;
	},
	
	/** Give the fox some bacon */
	giveBacon : function(amount) {
		var bacon = this.get('bacon') || 0;
		this.set('bacon', bacon + amount);
	}
});


// Create a new Fox:
var fox = new Fox({ bacon:0 }, function(err) {
	if (err) throw new Error(err);
	
	// set() and get() can be used synchronously after initialization:
	fox.set('xp', 42);
	fox.get('xp');		// 42
	
	// Try out those accessor methods:
	fox.hasBacon();		// false
	fox.giveBacon(1);
	fox.hasBacon();		// true
	
	// Any set() or sync() call triggers a sync:
	fox.synced;			// false
	fox.on('syncend', function() {
		fox.synced;		// true
	});
	
	// Synchronization can also be done manually:
	fox.sync(function(err) {
		// saved
	});
});


// Work with an existing Fox:
var id = '24g08h275na';

// Creating using an ID triggers a fetch() during initialization
var kit = new Fox(id, function(err) {
	if (err) throw new Error(err);
	
	kit.get('bacon');		// 1
	kit.giveBacon(5);
	kit.get('bacon');		// 6
});
```


License
-------
This plugin is available under the BSD-3-Clause License:

>	Copyright (c) Jason Miller. All rights reserved.
>	
>	Redistribution and use in source and binary forms, with or without modification, 
>	are permitted provided that the following conditions are met:
>	
>	*	Redistributions of source code must retain the above copyright notice, 
>		this list of conditions and the following disclaimer.
>	
>	*	Redistributions in binary form must reproduce the above copyright notice, 
>		this list of conditions and the following disclaimer in the documentation 
>		and/or other materials provided with the distribution.
>	
>	*	Neither the name of Jason Miller, nor the names of its contributors may be used to endorse 
>		or promote products derived from this software without specific prior written permission.
>	
>	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS 
>	OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY 
>	AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER 
>	OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
>	DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
>	DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER 
>	IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY 
>	OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
