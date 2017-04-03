#
# Configuration
#

# List of ocamlfind libraries used in a project
DEPENDENCIES = lambda-term lwt

# ocamlbuild tags (same syntax as in _tags file)
define OCB_TAGS
	true:bin_annot \
	${DEPENDENCIES:%=true:package(%)} \
	<node_modules>:-traverse
endef

# ocamlbuild flags
define OCB_FLAGS
	-no-links \
	-use-ocamlfind \
	${OCB_TAGS:%=-tag-line "%"} \
	-I lib -I bin \
	-build-dir $$cur__target_dir
endef

OCB = ocamlbuild ${OCB_FLAGS}

#
# Shortcuts
#

all: build
build: native byte lib
install: install-bin install-lib

#
# Build targets
#

lib:
	@${OCB} libhello.cma
	@${OCB} libhello.cmxa
	@${OCB} libhello.cmxs

native:
	@${OCB} hello.native

byte:
	@${OCB} hello.byte

#
# Installation
#

install-lib: lib
	@ocamlfind install $$cur__name lib/META $$cur__target_dir/lib/libhello.*

install-bin: native
	@ln -s $$cur__target_dir/bin/hello.native $$cur__bin/hello
	@ln -s $$cur__target_dir/bin/hello.byte $$cur__bin/hello.byte

#
# Utilities
#

clean:
	@${OCB} -clean

.DEFAULT: all
.PHONY: all build install clean lib native byte install-lib install-bin
