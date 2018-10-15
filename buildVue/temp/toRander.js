
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



function parse() {
   return parseHTML();
}

function parseHTML() {
    let index = 0;
    let stack = [];
  
    let currentParent, root;
    while(html) {
        //判断匹配的是不是字符串
        let textEnd = html.indexOf('<');
        if(textEnd === 0) {
        //判断是不是结束
        let endTagMach = html.match(endTag);
        if(endTagMach) {
            advance(endTagMach[0].length);
            parseEndTag(endTagMach[1]);
            continue;
        }

        if(html.match(startTagOpen)) {
            const startTagMatch = parseStartTag();
            //匹配成功后
            const element = {
                type: 1,
                tag: startTagMatch.tagName,
                lowerCasedTag: startTagMatch.tagName.toLowerCase(),
                attrsList: startTagMatch.attrs,
                // attrsMap: makeAttrsMap(startTagMatch.attrs),
                parent: currentParent,
                children: []
            }

            if(!root) {
                root = element
            }

            if(currentParent) {
                currentParent.children.push(element);
            }
            
            stack.push(element)

            currentParent = element;
            continue;
        }
        //判断是不是开始
        
        }else {
            //判断是不是{{xxx}}
           text = html.substring(0, textEnd);
           advance(textEnd);
           let expression;
           if(expression = parseText(text)){
                currentParent.children.push({
                    type:2,
                    text,
                    expression
                })
           }else {
                currentParent.children.push({
                    type:3,
                    text,
                })
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
        if(start) {
            const match =  {
                tagName: start[1],
                attr:[],
                start: index,
            }
    
            advance(start[0].length);
    
            let end, attr;
            //循环属性
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
                advance(attr[0].length);
            }
    
            //处理结束
    
            if(end) {
                match.unarySlash = end[1];
                advance(end[0].length);
                match.end = index;
                return match
            }
        }
    }
    function parseText(text) {
        //正则匹配 括号之前 括号之后 括号内
        if(!defaultTagRE.test(text)) {
            return;
        }
        const token = [];
        let index,match;
        let lastIndex  =defaultTagRE.lastIndex = 0;
        while((match = defaultTagRE.exec(text))) {
            index = match.index;
            if(index > lastIndex) {//匹配 aaa{{xxx}}bbb的aaa部分
                token.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            const exp = match[1].trim();
            token.push(`_s(${exp})`);
            lastIndex = index + match[0].length;
        }
        if(index < text.length) {//匹配 aaa{{xxx}}bbb的bbb部分
            token.push(JSON.stringify(text.slice(lastIndex)))
        }
    
        return token.join("+")
    }
    // 到结尾处更换当前元素
function parseEndTag(tagName) {
    let pos;

    for( pos = stack.length - 1; pos >=0; pos --) {
        if(stack[pos].lowerCasedTag === tagName.toLowerCase()) {
            break;
        }
    }

    if(pos >= 0) {
        if(pos > 0) {
            currentParent = stack[pos -1];
        }else {
            currentParent = null;
        }
        stack.length = pos;
    }
}
}
//判断是否是静态节点
function isStatic (node) {
    if(node.type === 1) {
        return false;
    }
    if(node.type === 3) {
        return true;
    }

}
function markStatic (node) {
    node.static = isStatic(node);

    if(node.type === 1) {
        for(let i = 0; i < node.children.length; i ++) {
            const child = node.children[i];
            markStatic(child);
            if(!child.static) {
                node.static = false;
            }
        }
    }
}

function markStaticRoots(node) {
    if(node.type === 1) {
        if(node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
            node.staticRoot = true;
            return;
        }else {
            node.staticRoot = false;
        }
    }
}
function optimize (node) {
    //标记静态节点
    markStatic(node);
    //标记静态根节点
    markStaticRoots(node);
}

function generate(rootAst) {
    function genText(el) {
        return `_v(${el.expression})`
    }

    function genNode(el) {
        if(el.type === 1) {
            return genElement(el);
        }else {
            return genText(el);
        }
    }
    function genChildren(el) {
        const child = el.children;
        if(child && child.length > 0) {
            return `${child.map(genNode).join(',')}`;
        }
    }
    function genElement(el) {
        if(el.if) {

        }else if(el.for) {

        }else {
            const child = genChildren(el);
            let code;
            code = `_c('${el.tag},'{}${child? `,${child}`: ''})`
            return code;
        }
        
    }

    const code = rootAst?genElement(rootAst) : '_c("div")';
    return {
        render:`with(this)return{${code}}`,
    }; 
}

let html = "<div><span>{{gan}}</span></div>";
let ast = parse();

optimize(ast);
let rend = generate(ast);