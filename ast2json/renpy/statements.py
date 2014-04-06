# Copyright 2004-2010 PyTom <pytom@bishoujo.us>
#
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation files
# (the "Software"), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge,
# publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# This module contains code to support user-defined statements.

import renpy

# The statement registry. It's a map from tuples giving the prefixes of
# statements to dictionaries giving the methods used for that statement.
registry = { }

def register(name, parse=None, lint=None, execute=None, predict=None, next=None, scry=None):

    if name == "":
        name = ()
    else:
        name = tuple(name.split())
    
    registry[name] = dict(parse=parse,
                          lint=lint,
                          execute=execute,
                          predict=predict,
                          next=next,
                          scry=scry)

    while True:
        name = name[:-1]
        if not name:
            break

        if name not in registry:
            registry[name] = None
        
def parse(node, line):

    block = [ (node.filename, node.linenumber, line, [ ]) ]
    l = renpy.parser.Lexer(block)
    l.advance()

    name = ()

    while True:
        cpt = l.checkpoint()
        word = l.word()

        if word is None:
            break

        newname = name + (word,)

        if newname not in registry:
            break

        name = newname

    l.revert(cpt)

    if registry[name] is None:
        return None

    return ( name, registry[name]["parse"](l) )
        
        
def call(method, parsed, *args, **kwargs):
    name, parsed = parsed

    method = registry[name].get(method)
    if method is None:
        return None
    
    return method(parsed, *args, **kwargs)

# Music play - The example of a full statement.

def parse_play_music(l):


    file = l.simple_expression()
    if not file:
        renpy.error("play requires a file")

    fadeout = "None"
    fadein = "0"
    channel = None
    loop = None
    if_changed = False
    
    while True:

        if l.eol():
            break

        if l.keyword('fadeout'):
            fadeout = l.simple_expression()
            if fadeout is None: 
                renpy.error('expected simple expression')

            continue
        
        if l.keyword('fadein'):
            fadein = l.simple_expression()
            if fadein is None: 
                renpy.error('expected simple expression')

            continue
        
        if l.keyword('channel'):
            channel = l.simple_expression()
            if channel is None:
                renpy.error('expected simple expression')

            continue

        if l.keyword('loop'):
            loop = True
            continue
            
        if l.keyword('noloop'):
            loop = False
            continue

        if l.keyword('if_changed'):
            if_changed = True
            continue
        
        renpy.error('could not parse statement.')

    return dict(file=file,
                fadeout=fadeout,
                fadein=fadein,
                channel=channel,
                loop=loop,
                if_changed=if_changed)

def execute_play_music(p):

    if p["channel"] is not None:
        channel = eval(p["channel"])
    else:
        channel = "music"
    
    renpy.music.play(eval(p["file"]),
                     fadeout=eval(p["fadeout"]),
                     fadein=eval(p["fadein"]),
                     channel=channel,
                     loop=p.get("loop", None),
                     if_changed=p.get("if_changed", False))

def predict_play_music(p):
    return [ ]

def lint_play_music(p, channel="music"):

    file = _try_eval(p["file"], 'filename')

    if p["channel"] is not None:
        channel = _try_eval(p["channel"], 'channel')
        
    if not isinstance(file, list):
        file = [ file ]

    for fn in file:
        if isinstance(fn, basestring):
            try:
                if not renpy.music.playable(fn, channel):
                    renpy.error("%r is not loadable" % fn)
            except:
                pass
                    
register('play music',
                          parse=parse_play_music,
                          execute=execute_play_music,
                          predict=predict_play_music,
                          lint=lint_play_music)

# From here on, we'll steal bits of other statements when defining other
# statements.

def parse_queue_music(l):

    file = l.simple_expression()
    if not file:
        renpy.error("queue requires a file")

    channel = None
    loop = None
    
    while not l.eol():
    
        if l.keyword('channel'):
            channel = l.simple_expression()
            if channel is None:
                renpy.error('expected simple expression')

        if l.keyword('loop'):
            loop = True
            continue
            
        if l.keyword('noloop'):
            loop = False
            continue

        renpy.error('expected end of line')

    return dict(file=file, channel=channel, loop=loop)

def execute_queue_music(p):
    if p["channel"] is not None:
        channel = eval(p["channel"])
    else:
        channel = "music"
    
    renpy.music.queue(
        eval(p["file"]),
        channel=channel,
        loop=p.get("loop", None))


register('queue music',
                          parse=parse_queue_music,
                          execute=execute_queue_music,
                          lint=lint_play_music)

def parse_stop_music(l):
    fadeout = "None"

    if l.keyword("fadeout"):
        fadeout = l.simple_expression()

    channel = None
        
    if l.keyword('channel'):
        channel = l.simple_expression()
        if channel is None:
            renpy.error('expected simple expression')

    if not l.eol():
        renpy.error('expected end of line')

    if fadeout is None: 
        renpy.error('expected simple expression')

    return dict(fadeout=fadeout, channel=channel)

