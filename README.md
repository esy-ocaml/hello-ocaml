# OCaml esy project

[![Build Status](https://travis-ci.org/andreypopp/esy-ocaml-project.svg?branch=master)](https://travis-ci.org/andreypopp/esy-ocaml-project)

A project which demonstrates an OCaml workflow with `esy`.

`esy` is an overlay on top of `package.json` based package managers, that
enables `package.json` packages to use compilers and environments quickly, and
easily.

## Usage

You need Esy, you can install the beta using `npm install -g`.

    % npm install -g git://github.com/jordwalke/esy.git#beta-v0.0.2
    
Then you can install the project using:

    % esy install

Then build the project:

    % esy build
    
Run compiled executables:

    % esy ./hello.byte
    % esy ./hello.native
    
Note that you need to run them with Esy as they rely on the environment.

To clean built artefacts:

    % esy clean

Shell into build environment:

    % esy shell

Run preconfigured OCaml REPL:

    % esy utop
    
## Merlin

Merlin integration is included. If your editor of choice has Merlin
plugin/extension then you can run:

    % esy $EDITOR

and start using it (`$EDITOR` env var must point to your editor of choice).

## Merlin + Vim

This project also builds the Merlin IDE plugin as a dependency, which includes
Vim support. To enable it install the tiny Vim plugin which will load Merlin's
Vim support from the environment, by putting this in your `.vimrc`.

    " If using NeoBundle(recommended)
    NeoBundle 'reasonml/vim-reason-loader'

    " Using Vundle
    Bundle 'reasonml/vim-reason-loader'


Then whenever starting Vim inside the project's `esy` environment, that vim
plugin will automatically load the *actual* Merlin plugin.


    % esy vim

    % # Or
    % esy $EDITOR
