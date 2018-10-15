(function (global, factory) {
    global.Vue = factory()
}(this, function () {
    console.log("let's go")
    function noop(a, b, c) { }

    function isUndef(v) {
        return v === undefined || v === null
    }
    function isDef(v) {
        return v !== undefined && v !== null
    }
    //工具
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }
    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        })
    }
    function getOuterHTML(el) {
        if (el.outerHTML) {
            return el.outerHTML;
        }
    }
    function isNative (Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
      }
      
    /**
 * Query an element selector if it's not an element already.
 */
    function query(el) {
        if (typeof el === 'string') {
            var selected = document.querySelector(el);
            if (!selected) {

                return document.createElement('div')
            }
            return selected
        } else {
            return el
        }
    }

    function sameVnode(a, b) {
        return (
            a.key === b.key && (
                (
                    a.tag === b.tag &&
                    a.isComment === b.isComment &&
                    isDef(a.data) === isDef(b.data) &&
                    sameInputType(a, b)
                ) || (
                    isTrue(a.isAsyncPlaceholder) &&
                    a.asyncFactory === b.asyncFactory &&
                    isUndef(b.asyncFactory.error)
                )
            )
        )
    }
    var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
    function createFunction(code, errors) {
        try {
            return new Function(code)
        } catch (err) {
            errors.push({ err: err, code: code });
            return noop
        }
    }
    var sharedPropertyDefinition = {
        enumerable: true,
        configurable: true,
        get: noop,
        set: noop
    };
    function proxy(target, sourceKey, key) {

        sharedPropertyDefinition.get = function PorxyGetter() {
            return this[sourceKey][key]
        }

        Object.defineProperty(target, key, sharedPropertyDefinition);
    }
    var has = [];
    var queue = [];
    var waiting = false;
    var flushing = false;
    var VNode = function VNode(
        tag,
        data,
        children,
        text,
        elm,
        context,
        componentOptions,
        asyncFactory
    ) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.functionalContext = undefined;
        this.functionalOptions = undefined;
        this.functionalScopeId = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
        this.asyncFactory = asyncFactory;
        this.asyncMeta = undefined;
        this.isAsyncPlaceholder = false;
    };
    var emptyNode = new VNode('', {}, []);
    function initRender(vm) {
        vm._c = function (a, b, c, d) {
            return createElement(vm, a, b, c, d, false);
        }
        vm.$createElement = function (a, b, c, d) {
            return createElement(vm, a, b, c, d, false);
        }
    }

    function createElement(
        context,
        tag,
        data,
        children,
        normalizationType,
        alwaysNormalize
    ) {

        //进行条件判断
        if (Array.isArray(data)) {
            children = data;
            data = undefined;
        }
        return _createElement(context, tag, data, children, normalizationType)
    }
    function _createElement(
        context,
        tag,
        data,
        children,
        normalizationType
    ) {
        var vnode;
        if (typeof tag === "string") {
            vnode = new VNode(tag, data, children, undefined, undefined, context);
        }
        return vnode;
    }

    var initProxy;
    {
        var hasProxy = typeof Proxy !== 'undefined' &&
            Proxy.toString().match(/native code/);

        var hasHandle = {
            has: function has(target, key) {
                var has = key in target;

                return has;
            }
        }
        initProxy = function initProxy(vm) {
            vm._renderProxy = new Proxy(vm, hasHandle);
        }
    }
    // 正则
    const ncname = '[a-zA-Z_][\\w\\-\\.]*';
    const singleAttrIdentifier = /([^\s"'<>/=]+)/
    const singleAttrAssign = /(?:=)/
    const singleAttrValues = [
        /"([^"]*)"+/.source,
        /'([^']*)'+/.source,
        /([^\s"'=<>`]+)/.source
    ]
    const attribute = new RegExp(
        '^\\s*' + singleAttrIdentifier.source +
        '(?:\\s*(' + singleAttrAssign.source + ')' +
        '\\s*(?:' + singleAttrValues.join('|') + '))?'
    )

    const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
    const startTagOpen = new RegExp('^<' + qnameCapture)
    const startTagClose = /^\s*(\/?)>/

    const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>')

    const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

    const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/

    function createCompilerCreator(baseCompile) {
        return function createCompiler() {
            function compile(
                template
            ) {
                var compiled = baseCompile(template);
                return compiled;
            }
            return {
                compile: compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            }
        }
    }
    var createCompiler = createCompilerCreator(function baseCompile(template,
        options) {
        var ast = parse(template.trim(), options);
        optimize(ast, options);
        var code = generate(ast, options);
        return {
            ast: ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        }
    })
    function createCompileToFunctionFn(compile) {
        return function compileToFunctions(
            template,
            options,
            vm
        ) {
            var compiled = compile(template, options);

            var res = {};
            res.render = createFunction(compiled.render);
            return res;
        }
    }

    var $ref = createCompiler();
    var compileToFunctions = $ref.compileToFunctions;

    function parse(template) {

        return parseHTML(template);
    }
    function parseHTML(template) {
        let index = 0;
        let stack = [];
        let html = template;
        let currentParent, root;
        while (html) {
            //判断匹配的是不是字符串
            let textEnd = html.indexOf('<');
            if (textEnd === 0) {
                //判断是不是结束
                let endTagMach = html.match(endTag);
                if (endTagMach) {
                    advance(endTagMach[0].length);
                    parseEndTag(endTagMach[1]);
                    continue;
                }

                if (html.match(startTagOpen)) {
                    const startTagMatch = parseStartTag();
                    //匹配成功后
                    const element = {
                        type: 1,
                        tag: startTagMatch.tagName,
                        lowerCasedTag: startTagMatch.tagName.toLowerCase(),
                        attrsList: startTagMatch.attrs,
                        attrsMap: makeAttrsMap(startTagMatch.attrs),
                        parent: currentParent,
                        children: []
                    }

                    if (!root) {
                        root = element
                    }

                    if (currentParent) {
                        currentParent.children.push(element);
                    }

                    stack.push(element)

                    currentParent = element;
                    continue;
                }
                //判断是不是开始

            } else {
                //判断是不是{{xxx}}
                text = html.substring(0, textEnd);
                advance(textEnd);
                let expression;
                if (text.trim()) {
                    if (expression = parseText(text)) {
                        currentParent.children.push({
                            type: 2,
                            text,
                            expression
                        })
                    } else {
                        currentParent.children.push({
                            type: 3,
                            text,
                        })
                    }
                }

            }
        }
        return root;

        //根据传入的n截取字符
        function advance(n) {
            index += n;
            html = html.substring(n);
        }

        function parseStartTag() {
            let start = html.match(startTagOpen);
            if (start) {
                const match = {
                    tagName: start[1],
                    attrs: [],
                    start: index,
                }

                advance(start[0].length);

                let end, attr;
                //循环属性
                while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                    advance(attr[0].length);
                    match.attrs.push({
                        name: attr[1],
                        value: attr[3]
                    });
                }

                //处理结束

                if (end) {
                    match.unarySlash = end[1];
                    advance(end[0].length);
                    match.end = index;
                    return match
                }
            }
        }
        function parseText(text) {
            //正则匹配 括号之前 括号之后 括号内
            if (!defaultTagRE.test(text)) {
                return;
            }
            const token = [];
            let index, match;
            let lastIndex = defaultTagRE.lastIndex = 0;
            while ((match = defaultTagRE.exec(text))) {
                index = match.index;
                if (index > lastIndex) {//匹配 aaa{{xxx}}bbb的aaa部分
                    token.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                const exp = match[1].trim();
                token.push(`_s(${exp})`);
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {//匹配 aaa{{xxx}}bbb的bbb部分
                token.push(JSON.stringify(text.slice(lastIndex)))
            }

            return token.join("+")
        }
        // 到结尾处更换当前元素
        function parseEndTag(tagName) {
            let pos;

            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
                    break;
                }
            }

            if (pos >= 0) {
                if (pos > 0) {
                    currentParent = stack[pos - 1];
                } else {
                    currentParent = null;
                }
                stack.length = pos;
            }
        }

        function makeAttrsMap(attrs) {
            const map = {}
            for (let i = 0, l = attrs.length; i < l; i++) {
                map[attrs[i].name] = attrs[i].value;
            }
            return map
        }
    }
    //判断是否是静态节点
    function isStatic(node) {
        if (node.type === 1) {
            return false;
        }
        if (node.type === 3) {
            return true;
        }

    }
    function markStatic(node) {
        node.static = isStatic(node);

        if (node.type === 1) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                markStatic(child);
                if (!child.static) {
                    node.static = false;
                }
            }
        }
    }

    function markStaticRoots(node) {
        if (node.type === 1) {
            if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
                node.staticRoot = true;
                return;
            } else {
                node.staticRoot = false;
            }
        }
    }
    function optimize(node) {
        //标记静态节点
        markStatic(node);
        //标记静态根节点
        markStaticRoots(node);
    }
    function generate(rootAst) {
        function genText(el) {
            return `_v(${el.expression})`
        }
        function genData(el) {
            // 暂时只取出来id
            if (el.attrsList.length) {
                return `{attr:{'id':'${el.attrsList[0].value}'}}`
            }

        }
        function genNode(el) {
            if (el.type === 1) {
                return genElement(el);
            } else {
                return genText(el);
            }
        }
        function genChildren(el) {
            const child = el.children;
            if (child && child.length > 0) {
                return `[${child.map(genNode).join(',')}]`;
            }
        }
        function genElement(el) {
            if (el.if) {

            } else if (el.for) {

            } else {
                const data = genData(el);
                const children = genChildren(el);
                let code;
                code = `_c('${el.tag}'${data ? `,${data}` : ''}${children ? `,${children}` : ''})`
                return code;
            }

        }

        const code = rootAst ? genElement(rootAst) : '_c("div")';
        return {
            render: `with(this)return ${code}`,
        };
    }
    function mountComponent(
        vm,
        el,
        hydrating
    ) {
        vm.$el = el;

        var updateComponent;

        updateComponent = function () {
            vm._update(vm._render(), hydrating);
        }


        vm._watcher = new Watcher(vm, updateComponent, noop);
        hydrating = false;

        return vm;
    }
    function createTextVNode(val) {
        return new VNode(undefined, undefined, undefined, String(val))
    }
    function toString(val) {
        return val == null
            ? "" : typeof val === "object"
                ? JSON.stringify(val, null, 2)
                : String(val);
    }
    function installRenderHelpers(target) {
        target._v = createTextVNode;
        target._s = toString;
    }
    function renderMixin(Vue) {
        installRenderHelpers(Vue.prototype);

        Vue.prototype._render = function () {
            var vm = this;
            var ref = vm.$option.ref;
            var render = ref.render;

            var vnode;
            try {
                vnode = render.call(vm._renderProxy, vm.$createElement)
            } catch (e) {
                console.log(e);
            }

            return vnode;
        }
    }
    function createElement$1(tagName, vnode) {
        var elm = document.createElement(tagName);
        if (tagName !== 'select') {
            return elm
        }
        // false or null will remove the attribute but undefined will not
        if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
            elm.setAttribute('multiple', 'multiple');
        }
        return elm
    }

    function createElementNS(namespace, tagName) {
        return document.createElementNS(namespaceMap[namespace], tagName)
    }

    function createTextNode(text) {
        return document.createTextNode(text)
    }

    function createComment(text) {
        return document.createComment(text)
    }

    function insertBefore(parentNode, newNode, referenceNode) {
        parentNode.insertBefore(newNode, referenceNode);
    }

    function removeChild(node, child) {
        node.removeChild(child);
    }

    function appendChild(node, child) {
        node.appendChild(child);
    }

    function parentNode(node) {
        return node.parentNode
    }

    function nextSibling(node) {
        return node.nextSibling
    }

    function tagName(node) {
        return node.tagName
    }

    function setTextContent(node, text) {
        node.textContent = text;
    }

    function setAttribute(node, key, val) {
        node.setAttribute(key, val);
    }


    var nodeOps = Object.freeze({
        createElement: createElement$1,
        createElementNS: createElementNS,
        createTextNode: createTextNode,
        createComment: createComment,
        insertBefore: insertBefore,
        removeChild: removeChild,
        appendChild: appendChild,
        parentNode: parentNode,
        nextSibling: nextSibling,
        tagName: tagName,
        setTextContent: setTextContent,
        setAttribute: setAttribute
    });
    function createPatchFunction(backend) {
        var nodeOps = backend.nodeOps;
        var modules = backend.modules;
        var insertedVnodeQueue = [];
        var cbs = {};
        for (let i = 0; i < hooks.length; i++) {
            cbs[hooks[i]] = [];
            for (let j = 0; j < modules.length; j++) {
                cbs[hooks[i]].push(modules[j][hooks[i]]);
            }
        }
        var inPre = 0;
        function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
            var tag = vnode.tag;
            var data = vnode.data;
            var children = vnode.children;

            if (isDef(tag)) {
                //创建元素
                vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);

                {
                    //创建子元素
                    createChildren(vnode, children, insertedVnodeQueue);
                    //创建attr    
                    if (isDef(data)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                    }
                    insert(parentElm, vnode.elm, refElm)
                }


            } else {
                vnode.elm = nodeOps.createTextNode(vnode.text);
                insert(parentElm, vnode.elm, refElm)
            }
        }
        function invokeCreateHooks(vnode, insertedVnodeQueue) {
            for (var i$1 = 0; i$1 < cbs.create.length; i$1++) {
                cbs.create[i$1](emptyNode, vnode);
            }
        }
        function createChildren(vnode, children, insertedVnodeQueue) {
            if (Array.isArray(children)) {
                for (let i = 0; i < children.length; i++) {
                    createElm(children[i], insertedVnodeQueue, vnode.elm, null, null);
                    // console.log("122")
                }
            }
        }
        function insert(parent, elm, ref$$1) {
            if (isDef(parent)) {
                if (isDef(ref$$1)) {
                    if (ref$$1.parentNode === parent) {
                        nodeOps.insertBefore(parent, elm, ref$$1);
                    }
                } else {
                    nodeOps.appendChild(parent, elm);
                }
            }
        }

        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx];
                if (isDef(ch)) {
                    if (isDef(ch.tag)) {
                        removeAndInvokeRemoveHook(ch);
                        //   invokeDestroyHook(ch);
                    } else { // Text node
                        //   removeNode(ch.elm);
                    }
                }
            }
        }

        function removeAndInvokeRemoveHook(vnode, rm) {
            // rm = createRmCb(vnode.elm)
            // rm();
            removeNode(vnode.elm)
        }
        function createRmCb(childElm, listeners) {
            function remove() {
                if (--remove.listeners === 0) {
                    removeNode(childElm);
                }
            }
            remove.listeners = listeners;
            return remove
        }
        function removeNode(el) {
            var parent = nodeOps.parentNode(el);
            // element may have already been removed due to v-html / v-text
            if (isDef(parent)) {
                nodeOps.removeChild(parent, el);
            }
        }
        function emptyNodeAt(elm) {
            return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
        }
        function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
                createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
            }
        }
        function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
            if (oldVnode === vnode) return;

            var elm = vnode.elm = oldVnode.elm;
            var oldCh = oldVnode.children;
            var ch = vnode.children;

            if (isUndef(vnode.text)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
                } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, "") }
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                }
            } else if (oldVnode.text !== vnode.text) {
                nodeOps.setTextContent(elm, vnode.text);
            }
        }
        function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
            var oldStartIdx = 0;
            var newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

            var canMove = !removeOnly;

            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (isUndef(oldStartVnode)) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
                } else if (isUndef(oldEndVnode)) {
                    oldEndVnode = oldCh[--oldEndIdx];
                } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
                    idxInOld = isDef(newStartVnode.key)
                        ? oldKeyToIdx[newStartVnode.key]
                        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                    if (isUndef(idxInOld)) { // New element
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
                    } else {
                        // vnodeToMove = oldCh[idxInOld];
                        // /* istanbul ignore if */
                        // if ("development" !== 'production' && !vnodeToMove) {
                        //     warn(
                        //         'It seems there are duplicate keys that is causing an update error. ' +
                        //         'Make sure each v-for item has a unique key.'
                        //     );
                        // }
                        // if (sameVnode(vnodeToMove, newStartVnode)) {
                        //     patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
                        //     oldCh[idxInOld] = undefined;
                        //     canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                        // } else {
                        //     // same key but different element. treat as new element
                        //     createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
                        // }
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
            if (oldStartIdx > oldEndIdx) {
                refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
        return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
            if (isUndef(oldVnode)) {

            } else {
                var isRealElement = isDef(oldVnode.nodeType);

                if (!isRealElement && sameVnode(oldVnode, vnode)) {
                    patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
                } else {
                    if (isRealElement) {
                        oldVnode = emptyNodeAt(oldVnode);
                        var oldElm = oldVnode.elm;
                        var parentElm$1 = nodeOps.parentNode(oldElm);
                        createElm(
                            vnode,
                            insertedVnodeQueue,
                            // extremely rare edge case: do not insert if old element is in a
                            // leaving transition. Only happens when combining transition +
                            // keep-alive + HOCs. (#4590)
                            oldElm._leaveCb ? null : parentElm$1,
                            nodeOps.nextSibling(oldElm)
                        );

                    }

                    if (isDef(parentElm$1)) {
                        removeVnodes(parentElm$1, [oldVnode], 0, 0);
                    }
                }
            }
        }
    }


    function updateAttrs(oldVnode, vnode) {
        var key, cur, old;
        var elm = vnode.elm;
        var oldAttrs = oldVnode.data.attr || {};
        var attrs = vnode.data.attr || {};

        for (key in attrs) {
            cur = attrs[key];
            old = oldAttrs[key];

            if (old != cur) {
                setAttr(elm, key, cur)
            }
        }
    }
    function setAttr(el, key, value) {
        el.setAttribute(key, value);
    }
    var attrs = {
        create: updateAttrs,
        update: updateAttrs
    };
    var platformModules = [
        attrs,
    ];

    var patch = createPatchFunction({ nodeOps: nodeOps, modules: platformModules });
    Vue$3.prototype.__patch__ = patch;
    function lifecycleMixin(Vue) {
        Vue.prototype._update = function (vnode, hydrating) {

            var vm = this;
            var prevEl = vm.$el;
            var prevVnode = vm._vnode;
            vm._vnode = vnode;

            if (!prevVnode) {
                // initial render
                vm.$el = vm.__patch__(
                    vm.$el, vnode
                );
                // no need for the ref nodes after initial patch
                // this prevents keeping a detached DOM tree in memory (#5851)
                vm.$option._parentElm = vm.$option._refElm = null;
            } else {
                // updates
                vm.$el = vm.__patch__(prevVnode, vnode);
            }


            //删除之前的
        }


    }
    //加载
    function Vue$3(options) {
        console.log("init")
        //初始化
        this._init(options);

    }
    Vue$3.prototype.$mount = function (el, hydrating) {
        el = query(el);
        return mountComponent(this, el, hydrating);
    }
    let mount = Vue$3.prototype.$mount;
    Vue$3.prototype.$mount = function (el) {
        el = query(el);

        var options = this.$option;
        //判断有无rander
        if (!options.render) {
            //没有重新编译
            let template = options.template;
            if (template) {

            } else if (el) {
                template = getOuterHTML(el);
            }

            //str -> renderfunction
            if (template) {
                var ref = compileToFunctions(template);
                var rander = ref.render;
                options.rander = rander;
                options.ref = ref;
            }

        }
        return mount.call(this, el)

    }

    initMixin(Vue$3);
    //初始化混入
    renderMixin(Vue$3);
    lifecycleMixin(Vue$3);
    function initMixin(Vue) {

        Vue.prototype._init = function (options) {
            let vm = this;
            vm.$option = options;//
            //进行观察

            initState(vm);
            initProxy(vm);
            initRender(vm);
            if (vm.$option.el) {
                vm.$mount(vm.$option.el);
            }
        }
    }


    //加载data 后期可能有 method 

    function initState(vm) {
        let opts = vm.$option;
        if (opts.data) {
            initData(vm);
        }
    }

    //初始化Data 

    function initData(vm) {
        var data = vm.$option.data;
        //一些检查 暂时不写
        vm._data = data;
        observe(data);
        var keys = Object.keys(data);
        var i = keys.length;
        while (i--) {
            var key = keys[i];

            proxy(vm, "_data", key);
        }
        //proxy data
        //进行mount
    }

    // dep 存储所有的watcher
    var Dep = function Dep() {
        this.subs = [];//用来存储watcher
    }
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub)
    }
    Dep.prototype.depend = function () {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    Dep.prototype.notify = function () {
        let subs = this.subs.slice();

        for (let i = 0; i < subs.length; i++) {
            subs[i].update();
        }
    }
    var nextTick = (function () {
        var callbacks = [];
        var pending = false;
        var timerFunc;

        function nextTickHandler() {
            pending = false;
            var copies = callbacks.slice(0);
            callbacks.length = 0;
            for (var i = 0; i < copies.length; i++) {
                copies[i]();
            }
        }

        // An asynchronous deferring mechanism.
        // In pre 2.4, we used to use microtasks (Promise/MutationObserver)
        // but microtasks actually has too high a priority and fires in between
        // supposedly sequential events (e.g. #4521, #6690) or even between
        // bubbling of the same event (#6566). Technically setImmediate should be
        // the ideal choice, but it's not available everywhere; and the only polyfill
        // that consistently queues the callback after all DOM events triggered in the
        // same loop is by using MessageChannel.
        /* istanbul ignore if */
        if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
            timerFunc = function () {
                setImmediate(nextTickHandler);
            };
        } else if (typeof MessageChannel !== 'undefined' && (
            isNative(MessageChannel) ||
            // PhantomJS
            MessageChannel.toString() === '[object MessageChannelConstructor]'
        )) {
            var channel = new MessageChannel();
            var port = channel.port2;
            channel.port1.onmessage = nextTickHandler;
            timerFunc = function () {
                port.postMessage(1);
            };
        } else
            /* istanbul ignore next */
            if (typeof Promise !== 'undefined' && isNative(Promise)) {
                // use microtask in non-DOM environments, e.g. Weex
                var p = Promise.resolve();
                timerFunc = function () {
                    p.then(nextTickHandler);
                };
            } else {
                // fallback to setTimeout
                timerFunc = function () {
                    setTimeout(nextTickHandler, 0);
                };
            }

        return function queueNextTick(cb, ctx) {
            var _resolve;
            callbacks.push(function () {
                if (cb) {
                    try {
                        cb.call(ctx);
                    } catch (e) {
                        handleError(e, ctx, 'nextTick');
                    }
                } else if (_resolve) {
                    _resolve(ctx);
                }
            });
            if (!pending) {
                pending = true;
                timerFunc();
            }
            // $flow-disable-line
            if (!cb && typeof Promise !== 'undefined') {
                return new Promise(function (resolve, reject) {
                    _resolve = resolve;
                })
            }
        }
    })();


    function flushSchedulerQueue() {
        flushing = true;
        var watcher, id;

        // Sort queue before flush.
        // This ensures that:
        // 1. Components are updated from parent to child. (because parent is always
        //    created before the child)
        // 2. A component's user watchers are run before its render watcher (because
        //    user watchers are created before the render watcher)
        // 3. If a component is destroyed during a parent component's watcher run,
        //    its watchers can be skipped.
        queue.sort(function (a, b) { return a.id - b.id; });

        // do not cache length because more watchers might be pushed
        // as we run existing watchers
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index];
            id = watcher.id;
            has[id] = null;
            watcher.run();
            // in dev build, check and stop circular updates.
            // if ("development" !== 'production' && has[id] != null) {
            //     circular[id] = (circular[id] || 0) + 1;
            //     if (circular[id] > MAX_UPDATE_COUNT) {
            //         warn(
            //             'You may have an infinite update loop ' + (
            //                 watcher.user
            //                     ? ("in watcher with expression \"" + (watcher.expression) + "\"")
            //                     : "in a component render function."
            //             ),
            //             watcher.vm
            //         );
            //         break
            //     }
            // }
        }

        // // keep copies of post queues before resetting state
        // var activatedQueue = activatedChildren.slice();
        // var updatedQueue = queue.slice();

        // resetSchedulerState();

        // // call component updated and activated hooks
        // callActivatedHooks(activatedQueue);
        // callUpdatedHooks(updatedQueue);

        // // devtool hook
        // /* istanbul ignore if */
        // if (devtools && config.devtools) {
        //     devtools.emit('flush');
        // }
    }
    function queueWatcher(Watcher) {
        let id = Watcher.id;
        if (has[id] == null) {
            has[id] = true;
            queue.push(Watcher);
        }
        nextTick(flushSchedulerQueue);
    }
    Dep.target = null;
    var targetStack = [];
    //wathcer 用来连接 数据更新 和 渲染dom

    var uid$2 = 0;
    var Watcher = function Watcher(
        vm,
        expOrFn,
        cb,
        options
    ) {
        this.vm = vm;
        this.id = ++uid$2;
        if (typeof expOrFn === "function") {
            this.getter = expOrFn;
        }

        this.value = this.get();
    }

    Watcher.prototype.get = function () {
        pushTarget(this);
        var value;
        var vm = this.vm;
        try {
            value = this.getter.call(vm, vm);
        } catch (e) {
            console.log("error", +e)
        }
    }
    Watcher.prototype.addDep = function (dep) {
        dep.addSub(this);
    }
    Watcher.prototype.depend = function () {

    }
    Watcher.prototype.update = function () {
        queueWatcher(this);
    }
    Watcher.prototype.run = function () {
        var value = this.get();
    }
    function pushTarget(_target) {
        if (Dep.target) { targetStack.push(Dep.target); }
        Dep.target = _target;
    }
    function popTarget() {
        Dep.target = targetStack.pop();
    }
    //观察者

    function observe(data) {

        var ob;

        ob = new Observer(data);


    }

    var Observer = function Observer(val) {
        this.value = val;
        this.dep = new Dep();
        def(val, "__ob__", this);
        this.walk(val);


    }
    Observer.prototype.walk = function (obj) {
        var keys = Object.keys(obj);

        for (var i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]]);//进行双向绑定
        }
    }

    function defineReactive(obj, key, val) {
        const dep = new Dep();

        //if prop can't config reurn
        let property = Object.getOwnPropertyDescriptor(obj);
        if (property && property.configurable === false) {
            return;
        }

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = val;
                if (Dep.target) {
                    dep.depend();
                }
                return value;
            },
            set: function reactiveSetter(newVal) {
                const value = val;
                if (newVal == value) {
                    return
                }
                dep.notify();
            }

        })
    }
    //加载全局api

    function initGlobalAPI(Vue) {



    }

    initGlobalAPI(Vue$3);

    Vue$3.version = "0.01";

    return Vue$3;
}));