def execute_stop_music(p):
    if p["channel"] is not None:
        channel = eval(p["channel"])
    else:
        channel = "music"
    
    renpy.music.stop(fadeout=eval(p["fadeout"]), channel=channel)

register('stop music',
                          parse=parse_stop_music,
                          execute=execute_stop_music)


# Sound statements. They share alot with the equivalent music
# statements.

def execute_play_sound(p):
    
    if p["channel"] is not None:
        channel = eval(p["channel"])
    else:
        channel = "sound"

    fadeout = eval(p["fadeout"]) or 0
        
    renpy.sound.play(eval(p["file"]),
                     fadeout=fadeout,
                     fadein=eval(p["fadein"]),
                     channel=channel)

def lint_play_sound(p, lint_play_music=lint_play_music):
    return lint_play_music(p, channel="sound")
    
register('play sound',
                          parse=parse_play_music,
                          execute=execute_play_sound,
                          lint=lint_play_sound)

def execute_queue_sound(p):
    if p["channel"] is not None:
        channel = eval(p["channel"])
    else:
        channel = "sound"

    renpy.sound.queue(eval(p["file"]), channel=channel)


register('queue sound',
                          parse=parse_queue_music,
                          execute=execute_queue_sound,
                          lint=lint_play_music)

def execute_stop_sound(p):
    if p["channel"] is not None:
        channel = eval(p["channel"])
    else:
        channel = "sound"

    fadeout = eval(p["fadeout"]) or 0

    renpy.sound.stop(fadeout=fadeout, channel=channel)

register('stop sound',
                          parse=parse_stop_music,
                          execute=execute_stop_sound)


# Generic play/queue/stop statements. These take a channel name as
# the second thing.

def parse_play_generic(l, parse_play_music=parse_play_music):
    channel = l.name()

    if channel is None:
        renpy.error('play requires a channel')

    rv = parse_play_music(l)
    if rv["channel"] is None:
        rv["channel"] = repr(channel)

    return rv

def parse_queue_generic(l, parse_queue_music=parse_queue_music):
    channel = l.name()

    if channel is None:
        renpy.error('queue requires a channel')

    rv = parse_queue_music(l)
    if rv["channel"] is None:
        rv["channel"] = repr(channel)

    return rv

def parse_stop_generic(l, parse_stop_music=parse_stop_music):
    channel = l.name()

    if channel is None:
        renpy.error('stop requires a channel')

    rv = parse_stop_music(l)
    if rv["channel"] is None:
        rv["channel"] = repr(channel)

    return rv

def lint_play_generic(p, lint_play_music=lint_play_music):
    channel = eval(p["channel"])
    
    if not renpy.music.channel_defined(channel):
        renpy.error("channel %r is not defined" % channel)

    lint_play_music(p, channel)

def lint_stop_generic(p):
    channel = eval(p["channel"])
    
    if not renpy.music.channel_defined(channel):
        renpy.error("channel %r is not defined" % channel)

register('play',
                          parse=parse_play_generic,
                          execute=execute_play_music,
                          predict=predict_play_music,
                          lint=lint_play_generic)

register('queue',
                          parse=parse_queue_generic,
                          execute=execute_queue_music,
                          lint=lint_play_generic)
        
register('stop',
                          parse=parse_stop_generic,
                          execute=execute_stop_music,
                          lint=lint_stop_generic)


##########################################################################
# "window show" and "window hide" statements.

def parse_window(l):
    p = l.simple_expression()
    if not l.eol():
        renpy.error('expected end of line')

    return p
        
def lint_window(p):
    if p is not None:
        _try_eval(p, 'window transition')

def execute_window_show(p):
    if store._window:
        return

    if p is not None:
        trans = eval(p)
        
    renpy.with_statement(None)
    store._window = True
    renpy.with_statement(trans)
    
def execute_window_hide(p):
    if not _window:
        return
    
    if p is not None:
        trans = eval(p)

    renpy.with_statement(None)
    store._window = False
    renpy.with_statement(trans)

register('window show',
                          parse=parse_window,
                          execute=execute_window_show,
                          lint=lint_window)

register('window hide',
                          parse=parse_window,
                          execute=execute_window_hide,
                          lint=lint_window)

##########################################################################
# Pause statement.

def parse_pause(l):

    delay = l.simple_expression()

    if not l.eol():
        renpy.error("expected end of line.")

    return { "delay" : delay }

def lint_pause(p):

    if p["delay"]:
        _try_eval(p["delay"], 'pause statement')
        
def execute_pause(p):

    if p["delay"]:
        delay = eval(p["delay"])
        renpy.with_statement(Pause(delay))
    else:
        renpy.pause()


register('pause',
                          parse=parse_pause,
                          lint=lint_pause,
                          execute=execute_pause)

                          

