# OCaml esy project

A project which demonstrates an OCaml workflow with esy.

## Installation

    % npm install .

## Build

    % npm run build

## Clean build artifcats

    % npm run clean

## Shell into build environment

    % npm run shell

## Run preconfigured OCaml REPL

    % npm run ocaml

## Merlin

Merlin integration is included. If your editor of choice has Merlin
plugin/extension then you can run:

    % npm run editor

and start using it (`$EDITOR` env var must point to your editor of choice).

## Merlin + Vim

Merlin ships with Vim plugin, to enable it add the following lines to `.vimrc`:

    if $merlin__install != ''
      execute "set rtp+=" . $merlin__install . "/share/merlin/vim"
    endif
