#!/usr/bin/env python3

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

import ast2json
import glob
import itertools
import json
import optparse
import os.path
import pickle
import sys
import zlib

class Dummy:
    def record_pycode(self, *args, **kwargs):
        return
    all_pycode = []

# Needed for pickle to read the AST
import renpy
import renpy.object
import renpy.game
renpy.game.script = Dummy()
import renpy.ast
import renpy.atl
import renpy.statements
import renpy.parser

def pretty_print_ast(out_file, ast):
    json.dump(rast2json(ast), out_file, separators=(',', ':'))

def node2json(node):
    to_return = {}
    to_return['_type'] = node.__class__.__name__
    if isinstance(node, renpy.ast.UserStatement):
        node.parsed = renpy.statements.parse(node, node.line)
    for attr in node.__slots__:
        to_return[attr] = get_value(getattr(node, attr))

    return to_return

def rast2json(ast):
    return list(map(node2json, ast))

def get_value(attr_value):
    if attr_value is None:
        return attr_value
    if isinstance(attr_value, (int, str, float, complex, bool)):
        return attr_value
    if isinstance(attr_value, list) or isinstance(attr_value, tuple):
        return [get_value(x) for x in attr_value]
    if isinstance(attr_value, dict):
        return attr_value
    if isinstance(attr_value, renpy.ast.Node):
        return node2json(attr_value)
    if isinstance(attr_value, renpy.ast.PyCode):
        return {
            "source": attr_value.source,
            "ast": ast2json.str2json(attr_value.source)
        }
    if isinstance(attr_value, renpy.ast.ArgumentInfo):
        return list(map(lambda x: getattr(attr_value, x), ["arguments", "extrapos", "extrakw"]))
    if isinstance(attr_value, renpy.atl.RawBlock):
        return 'ATL not implemented'

    raise Exception("I don't know how to decompile '%s' of type '%s'!" % (attr_value, type(attr_value)))

def read_ast_from_file(in_file):
    raw_contents = zlib.decompress(in_file.read())
    _, stmts = pickle.loads(raw_contents)
    return stmts

def decompile_rpyc(input_filename, out_filename):

    print("Decompiling %s to %s..." % (input_filename, out_filename))

    with open(input_filename, 'rb') as in_file:
        ast = read_ast_from_file(in_file)

    with open(out_filename, 'w', encoding='utf-8') as out_file:
        pretty_print_ast(out_file, ast)

if __name__ == "__main__":

    if len(sys.argv) != 3: raise Exception()

    decompile_rpyc(sys.argv[1], sys.argv[2])