def _try_eval(e, what):
    try:
        return eval(e)
    except:
        renpy.error('unable to evaluate %s %r' % (what, e))

##############################################################################
# Screen-related statements.

def parse_show_call_screen(l):

    # Parse a name.
    name = l.require(l.name)

    # Parse the list of arguments.
    arguments = renpy.parser.parse_arguments(l)
    l.expect_eol()
        
    return dict(name=name, arguments=arguments)

def parse_hide_screen(l):
    name = l.require(l.name)

    l.expect_eol()

    return dict(name=name)

def predict_screen(p):
    if not p["arguments"]:
        renpy.predict_screen(p["arguments"])

def execute_show_screen(p):

    name = p["name"]
    a = p["arguments"]

    args = [ ]
    kwargs = { }

    if a is not None:

        for k, v in a.arguments:
            if k is not None:
                kwargs[k] = eval(v)
            else:
                args.append(eval(v))

        if a.extrapos is not None:
            args.extend(eval(a.extrapos))
            
        if a.extrakw is not None:
            kwargs.update(eval(a.extrakw))

    renpy.show_screen(name, *args, **kwargs)

def execute_call_screen(p):
    name = p["name"]
    a = p["arguments"]

    args = [ ]
    kwargs = { }

    if a is not None:

        for k, v in a.arguments:
            if k is not None:
                kwargs[k] = eval(v)
            else:
                args.append(eval(v))

        if a.extrapos is not None:
            args.extend(eval(a.extrapos))
            
        if a.extrakw is not None:
            kwargs.update(eval(a.extrakw))

    store._return = renpy.call_screen(name, *args, **kwargs)

def execute_hide_screen(p):
    name = p["name"]
    renpy.hide_screen(name)
    
def lint_screen(p):
    name = p["name"]
    if not renpy.has_screen(name):
        renpy.error("Screen %s does not exist." % name)

    
register("show screen",
                          parse=parse_show_call_screen,
                          execute=execute_show_screen,
                          predict=predict_screen,
                          lint=lint_screen)

register("call screen",
                          parse=parse_show_call_screen,
                          execute=execute_call_screen,
                          predict=predict_screen,
                          lint=lint_screen)

register("hide screen",
                          parse=parse_hide_screen,
                          execute=execute_hide_screen)

        

def parse_jump_in(l):
    is_expr = False
    firstword = l.word()
    if firstword == "expression":
        label = l.simple_expression()
        is_expr = True
    else:
        label = firstword
    if not label:
        renpy.error("parse error when evaluating custom jump")
    return dict(label=label,is_expr=is_expr)

def execute_jump_in(p):
    global save_name, last_scene_label
    if p["is_expr"]:
        label = eval(p["label"])
    else:
        label = p["label"]
    last_scene_label = label
    save_name = label
    scene_register(label)
    renpy.jump(label)

def predict_jump_in(p):
    return []

def next_jump_in(p):
    return p["label"]

def lint_jump_in(p):
    label = p["label"]
    if not label:
        renpy.error("no target given to custom jump statement.")
    if not renpy.has_label(label) and not p["is_expr"]:
        renpy.error("custom jump to nonexistent label.")

def execute_jump_out(p):
    global playthroughflag, mycontext, ss_desc
    nvl_clear()
    if not playthroughflag:
        replay_end()
    execute_jump_in(p)

register('jump_in',
                              parse=parse_jump_in,
                              execute=execute_jump_in,
                              predict=predict_jump_in,
                              lint=lint_jump_in,
                              next=next_jump_in)

register('jump_out',
                              parse=parse_jump_in,
                              execute=execute_jump_out,
                              predict=predict_jump_in,
                              lint=lint_jump_in,
                              next=next_jump_in)
def parse_nvl_show_hide(l):
    rv = l.simple_expression()
    if rv is None:
        renpy.error('expected simple expression')

    if not l.eol():
        renpy.error('expected end of line')

    return rv
        
def lint_nvl_show_hide(trans):
    _try_eval(trans, 'transition')

def execute_nvl_show(trans):
    nvl_show(eval(trans))

def execute_nvl_hide(trans):
    nvl_hide(eval(trans))

register("nvl show",
                          parse=parse_nvl_show_hide,
                          execute=execute_nvl_show,
                          lint=lint_nvl_show_hide)

register("nvl hide",
                          parse=parse_nvl_show_hide,
                          execute=execute_nvl_hide,
                          lint=lint_nvl_show_hide)

def parse_nvl_clear(l):
    if not l.eol():
        renpy.error('expected end of line')

    return None

def execute_nvl_clear(parse):
    nvl_clear()

def scry_nvl_clear(parse, scry):
    scry.nvl_clear = True
    
register('nvl clear',
                          parse=parse_nvl_clear,
                          execute=execute_nvl_clear,
                          scry=scry_nvl_clear)

