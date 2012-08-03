Ext.ns('Ext.ux');

ActiveSupport = 
{
	bind : function bind (func,object) {
		if (typeof(object) == 'undefined') {
			return func;
		}
		return function bound () {
			return func.apply(object,arguments);
		};
	},
	curry: function curry (func) {
		if(arguments.length == 1) {
			//console.log(func);
            return func;
		}
        
        


		var args = ActiveSupport.arrayFrom(arguments).slice(1);
		return function curried() {
			return func.apply(this,args.concat(ActiveSupport.arrayFrom(arguments)));
		};
	},
	arrayFrom: function arrayFrom (object) {
		if (!object) {
			return [];
		}
		var length = object.length || 0;
		var results = new Array(length);
		while (length--) {
			results[length] = object[length];
		}
		return results;
	}
};