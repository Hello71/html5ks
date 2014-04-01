#!/usr/bin/env python3

import json
import sys

def imachine2json(ast):
    ret = {}
    if ast[0]['_type'] != 'Label':
        raise TypeError('obj does not start with Label, wrong file?')
    for label in ast:
        if label['parameters'] is not None or label['hide']:
            raise NotImplementedError()
        ret[label['name']] = label
    return ret

with open(sys.argv[1], 'r') as f:
    output = imachine2json(json.load(f))

json.dump(output, open(sys.argv[2], 'w'), separators=(',', ':'))
