(function(global, factory){
    global.Vue = factory
}(this, function(){
    console.log("let's go")

    //工具
    var hasOwnProperty = object.prototype.hasOwnProperty;
    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value:val,
            enumerable: !!enumerable,
            writable:true,
            configurable: true
        })
    }

    //加载
    function Vue$3 (options) {
        //初始化
        this._init(options);
    }
    initMixin(Vue$3);
    //初始化混入

    function initMixin (Vue) {

        Vue.prototype._init = function(options) {
            let vm = this;
            vm.$option = options;//
            //进行观察

            initState(vm);
        }
    }
    

    //加载data 后期可能有 method 

    function initState(vm) {
        let opts = vm.$option;
        if(opts.data) {
            initData(vm);
        }
    }

    //初始化Data 

    function initData(vm) {
        var data = vm.$option.data;
        //一些检查 暂时不写
        
        observe(data);
    }

    //观察者

    function observe(data) {

        var ob;

        ob = new Observe (data);


    }

    var Observer = function Observer(val) {
        this.value = val;
        this.dep = new Dep();
        def(val,"__ob__", this);
        this.walk(val);


    }
    Observer.prototype.walk = function (obj) {
        var keys = Object.keys(obj);

        for(var i = 0; i < keys.length; i ++) {
            defineReactive(obj,keys[i],obj[keys[i]]);//进行双向绑定
        }
    }

    function defineReactive (obj, key, val) {
        const  dep = new Dep();

        //if prop can't config reurn
        let property = Object.getOwnPropertyDescriptor(obj);
        if(property && property.configurable === false) {
            return;
        }

        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get: function reactiveGetter () {
                var value = val;
                if(Dep.target) {
                    
                }
            },
            set: function reactiveSetter () {

            }

        })
    }
    //加载全局api

    function initGlobalAPI ( Vue) {
        


    }
    
    initGlobalAPI (Vue$3);

    Vue$3.version = "0.01";
    return Vue$3;
}));