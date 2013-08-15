# Copyright (c) 2012 Yuri K. Schlesner
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import ast as python_ast
import renpy.ast as ast
import renpy.atl as atl
import code
import json

DECOMPILE_SCREENS = False
global firstLabel
firstLabel = True
global warnedATL
warnedATL = False

def pretty_print_ast(out_file, ast):
    out_file.write('{')
    for stmt in ast:
        print_statement(out_file, stmt, 0)
    out_file.write(']}')

def indent(f, level):
    # Print indentation
    f.write('    ' * level)

def print_statement(f, statement, indent_level=0):
    indent(f, indent_level)

    func = statement_printer_dict.get(type(statement), print_Unknown)
    func(f, statement, indent_level)

def escape_string(s):
    s = s.replace('"', '\\"')
    s = s.replace('\n', '\\n')
    s = s.replace('\t', '\\t')
    return s

# TODO "choice" and "parallel" blocks are greedily combined
#      so we need a "pass" statement to separate them if
#      multiple of the same block are immediately after
#      each other.
def print_atl(f, atl_block, indent_level):
    if not warnedATL:
        global warnedATL
        warnedATL = True
        print("ATL not yet implemented")
    return
    if not atl_block.statements:
        indent(f, indent_level)
    for stmt in atl_block.statements:
        indent(f, indent_level)

        if type(stmt) is atl.RawMultipurpose:
            # warper
            if stmt.warp_function:
                f.write("warp %s" % (stmt.warp_function.strip(), ))
                f.write(" %s " % (stmt.duration.strip(), ))
            elif stmt.warper:
                f.write(stmt.warper)
                f.write(" %s " % (stmt.duration.strip(), ))
            elif stmt.duration.strip() != '0':
                f.write('pause')
                f.write(" %s" % (stmt.duration.strip(), ))

            # revolution
            if stmt.revolution:
                f.write("%s " % (stmt.revolution, ))

            # circles
            if stmt.circles != "0":
                f.write("circles %s " % (stmt.circles.strip(), ))

            # splines
            for (name, exprs) in stmt.splines:
                f.write("%s " % (name, ))
                for expr in exprs:
                    f.write("knot %s " % (expr.strip(), ))

            # properties
            for (k, v) in stmt.properties:
                f.write("%s %s " % (k, v.strip()))

            # with
            for (expr, with_expr) in stmt.expressions:
                f.write("%s " % (expr.strip(), ))
                if with_expr:
                    f.write("with %s " % (with_expr, ))

            f.write("\n")

        elif type(stmt) is atl.RawBlock:
            # what does stmt.animation do?
            f.write("block:\n")
            print_atl(f, stmt, indent_level + 1)

        elif type(stmt) is atl.RawChoice:
            first = True
            for (chance, block) in stmt.choices:
                if first:
                    first = False
                else:
                    indent(f, indent_level)

                f.write("choice")
                if chance != "1.0":
                    f.write(" %s" % (chance, ))
                f.write(":\n")
                print_atl(f, block, indent_level + 1)

        elif type(stmt) is atl.RawContainsExpr:
            f.write("contains %s\n" % (stmt.expression, ))

        elif type(stmt) is atl.RawEvent:
            f.write("event %s\n" % (stmt.name, ))

        elif type(stmt) is atl.RawFunction:
            f.write("function %s\n" % (stmt.expr, ))

        elif type(stmt) is atl.RawOn:
            first = True
            for name, block in list(stmt.handlers.items()):
                if first:
                    first = False
                else:
                    indent(f, indent_level)

                f.write("on %s:\n" % (name, ))
                print_atl(f, block, indent_level + 1)

        elif type(stmt) is atl.RawParallel:
            first = True
            for block in stmt.blocks:
                if first:
                    first = False
                else:
                    indent(f, indent_level)

                f.write("parallel:\n")
                print_atl(f, block, indent_level + 1)

        elif type(stmt) is atl.RawRepeat:
            f.write("repeat")
            if stmt.repeats:
                f.write(" %s" % (stmt.repeats, )) # not sure if this is even a string
            f.write("\n")

        elif type(stmt) is atl.RawTime:
            f.write("time %s\n" % (stmt.time, ))

        else:
            f.write("TODO atl.%s\n" % type(stmt).__name__)

def print_imspec(f, imspec):
    if imspec[1] is not None: # Expression
        f.write('expression ')
        f.write(escape_string(imspec[1]))
    else: # Image name
        delim = ''
        for s in imspec[0]:
          f.write(delim + escape_string(s))
          delim = '", "'

    # at
    if len(imspec[3]) > 0:
        f.write('", "')
        delim = ''
        for s in imspec[3]:
          f.write(delim + escape_string(s))
          delim = ', '

    # as
    if imspec[2] is not None:
        f.write(" as %s" % (escape_string(imspec[2]), ))

    # behind
    if len(imspec[6]) > 0:
        f.write('", "behind", "')
        delim = ''
        for s in imspec[6]:
          f.write(delim + escape_string(s))
          delim = ', '

    f.write('"],')

