include $(opam_alpha_solvuu_build__install)/lib/solvuu-build/solvuu.mk

.DEFAULT: all

_build/%: FORCE
	$(OCAMLBUILD) $(patsubst _build/%,%,$@)

all: native byte _build/META _build/.merlin _build/.ocamlinit
