/* @flow */

import { parse } from 'compiler/parser/index'
import { generate } from './codegen'
import { optimize } from './optimizer'
import { createCompilerCreator } from 'compiler/create-compiler'

export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)//将html 转化为ast 其实就是一个obj
  optimize(ast, options)//类似格式化obj
  const code = generate(ast, options)//将obj  抽象为这样的玩意{attrs:{"id":"fuck"}},[_c('p',{on:{"click":go}
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