def print_Label(f, stmt, indent_level):
    if firstLabel:
        global firstLabel
        firstLabel = False
    else:
        f.write("],\n")
    f.write("\"%s\": [\n" % (stmt.name, ))
    if stmt.parameters is not None:
        print("Error: label params")

    for sub_stmt in stmt.block:
        print_statement(f, sub_stmt, indent_level + 1)

def print_Say(f, stmt, indent_level):
    if stmt.who is not None:
        f.write('["%s", ' % (escape_string(stmt.who), ))
    else:
        f.write("[")
    f.write("\"%s\"]," % (escape_string(stmt.what), ))
    if stmt.with_ is not None:
        pass
        #f.write(" with %s" % (stmt.with_, ))
    f.write('\n')

def print_Jump(f, stmt, indent_level):
    f.write("jump ")
    if stmt.expression:
        # TODO expression
        f.write("expression TODO")
    else:
        f.write(stmt.target)
    f.write('\n')

def print_Scene(f, stmt, indent_level):
    f.write('["scene", "')
    print_imspec(f, stmt.imspec)

    # with isn't handled here, but split in several statements

    f.write('\n')
    if stmt.atl is not None:
        print_atl(f, stmt.atl, indent_level+1)

def print_With(f, stmt, indent_level):
    f.seek(-3, 1)
    f.write(', "%s"],\n' % (escape_string(stmt.expr), ))

def print_Show(f, stmt, indent_level):
    f.write('["show", "')
    print_imspec(f, stmt.imspec)

    # with isn't handled here, but split in several statements

    if stmt.atl is not None:
        f.write('\n')
        print_atl(f, stmt.atl, indent_level+1)
    else:
        f.write('\n')

def print_Hide(f, stmt, indent_level):
    f.write('["hide", "')
    print_imspec(f, stmt.imspec)

    # with isn't handled here, but split in several statements

    f.write('\n')

class PrintRenPython(python_ast.NodeVisitor):
    def __init__(self, f):
        self.f = f

    def visit_Attribute(self, node):
        return '"%s"' % node.attr

    def visit_Call(self, node):
        self.f.write('[')
        self.f.write(self.visit(node.func))
        self.f.write(', ')
        self.f.write(', '.join(map(self.visit, node.args)))
        self.f.write(', ')
        self.f.write(', '.join(map(self.visit, node.keywords)))
        self.f.write('],\n')

    def visit_Compare(self, node):
        self.f.write('[')
        self.f.write(self.visit(node.left))
        self.f.write(', ')
        self.f.write(self.visit(node.comparators[0]))
        self.f.write('], ')

    def quote(self, string):
        return '"%s"' % string

    def visit_Dict(self, node):
        return self.quote(python_ast.dump(node))

    def visit_Num(self, node):
        return json.dumps(node.n)

    def visit_Name(self, node):
        return json.dumps(node.id)

    def visit_Str(self, node):
        return json.dumps(node.s)

    def visit_keyword(self, node):
        return self.visit(node.value)

def print_Python(f, stmt, indent_level, early=False):
    code_src = stmt.code.source

    stripped_code = code_src.strip()

    if stripped_code.count('\n') == 0:
        stmt = compile(code_src, '<unknown>', 'exec', python_ast.PyCF_ONLY_AST).body[0]
        PrintRenPython(f).visit(stmt)
    else:
        f.write("python")
        if early:
            f.write(" early")
        if stmt.hide:
            f.write(" hide")
        f.write(":\n")

        for line in code_src.splitlines(True):
            indent(f, indent_level + 1)
            f.write(line)

def print_Return(f, stmt, indent_level):
    if stmt.expression is not None:
        f.write(' "%s",' % (stmt.expression, ))

    f.write('\n')

def print_UserStatement(f, stmt, indent_level):
    f.write('["%s"],\n' % (escape_string(stmt.line).replace(' ', '", "'), ))

def print_Init(f, stmt, indent_level):
    f.write("init")
    if stmt.priority != 0:
        f.write(" %d" % (stmt.priority, ))
    f.write(":\n")
    for s in stmt.block:
        print_statement(f, s, indent_level + 1)

def print_Image(f, stmt, indent_level):
    f.write("image %s" % (' '.join(stmt. imgname), ))
    if stmt.code is not None:
        f.write(" = %s\n" % (stmt.code.source, ))
    else:
        f.write("\n")
        print_atl(f, stmt.atl, indent_level + 1)

