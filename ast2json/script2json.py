#!/usr/bin/env python3

import json
import sys

def script2json(script):
    ret = {}
    if script[0]['_type'] != 'Label': raise TypeError('obj does not start with Label, wrong file?')
    for inst in script:
        inst_type = inst['_type']
        if inst_type == 'Label':
            label = []
            ret[inst['name']] = label
            continue

        func = statement_printer_dict.get(inst_type, print_Unknown)
        label.append([inst_type] + func(inst))
    return ret

def print_Say(stmt):
    return [stmt['who'], stmt['what'], stmt['with_']]

def print_Jump(stmt):
    if stmt['expression']:
        raise NotImplementedError()
    return [stmt['target']]

def print_Scene(stmt):
    return [stmt['imspec'], stmt['atl']]

def print_With(stmt):
    return [stmt['expr']]

def print_Show(stmt):
    return [stmt['imspec'], stmt['atl']]

def print_Hide(stmt):
    return [stmt['imspec']]

def print_Python(stmt):
    return [stmt['code']]

def print_Return(stmt):
    return [stmt['expression']]

def print_UserStatement(stmt):
    return [stmt['line']]

def print_Init(stmt):
    raise NotImplementedError()

def print_Image(stmt):
    raise NotImplementedError()

def print_Transform(stmt):
    raise NotImplementedError()

def print_Menu(stmt):
    if stmt['with_'] != 'menueffect':
        raise NotImplementedError()

    if stmt['set'] is not None:
        raise NotImplementedError()

    return []

    for item in stmt['items']:
        # caption
        f.write(u"\"%s\"" % (escape_string(item[0]), ))

        if item[2] is not None:
            # condition
            if item[1] != 'True':
                f.write(u" if %s" % (item[1], ))

            f.write(u':\n')

            for inner_stmt in item[2]:
                print_statement(f, inner_stmt, indent_level + 2)
        else:
            f.write(u'\n')

def print_Pass(stmt):
    return []

def print_Call(stmt):
    f.write(u"call ")
    if stmt['expression']:
        raise NotImplementedError()

    return [stmt['label'], stmt['arguments']]

def print_If(stmt):
    f.write(u"if %s:\n" % (stmt['entries'][0][0], ))
    for inner_stmt in stmt['entries'][0][1]:
        print_statement(f, inner_stmt, indent_level + 1)

    if len(stmt['entries']) >= 2:
        if stmt['entries'][-1][0].strip() == 'True':
            else_entry = stmt['entries'][-1]
            elif_entries = stmt['entries'][1:-1]
        else:
            else_entry = None
            elif_entries = stmt['entries']

        for case in elif_entries:
            indent(f, indent_level)
            f.write(u"elif %s:\n" % (case[0], ))
            for inner_stmt in case[1]:
                print_statement(f, inner_stmt, indent_level + 1)

        if else_entry is not None:
            indent(f, indent_level)
            f.write(u"else:\n")
            for inner_stmt in else_entry[1]:
                print_statement(f, inner_stmt, indent_level + 1)

def print_EarlyPython(stmt):
    print_Python(stmt, early=True)

statement_printer_dict = {
        "Say": print_Say,
        "Jump": print_Jump,
        "Scene": print_Scene,
        "With": print_With,
        "Show": print_Show,
        "Hide": print_Hide,
        "Python": print_Python,
        "Return": print_Return,
        "UserStatement": print_UserStatement,
        "Init": print_Init,
        "Image": print_Image,
        "Transform": print_Transform,
        "Menu": print_Menu,
        "Pass": print_Pass,
        "Call": print_Call,
        "If": print_If,
        "EarlyPython": print_EarlyPython,
    }

def print_Unknown(stmt):
    raise NotImplementedError("Unknown AST node: %s" % type(stmt).__name__)

with open(sys.argv[1], 'r') as f:
    output = script2json(json.load(f))

json.dump(output, open(sys.argv[2], 'w'), separators=(',', ':'))
