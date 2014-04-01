#!/usr/bin/env python3

import json
import sys

def strings2json(ast):
    ret = {}
    if ast[0]['_type'] != 'Init': raise TypeError('obj does not start with Init, wrong file?')
    for string in ast[0]['block'][0]['code']['ast']['body'][1:]:
        target = string['targets'][0]
        if target['_type'] == 'Attribute':
            name = string['targets'][0]['attr']
            value = string['value']
            vtype = value['_type']
            if vtype == 'Str':
                ret[name] = value['s']
    return ret

with open(sys.argv[1], 'r') as f:
    output = strings2json(json.load(f))

json.dump(output, open(sys.argv[2], 'w'), separators=(',', ':'))