def print_Transform(f, stmt, indent_level):
    f.write("transform %s" % (stmt.varname, ))
    if stmt.parameters is not None:
        print_params(f, stmt.parameters)

    f.write("\n")
    print_atl(f, stmt.atl, indent_level + 1)

def print_Menu(f, stmt, indent_level):
    f.write('["menu", ')

    first = True

    for item in stmt.items:
        indent(f, indent_level + 1)

        if first and item[2] is not None:
            first = False
            f.write(' {\n')

        # caption
        f.write("\"%s\"" % (escape_string(item[0]), ))

        if first and item[2] is None:
            first = False
            f.write(', {')

        if item[2] is not None:
            f.write(':')
            for inner_stmt in item[2]:
                print_statement(f, inner_stmt, indent_level + 2)

    f.write('}]\n')

def print_Pass(f, stmt, indent_level):
    f.write("\n")

def print_Call(f, stmt, indent_level):
    f.write("[")
    if stmt.expression:
        f.write("expression %s" % (stmt.label, ))
    else:
        f.write('"%s"' % stmt.label)

    if stmt.arguments is not None:
        print_args(f, stmt.arguments)

    f.write('],\n')

def print_If(f, stmt, indent_level):
    f.write('["if", ')
    if_stmt = compile(stmt.entries[0][0], '<unknown>', 'exec', python_ast.PyCF_ONLY_AST).body[0]
    PrintRenPython(f).visit(if_stmt)
    f.write('[\n')
    for inner_stmt in stmt.entries[0][1]:
        print_statement(f, inner_stmt, indent_level + 1)

    if len(stmt.entries) >= 2:
        if stmt.entries[-1][0].strip() == 'True':
            else_entry = stmt.entries[-1]
            elif_entries = stmt.entries[1:-1]
        else:
            else_entry = None
            elif_entries = stmt.entries

        for case in elif_entries:
            indent(f, indent_level)
            f.write('], "elif", ')
            elif_stmt = compile(case[0], '<unknown>', 'exec', python_ast.PyCF_ONLY_AST).body[0]
            PrintRenPython(f).visit(if_stmt)
            f.write('[\n')
            for inner_stmt in case[1]:
                print_statement(f, inner_stmt, indent_level + 1)

        if else_entry is not None:
            indent(f, indent_level)
            f.write('], "else", [\n')
            for inner_stmt in else_entry[1]:
                print_statement(f, inner_stmt, indent_level + 1)

    f.write(']],\n')

def print_EarlyPython(f, stmt, indent_level):
    print_Python(f, stmt, indent_level, early=True)

# TODO extrapos, extrakw?
def print_args(f, arginfo):
    if arginfo is None:
        return

    for (name, val) in arginfo.arguments:
        f.write(', ')
#        if name is not None:
#            f.write("%s = " % json.dumps(name))
        f.write(json.dumps(eval(val)))

# TODO positional?
def print_params(f, paraminfo):
    f.write("(")

    first = True
    for param in paraminfo.parameters:
        if first:
            first = False
        else:
            f.write(", ")

        f.write(param[0])

        if (param[1] is not None) and ('None' not in param[1]):
            f.write(" = %s" % param[1])
    if paraminfo.extrapos:
        f.write(", ")
        f.write("*%s" % paraminfo.extrapos)
    if paraminfo.extrakw:
        f.write(", ")
        f.write("**%s" % paraminfo.extrakw)

    f.write(")")

# Print while command, from http://forum.cheatengine.org/viewtopic.php?p=5377683
def print_While(f, stmt, indent_level):
    f.write("while %s:\n" % (stmt.condition, ))
    for inner_stmt in stmt.block:
        print_statement(f, inner_stmt, indent_level + 1)

# Print define command, by iAmGhost
def print_Define(f, stmt, indent_level):
    f.write("define %s = %s\n" % (stmt.varname, stmt.code.source,))


statement_printer_dict = {
        ast.Label: print_Label,
        ast.Say: print_Say,
        ast.Jump: print_Jump,
        ast.Scene: print_Scene,
        ast.With: print_With,
        ast.Show: print_Show,
        ast.Hide: print_Hide,
        ast.Python: print_Python,
        ast.Return: print_Return,
        ast.UserStatement: print_UserStatement,
        ast.Init: print_Init,
        ast.Image: print_Image,
        ast.Transform: print_Transform,
        ast.Menu: print_Menu,
        ast.Pass: print_Pass,
        ast.Call: print_Call,
        ast.If: print_If,
        ast.While: print_While,
        ast.Define: print_Define,
        ast.EarlyPython: print_EarlyPython,
    }

def print_Unknown(f, stmt, indent_level):
    print(("Unknown AST node: %s" % (type(stmt).__name__, )))
    f.write("<<<UNKNOWN NODE %s>>>\n" % (type(stmt).__name__, ))
